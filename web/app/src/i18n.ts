import { I18nObject, SimpleI18n, getString, getArray, getRecord } from './util'

const fallback: I18nObject = {
  title: 'CrowdTrust',
  future: '<span>The</span>Future<span>of</span>Crowdfunding <span>is Here</span> ',
  start: 'GET STARTED',
  browse: 'BROWSE PROJECTS',
  goal: '% Goal Met',
  email: 'Email',
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
    why: 'Why Back with <span>CrowdTrust?</span>',
    text: 'Backing a project on CrowdTrust means more than just funding an idea—it’s about being part of a trusted, secure, and innovative community. Our platform is designed to protect your contributions and ensure that you’re supporting projects that are well-managed and transparent.',
    secure: '<span>Secure</span> Your Investment',
    secure_text:
      'With <span>TrustGuard</span>, your funds are safe and only released when milestones are met.',
    informed: 'Stay <span>Informed</span>',
    informed_text:
      'Receive regular updates and engage directly with creators throughout the campaign.',
    support: 'Support <span>Innovation</span>',
    support_text:
      'Help bring groundbreaking ideas to life and be part of a global community of forward-thinkers.',
  },
  services: {
    title: 'Our Services',
    services: 'Services',
    offer: 'We Offer',
    campaign: 'Campaign Management',
    campaign_text:
      'Launch and manage your crowdfunding campaign with ease. Our intuitive platform guides you through every step, from setting up your campaign to tracking progress and engaging with backers.',
    ai: 'AI-Enhanced Insights',
    ai_text:
      'Leverage our AI tools to analyze your campaign data and optimize strategies. Whether it’s audience targeting, pricing, or content creation, our AI-driven insights help you make informed decisions.',
    market: 'Market Network',
    market_text:
      'Access a curated marketplace of professional services. Need help with marketing, video production, or legal advice? The CrowdTrust Market Network connects you with experts who can help elevate your campaign.',
    security: 'TrustGuard Fund Security',
    security_text:
      'Protect your backers and build trust with TrustGuard. This innovative system holds funds in escrow until you meet pre-set milestones, ensuring that your backers’ contributions are used effectively.',
    community: 'Community Engagement',
    community_text:
      'Build and engage with a global community of backers and supporters. Use our platform’s tools to communicate with your audience, provide updates, and keep your campaign momentum strong.',
  },
  how: {
    title: 'How It Works',
  },
  connect: {
    title: 'Welcome to <span>CrowdTrust<span>',
    text: 'Join our community and support groundbreaking projects through the power of blockchain. Connect your MetaMask wallet to log in or register!',
    login: 'Log in / Register with MetaMask',
    secure: 'Securely access your account in just a few clicks.',
    join: 'Join Us',
    button: 'CONNECT',
    how: 'How It Works:',
    install:
      'If you don’t have MetaMask installed, <a href="https://metamask.io" target="_blank">download it here</a>.',
    click: 'Click above to connect your MetaMask wallet and verify your identity.',
    email: 'Add an email to help recover your account if you lose your wallet',
    register: 'Register',
    register_text:
      'Add an optional email to help recover your account if you lose your wallet.',
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
