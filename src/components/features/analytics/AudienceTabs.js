'use client';

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe, faLocationDot, faDesktop, faListCheck, faArrowRight, faFilter, faClock
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

const TABS = [
  { id: 'sources', label: 'Traffic Sources', icon: faGlobe, color: 'indigo' },
  { id: 'locations', label: 'Top Locations', icon: faLocationDot, color: 'rose' },
  { id: 'devices', label: 'Devices', icon: faDesktop, color: 'emerald' },
  { id: 'log', label: 'Traffic Timestamps & Logs', icon: faListCheck, color: 'violet' },
];

const barColors = {
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
};

const badgeColors = {
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export default function AudienceTabs({
  trafficSources = [],
  topLocations = [],
  devices = [],
  totalSourceViews = 0,
  uniqueVisitors = 0,
  returningVisitors = 0,
  recentSessions = [],
}) {
  const [activeTab, setActiveTab] = useState('sources');
  const [sourceFilter, setSourceFilter] = useState('All');

  const currentTabInfo = TABS.find(t => t.id === activeTab);

  // Filter recentSessions by source if sourceFilter !== 'All'
  const filteredSessions = sourceFilter === 'All'
    ? recentSessions
    : recentSessions.filter(s => s.source.toLowerCase() === sourceFilter.toLowerCase());

  const handleSourceSelect = (sourceName) => {
    setSourceFilter(sourceName);
    setActiveTab('log');
  };

  const getSubhead = () => {
    switch (activeTab) {
      case 'sources':
        return `${uniqueVisitors} unique ${uniqueVisitors === 1 ? 'visitor' : 'visitors'} · ${returningVisitors} returning`;
      case 'locations':
        return 'Geographic breakdown of your visitors';
      case 'devices':
        return 'Device types used to access your page';
      case 'log':
        return sourceFilter === 'All'
          ? `Showing all ${recentSessions.length} recent sessions with exact timestamps`
          : `Filtered by ${sourceFilter} (${filteredSessions.length} recorded events)`;
      default:
        return '';
    }
  };

  return (
    <div className="glass glass-hover rounded-2xl p-6 transition-all duration-300">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/60 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center justify-center p-2 rounded-xl border ${badgeColors[currentTabInfo.color]}`}>
              <FontAwesomeIcon icon={currentTabInfo.icon} className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Audience Analytics & Timestamps
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 ml-1">
            {getSubhead()}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 dark:bg-[#121215] border border-gray-200/60 dark:border-zinc-800 rounded-xl">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-md border border-gray-200/50 dark:border-zinc-700/80'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={`w-3.5 h-3.5 ${isActive ? (tab.color === 'indigo' ? 'text-indigo-500' : tab.color === 'rose' ? 'text-rose-500' : tab.color === 'emerald' ? 'text-emerald-500' : 'text-violet-500') : 'opacity-70'}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[240px]">
        {/* TRAFFIC SOURCES TAB */}
        {activeTab === 'sources' && (
          <div>
            {trafficSources.length > 0 ? (
              <div className="space-y-3">
                {trafficSources.map((item) => {
                  const lastSeenText = item.lastSeen
                    ? format(new Date(item.lastSeen), 'MMM d, h:mm a')
                    : 'No recent activity';

                  return (
                    <div
                      key={item.label}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-[#141417] border border-gray-200/50 dark:border-zinc-800/80 hover:border-indigo-500/50 transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {item.label}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">
                            {item.count} {item.count === 1 ? 'visit' : 'visits'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-indigo-400" />
                          <span>Last clicked/visited: <strong className="text-gray-700 dark:text-zinc-200 font-semibold">{lastSeenText}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-28 sm:w-36 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${Math.max((item.count / (totalSourceViews || 1)) * 100, 5)}%` }}
                          />
                        </div>
                        <button
                          onClick={() => handleSourceSelect(item.label)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold transition-all duration-200"
                          title={`View exact timestamps for ${item.label}`}
                        >
                          <span>Inspect Timestamps</span>
                          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-zinc-500">
                <FontAwesomeIcon icon={faGlobe} className="text-4xl mb-3 opacity-40 text-indigo-400" />
                <p className="text-sm font-medium">No visitor traffic data recorded yet</p>
              </div>
            )}
          </div>
        )}

        {/* TOP LOCATIONS TAB */}
        {activeTab === 'locations' && (
          <div>
            {topLocations.length > 0 ? (
              <div className="space-y-3">
                {topLocations.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-[#141417] border border-gray-200/50 dark:border-zinc-800/80 hover:border-rose-500/30 transition-all">
                    <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">{item.count}</span>
                    <div className="w-28 sm:w-40 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-rose-500"
                        style={{ width: `${Math.max((item.count / (totalSourceViews || 1)) * 100, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-zinc-500">
                <FontAwesomeIcon icon={faLocationDot} className="text-4xl mb-3 opacity-40 text-rose-400" />
                <p className="text-sm font-medium">No location data yet — appears once visitors view your page</p>
              </div>
            )}
          </div>
        )}

        {/* DEVICES TAB */}
        {activeTab === 'devices' && (
          <div>
            {devices.length > 0 ? (
              <div className="space-y-3">
                {devices.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-[#141417] border border-gray-200/50 dark:border-zinc-800/80 hover:border-emerald-500/30 transition-all">
                    <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">{item.count}</span>
                    <div className="w-28 sm:w-40 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${Math.max((item.count / (totalSourceViews || 1)) * 100, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-zinc-500">
                <FontAwesomeIcon icon={faDesktop} className="text-4xl mb-3 opacity-40 text-emerald-400" />
                <p className="text-sm font-medium">No device data collected yet</p>
              </div>
            )}
          </div>
        )}

        {/* TRAFFIC TIMESTAMPS & LOGS TAB */}
        {activeTab === 'log' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-gray-200/40 dark:border-zinc-800/60">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mr-2">
                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 text-violet-400" />
                Filter Source:
              </span>
              <button
                onClick={() => setSourceFilter('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sourceFilter === 'All'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-white'
                }`}
              >
                All Sources ({recentSessions.length})
              </button>

              {trafficSources.map(s => {
                const isSelected = sourceFilter.toLowerCase() === s.label.toLowerCase();
                const sessionCount = recentSessions.filter(rs => rs.source.toLowerCase() === s.label.toLowerCase()).length;
                return (
                  <button
                    key={s.label}
                    onClick={() => setSourceFilter(s.label)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label} ({sessionCount})
                  </button>
                );
              })}
            </div>

            {/* Session List */}
            {filteredSessions.length > 0 ? (
              <div className="space-y-3">
                {filteredSessions.map((s, index) => (
                  <div
                    key={index}
                    className="border border-gray-200/80 dark:border-zinc-800/80 rounded-xl p-4 bg-gray-50/50 dark:bg-[#141417] hover:border-violet-500/40 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 pb-2 border-b border-gray-200/40 dark:border-zinc-800/60">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-bold uppercase tracking-wider">
                          via {s.source}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {s.location ? `Visitor from ${s.location}` : 'Visitor'}
                        </span>
                        {s.isReturning && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                            Returning
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium">
                          {s.device}
                        </span>
                      </div>

                      {/* Exact Date & Time Stamp */}
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                        <span>{format(new Date(s.when), 'MMM d, yyyy · h:mm:ss a')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-300 mt-1">
                      <span className="font-semibold text-gray-400 dark:text-zinc-500">Actions:</span>
                      <span className="font-medium text-gray-800 dark:text-zinc-200 capitalize">{s.actions.join(' → ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-zinc-500">
                <FontAwesomeIcon icon={faListCheck} className="text-4xl mb-3 opacity-40 text-violet-400" />
                <p className="text-sm font-medium">No recorded traffic sessions matching &quot;{sourceFilter}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
