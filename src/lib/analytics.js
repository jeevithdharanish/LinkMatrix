import { Event } from "@/models/Event";
import { DeletedLink } from "@/models/DeletedLink";
import { Project } from "@/models/Project";
import { Page } from "@/models/Page";
import { connectToDatabase } from "@/lib/mongoClient";
import { buttonLink } from "@/lib/socialButtons";
import { sourceFromReferrer, deviceFromUA, locationLabel } from "@/lib/track";
import { format, isToday, subDays, parseISO } from "date-fns";
import { unstable_cache } from "next/cache";

// Total + last-7-days click counts keyed by clicked URL
function buildClickMaps(clicks, sevenDaysAgo) {
  const total = new Map();
  const week = new Map();
  clicks.forEach(click => {
    const url = click.uri;
    total.set(url, (total.get(url) || 0) + 1);
    if (new Date(click.createdAt) >= sevenDaysAgo) {
      week.set(url, (week.get(url) || 0) + 1);
    }
  });
  return { total, week };
}

// Last 7 days vs the 7 days before
function weeklyTrend(events, sevenDaysAgo, fourteenDaysAgo) {
  const trend = { current: 0, previous: 0 };
  events.forEach(e => {
    const d = new Date(e.createdAt);
    if (d >= sevenDaysAgo) trend.current++;
    else if (d >= fourteenDaysAgo) trend.previous++;
  });
  return trend;
}

