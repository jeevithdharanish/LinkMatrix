import {
  faDiscord, faFacebook, faGithub, faInstagram, faTelegram,
  faTiktok, faWhatsapp, faYoutube, faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMobile, faFileAlt, faCode } from "@fortawesome/free-solid-svg-icons";

// Single source of truth for the supported social buttons.
// Adding a platform: add its icon here and (optionally) a style in buttonStyles.
export const buttonsIcons = {
  email: faEnvelope,
  mobile: faMobile,
  instagram: faInstagram,
  facebook: faFacebook,
  linkedin: faLinkedin,
  youtube: faYoutube,
  github: faGithub,
  geeksforgeeks: faCode,
  resume: faFileAlt,
  discord: faDiscord,
  tiktok: faTiktok,
  whatsapp: faWhatsapp,
  telegram: faTelegram,
};

// Resolve a button's stored value to the URL the public page actually links to
export function buttonLink(key, value) {
  if (key === 'mobile') return 'tel:' + value;
  if (key === 'email') return 'mailto:' + value;
  return value;
}

// Editor metadata for every supported platform (icon comes from buttonsIcons)
export const allButtons = [
  { key: 'email', label: 'e-mail', placeholder: 'test@example.com' },
  { key: 'mobile', label: 'mobile', placeholder: '+919878976543' },
  { key: 'instagram', label: 'instagram', placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'facebook', placeholder: 'https://facebook.com/profile' },
  { key: 'linkedin', label: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
  { key: 'youtube', label: 'youtube', placeholder: 'https://youtube.com/@channel' },
  { key: 'github', label: 'github', placeholder: 'https://github.com/username' },
  { key: 'geeksforgeeks', label: 'geeksforgeeks', placeholder: 'https://auth.geeksforgeeks.org/user/username' },
  { key: 'resume', label: 'resume', placeholder: 'https://drive.google.com/file/d/your-resume-link' },
  { key: 'discord', label: 'discord', placeholder: 'https://discord.gg/invite' },
  { key: 'tiktok', label: 'tiktok', placeholder: 'https://tiktok.com/@username' },
  { key: 'whatsapp', label: 'whatsapp', placeholder: 'https://wa.me/919878976543' },
  { key: 'telegram', label: 'telegram', placeholder: 'https://t.me/username' },
].map(b => ({ ...b, icon: buttonsIcons[b.key] }));
