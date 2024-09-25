import { I18nObject, SimpleI18n, getString, getArray, getRecord } from './util'

const fallback: I18nObject = {
  title: 'CrowdTrust',
  future: '<span>The</span>Future<span>of</span>Crowdfunding <span>is Here</span> ',
  start: 'GET STARTED',
  browse: 'BROWSE PROJECTS',
  goal: '% Goal Met',
  welcome_title: 'Welcome to CrowdTrust - Empowering Creators, Protecting Backers',
  welcome_text:
    'CrowdTrust is a next-generation crowdfunding platform designed to revolutionize how creators bring their ideas to life and how backers support innovative projects. By combining advanced technology with a user-centric approach, CrowdTrust offers a secure, transparent, and successful crowdfunding experience for all.',
  why_title: 'Why Choose CrowdTrust?',
  why1_title: 'Comprehensive Support',
  why1_text:
    'Whether you’re a first-time creator or an experienced entrepreneur, CrowdTrust provides access to a wide range of services within our Market Network. From marketing and design to legal support, you’ll find everything you need to launch a successful campaign.',
  why2_title: 'Security First',
  why2_text:
    'Our unique TrustGuard system ensures that backer funds are protected. Funds are only released when project milestones are met, giving backers confidence that their contributions are being used effectively.',
  why3_title: 'Global Reach',
  why3_text:
    'CrowdTrust breaks down geographical barriers, allowing creators and backers from all over the world to connect and collaborate. Our platform supports multi-currency transactions and offers multi-language support, making global participation seamless.',
  why4_title: 'AI-Powered Success',
  why4_text:
    'CrowdTrust integrates AI and machine learning tools to help creators optimize their campaigns. Get personalized insights, predictive analytics, and real-time recommendations to increase your chances of reaching your goals.',
  join_title: 'Join the CrowdTrust Community',
  join_text:
    'Whether you’re looking to fund your next big idea or support innovative projects, CrowdTrust offers a secure, transparent, and supportive platform to make it happen.',
  explore: 'EXPLORE PROJECTS',
  browse2: 'Browse Campaigns >',
  launch: 'LAUNCH A CAMPAIGN',
  start2: 'Get Started >',
  learn: 'LEARN MORE',
  about: 'About Us >',
  faq: 'Frequently Asked Questions >',
  get_started: 'Get Started with CrowdTrust Today',
  start_text:
    'Whether you’re a creator or a backer, CrowdTrust is your gateway to a secure, innovative, and successful crowdfunding experience. Join us and be part of the future of crowdfunding.',
  join: 'JOIN CROWDTRUST',
  back: {
    title: 'Back With Us',
  },
  services: {
    title: 'Our Services',
  },
  how: {
    title: 'How It Works',
  },
  connect: {
    title: 'Connect',
    join: 'Join Us',
  },
  footer: {
    copyright: '© 2024 CrowdTrust - All Rights Reserved.',
    resources: 'Resources',
    whitepaper: 'Whitepaper',
    faq: 'FAQs',
    links: 'Quick Links',
    browse: 'Browse Projects',
    launch: 'Launch A Project',
    trust: 'Trust & Safety',
    terms: 'Terms',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
  },
}

export const i18n = new SimpleI18n(fallback)
export const ts = getString(i18n)
export const ta = getArray(i18n)
export const tr = getRecord(i18n)