// Roll up aggregation rows ({_id, count}) into sorted {label, count} buckets
function countBy(rows, getLabel) {
  const counts = new Map();
  rows.forEach(row => {
    const label = getLabel(row);
    counts.set(label, (counts.get(label) || 0) + row.count);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

// Group recent events (sorted newest → oldest) into visitor sessions:
// same visitor with events ≤30 min apart counts as one visit.
function groupSessions(recentEvents, visitorAgg, urlLabels) {
  const SESSION_GAP = 30 * 60 * 1000;
  const sessions = [];
  const openSessionByVisitor = new Map();

  recentEvents.forEach(e => {
    const open = openSessionByVisitor.get(e.visitorHash);
    if (open && (new Date(open.oldestAt) - new Date(e.createdAt)) < SESSION_GAP) {
      open.events.push(e);
      open.oldestAt = e.createdAt;
    } else {
      const session = {
        events: [e],
        newestAt: e.createdAt,
        oldestAt: e.createdAt,
        visitorHash: e.visitorHash,
        country: e.country,
        city: e.city,
        userAgent: e.userAgent,
      };
      openSessionByVisitor.set(e.visitorHash, session);
      sessions.push(session);
    }
  });

  const viewsByVisitor = new Map(visitorAgg.map(v => [v._id, v.views]));

  return sessions.slice(0, 10).map(s => {
    const viewEvent = s.events.find(e => e.type === 'view');
    const actions = [...s.events].reverse().map(e =>
      e.type === 'view' ? 'Viewed page' : `Clicked ${urlLabels.get(e.uri) || e.uri}`
    );
    return {
      when: s.newestAt,
      source: sourceFromReferrer(viewEvent?.referrer || ''),
      location: locationLabel(s.country, s.city),
      device: deviceFromUA(s.userAgent),
      isReturning: (viewsByVisitor.get(s.visitorHash) || 0) > 1,
      actions,
    };
  });
}

// Fetches and derives everything the analytics dashboard renders.
// The owner's own visits (isOwner) are excluded everywhere; `tracked` limits
// visitor-level insights to events captured since visitor tracking was added.
async function getAnalyticsRaw(page, ownerEmail) {
  const notOwner = { isOwner: { $ne: true } };
  const tracked = { visitorHash: { $exists: true, $nin: [''] } };
  const trackedViews = { type: 'view', uri: page.uri, ...notOwner, ...tracked };

  const [
    allClicks, deletedLinks, groupedViews, projects,
    visitorAgg, sourceAgg, geoAgg, deviceAgg, heatmapAgg, recentEvents,
  ] = await Promise.all([
    Event.find({ page: page.uri, type: 'click', ...notOwner }).lean(),
    DeletedLink.find({ pageUri: page.uri, owner: ownerEmail }).lean(),
    Event.aggregate([
      { $match: { type: 'view', uri: page.uri, ...notOwner } },
      { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Project.find({ owner: ownerEmail, pageUri: page.uri }).lean(),
    Event.aggregate([
      { $match: { page: page.uri, ...notOwner, ...tracked } },
      { $sort: { createdAt: 1 } },
      { $group: {
          _id: '$visitorHash',
          views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } },
          clicks: { $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] } },
          referrer: { $first: { $cond: [{ $eq: ['$type', 'view'] }, '$referrer', null] } },
          clickedUris: { $push: { $cond: [{ $eq: ['$type', 'click'] }, '$uri', null] } }
      } },
    ]),
    Event.aggregate([
      { $match: trackedViews },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
    ]),
    Event.aggregate([
      { $match: trackedViews },
      { $group: { _id: { country: '$country', city: '$city', referrer: '$referrer' }, count: { $sum: 1 } } },
    ]),
    Event.aggregate([
      { $match: trackedViews },
      { $group: { _id: '$userAgent', count: { $sum: 1 } } },
    ]),
    Event.aggregate([
      { $match: trackedViews },
      { $project: {
          dayOfWeek: { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Kolkata" } },
          hourOfDay: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } }
      }},
      { $group: {
          _id: { dayOfWeek: "$dayOfWeek", hourOfDay: "$hourOfDay" },
          count: { $sum: 1 }
      }}
    ]),
    Event.find({ page: page.uri, ...notOwner, ...tracked }).sort({ createdAt: -1 }).limit(60).lean(),
  ]);

  // Split clicks by type (events without clickType are legacy link clicks)
  const linkClicks = allClicks.filter(c => c.clickType === 'link' || !c.clickType);
  const socialClicks = allClicks.filter(c => c.clickType === 'social');
  const projectClicks = allClicks.filter(c => c.clickType === 'project');

  // Totals
  const totalViews = groupedViews.reduce((acc, curr) => acc + curr.count, 0);
  const totalLinkClicks = linkClicks.length;
  const totalSocialClicks = socialClicks.length;
  const totalProjectClicks = projectClicks.length;
  const clickRate = totalViews > 0 ? ((totalLinkClicks / totalViews) * 100).toFixed(1) : 0;

  // Today's stats
  const today = new Date();
  const todayViews = groupedViews.find(v => v._id === format(today, 'yyyy-MM-dd'))?.count || 0;
  const todayLinkClicks = linkClicks.filter(c => isToday(new Date(c.createdAt))).length;
  const todaySocialClicks = socialClicks.filter(c => isToday(new Date(c.createdAt))).length;
  const todayProjectClicks = projectClicks.filter(c => isToday(new Date(c.createdAt))).length;
  const todayClickRate = todayViews > 0 ? ((todayLinkClicks / todayViews) * 100).toFixed(1) : 0;

  // Week-over-week trends
  const sevenDaysAgo = subDays(today, 7);
  const fourteenDaysAgo = subDays(today, 14);
  const linkTrend = weeklyTrend(linkClicks, sevenDaysAgo, fourteenDaysAgo);
  const socialTrend = weeklyTrend(socialClicks, sevenDaysAgo, fourteenDaysAgo);
  const projectTrend = weeklyTrend(projectClicks, sevenDaysAgo, fourteenDaysAgo);
  const viewTrend = { current: 0, previous: 0 };
  groupedViews.forEach(v => {
    const d = parseISO(v._id);
    if (d >= sevenDaysAgo) viewTrend.current += v.count;
    else if (d >= fourteenDaysAgo) viewTrend.previous += v.count;
  });

  // Per-URL click maps for the performance sections
  const linkClickMaps = buildClickMaps(linkClicks, sevenDaysAgo);
  const socialClickMaps = buildClickMaps(socialClicks, sevenDaysAgo);
  const projectClickMaps = buildClickMaps(projectClicks, sevenDaysAgo);

  // All links ranked by clicks: active first, deleted appended after
  // (deleted links only count clicks made before their deletion)
  
  // Calculate Top Traffic Source per Link URL using visitor flow
  const urlSourceCounts = new Map();
  visitorAgg.forEach(v => {
    if (v.clicks > 0 && v.clickedUris && v.clickedUris.length > 0) {
      const src = sourceFromReferrer(v.referrer || '');
      v.clickedUris.forEach(uri => {
        if (!uri) return;
        if (!urlSourceCounts.has(uri)) urlSourceCounts.set(uri, new Map());
        const srcMap = urlSourceCounts.get(uri);
        srcMap.set(src, (srcMap.get(src) || 0) + 1);
      });
    }
  });

  const getTopSource = (uri) => {
    if (!urlSourceCounts.has(uri)) return null;
    const srcMap = urlSourceCounts.get(uri);
    let topSrc = null;
    let max = -1;
    for (const [src, count] of srcMap.entries()) {
      if (count > max) { max = count; topSrc = src; }
    }
    return topSrc;
  };

  const activeLinks = (page.links || []).map(link => ({
    title: link.title || 'Untitled Link',
    url: link.url,
    totalClicks: linkClickMaps.total.get(link.url) || 0,
    weekClicks: linkClickMaps.week.get(link.url) || 0,
    topSource: getTopSource(link.url),
    isDeleted: false
  })).sort((a, b) => b.totalClicks - a.totalClicks);
  
  const deletedLinksData = deletedLinks.map(link => {
    const clicksBeforeDeletion = linkClicks.filter(c =>
      c.uri === link.url && new Date(c.createdAt) <= new Date(link.deletedAt)
    );
    return {
      title: link.title || 'Deleted Link',
      url: link.url,
      totalClicks: clicksBeforeDeletion.length,
      weekClicks: clicksBeforeDeletion.filter(c => new Date(c.createdAt) >= sevenDaysAgo).length,
      topSource: getTopSource(link.url),
      isDeleted: true
    };
  }).sort((a, b) => b.totalClicks - a.totalClicks);
  const linksPerformance = [...activeLinks, ...deletedLinksData];

  // Chart: daily views and clicks (all click types) merged by day
  const clicksByDay = {};
  allClicks.forEach(c => {
    const day = format(new Date(c.createdAt), 'yyyy-MM-dd');
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });
  const viewsByDay = Object.fromEntries(groupedViews.map(v => [v._id, v.count]));
  const allDays = [...new Set([...Object.keys(viewsByDay), ...Object.keys(clicksByDay)])].sort();
  const chartData = allDays.map(date => ({
    date,
    views: viewsByDay[date] || 0,
    clicks: clicksByDay[date] || 0,
  }));

  // Visitor insights (events captured since visitor tracking began)
  const uniqueVisitors = visitorAgg.length;
  const returningVisitors = visitorAgg.filter(v => v.views > 1).length;
  const bouncedSessions = visitorAgg.filter(v => v.views > 0 && v.clicks === 0).length;
  const bounceRate = uniqueVisitors > 0 ? ((bouncedSessions / uniqueVisitors) * 100).toFixed(1) : 0;

  const lastSeenMap = new Map();
  recentEvents.forEach(e => {
    const src = sourceFromReferrer(e.referrer || '');
    if (!lastSeenMap.has(src) || new Date(e.createdAt) > new Date(lastSeenMap.get(src))) {
      lastSeenMap.set(src, e.createdAt);
    }
  });

  const trafficSources = countBy(sourceAgg, s => sourceFromReferrer(s._id || '')).map(item => ({
    ...item,
    lastSeen: lastSeenMap.get(item.label) || null,
  }));
  const totalSourceViews = trafficSources.reduce((acc, s) => acc + s.count, 0);
  const topLocations = countBy(geoAgg, g => locationLabel(g._id?.country, g._id?.city) || 'Unknown');
  const devices = countBy(deviceAgg, d => deviceFromUA(d._id || ''));

  // Detailed Geographic Stats for World Map & City Breakdown
  const countryMap = new Map();
  const cityMap = new Map();

  geoAgg.forEach(g => {
    const code = (g._id?.country || 'UNKNOWN').toUpperCase();
    const cName = locationLabel(g._id?.country, '') || 'Unknown';
    const city = g._id?.city || '';
    const fullLoc = locationLabel(g._id?.country, g._id?.city) || 'Unknown';
    const src = sourceFromReferrer(g._id?.referrer || '');

    // Country stats
    if (!countryMap.has(code)) {
      countryMap.set(code, { code, countryName: cName, views: 0, clicks: 0, sourceCounts: new Map() });
    }
    const cObj = countryMap.get(code);
    cObj.views += g.count;
    cObj.sourceCounts.set(src, (cObj.sourceCounts.get(src) || 0) + g.count);

    // City stats
    if (city) {
      if (!cityMap.has(fullLoc)) {
        cityMap.set(fullLoc, { locationName: fullLoc, city, code, views: 0, clicks: 0 });
      }
      const ctObj = cityMap.get(fullLoc);
      ctObj.views += g.count;
    }
  });

  // Count clicks per country and city
  allClicks.forEach(c => {
    const code = (c.country || 'UNKNOWN').toUpperCase();
    if (countryMap.has(code)) {
      countryMap.get(code).clicks += 1;
    }
    const fullLoc = locationLabel(c.country, c.city);
    if (cityMap.has(fullLoc)) {
      cityMap.get(fullLoc).clicks += 1;
    }
  });

  const countryStats = [...countryMap.values()].map(c => {
    let topSource = null;
    let maxCount = -1;
    for (const [src, count] of c.sourceCounts.entries()) {
      if (count > maxCount) { maxCount = count; topSource = src; }
    }
    
    // Clean up internal map
    const { sourceCounts, ...rest } = c;
    
    return {
      ...rest,
      topSource,
      ctr: c.views > 0 ? parseFloat(((c.clicks / c.views) * 100).toFixed(1)) : 0
    };
  }).sort((a, b) => b.views - a.views);

  const cityStats = [...cityMap.values()].map(c => ({
    ...c,
    ctr: c.views > 0 ? parseFloat(((c.clicks / c.views) * 100).toFixed(1)) : 0
  })).sort((a, b) => b.views - a.views);

  const geoData = { countryStats, cityStats };

  // Heatmap formatting (transform aggregation to simple objects)
  const heatmapData = heatmapAgg.map(h => ({
    dayOfWeek: h._id.dayOfWeek,
    hourOfDay: h._id.hourOfDay,
    count: h.count
  }));

  // Friendly names for clicked URLs in the activity feed
  const urlLabels = new Map();
  (page.links || []).forEach(l => urlLabels.set(l.url, l.title || 'link'));
  Object.entries(page.buttons || {}).forEach(([key, value]) => {
    if (value) urlLabels.set(buttonLink(key, value), key);
  });
  projects.forEach(p => {
    if (p.githubLink) urlLabels.set(p.githubLink, `${p.title} (GitHub)`);
    if (p.liveLink) urlLabels.set(p.liveLink, `${p.title} (Live)`);
  });
  const recentSessions = groupSessions(recentEvents, visitorAgg, urlLabels);

  return {
    projects,
    totalViews, todayViews, viewTrend,
    totalLinkClicks, todayLinkClicks, linkTrend,
    totalSocialClicks, todaySocialClicks, socialTrend,
    totalProjectClicks, todayProjectClicks, projectTrend,
    clickRate, todayClickRate,
    socialClickMaps, projectClickMaps,
    linksPerformance, chartData,
    uniqueVisitors, returningVisitors, bounceRate,
    trafficSources, totalSourceViews, topLocations, devices,
    recentSessions,
    geoData,
    heatmapData,
  };
}

const getCachedAnalyticsRaw = unstable_cache(
  async (pageUri, ownerEmail) => {
    await connectToDatabase();
    const page = await Page.findOne({ uri: pageUri }).lean();
    if (!page) {
      throw new Error("Page not found");
    }
    const result = await getAnalyticsRaw(page, ownerEmail);
    // Custom JSON stringify replacer to convert ES6 Maps to plain JSON objects
    return JSON.parse(JSON.stringify(result, (key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    }));
  },
  ['analytics-data'],
  { revalidate: 30, tags: ['analytics'] }
);

export async function getAnalytics(pageUri, ownerEmail) {
  const data = await getCachedAnalyticsRaw(pageUri, ownerEmail);
  
  // Reconstruct Maps from plain objects for backward compatibility with components
  if (data.socialClickMaps) {
    data.socialClickMaps.total = new Map(Object.entries(data.socialClickMaps.total || {}));
    data.socialClickMaps.week = new Map(Object.entries(data.socialClickMaps.week || {}));
  }
  if (data.projectClickMaps) {
    data.projectClickMaps.total = new Map(Object.entries(data.projectClickMaps.total || {}));
    data.projectClickMaps.week = new Map(Object.entries(data.projectClickMaps.week || {}));
  }
  
  return data;
}
