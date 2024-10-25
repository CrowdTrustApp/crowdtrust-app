import { I18nObject, SimpleI18n, getString, getArray, getRecord } from './util'

const fallback: I18nObject = {
  title: 'CrowdTrust',
  future: '<span>The</span>Future<span>of</span>Crowdfunding <span>is Here</span> ',
  start: 'GET STARTED',
  browse: 'BROWSE PROJECTS',
  backed: 'Backed',
  blurb: 'Blurb',
  cancel: 'Cancel',
  confirm: 'Confirm',
  created: 'Created',
  description: 'Description',
  login: 'Log In',
  edit: 'Edit',
  wallet: 'Wallet',
  goal: '% Goal Met',
  logout: 'Log Out',
  email: 'Email',
  name: 'Name',
  bio: 'Bio',
  link: 'Link',
  location: 'Location',
  password: 'Password',
  save: 'Save',
  view: 'View',
  not_found: 'Page Not Found',
  not_found_text: "Sorry, we couldn't find what you're looking for!",
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
  get_started: 'Get Started with CrowdTrust Today',
  start_text:
    'Whether you’re a creator or a backer, CrowdTrust is your gateway to a secure, innovative, and successful crowdfunding experience. Join us and be part of the future of crowdfunding.',
  join: 'JOIN CROWDTRUST',
  go_back: 'Back',
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
    how: '<span>How </span> It Works',
    title1: 'Create Your Campaign',
    text1:
      'Set up your project on <span>CrowdTrust</span> with our easy-to-use tools. Define your goals, milestones, and funding requirements.',
    title2: 'Optimize with AI',
    text2:
      'Use our AI-driven insights to refine your campaign strategy. Get recommendations on how to reach your target audience, set the right funding goals, and maximize your chances of success.',
    title3: 'Launch and Engage',
    text3:
      'Go live and start attracting backers. Keep your audience engaged with regular updates and interactive features that help build trust and excitement.',
    title4: 'Secure Funding with TrustGuard',
    text4:
      'As you hit your milestones, <span>TrustGuard</span> releases funds to you, ensuring that your backers’ contributions are secure and used as promised.',
    title5: 'Deliver Your Vision',
    text5:
      'Successfully complete your campaign and deliver on your promises. Whether it’s a new product, a creative project, or a community initiative, <span>CrowdTrust</span> helps you make it happen.',
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
    email:
      'Add an email and password to help recover your account if you lose your wallet.',
    register: 'Register',
    register_text:
      'Add an email to help recover your account if you lose your wallet (password must be 8 characters). You will be asked to sign a message with your wallet to prove ownership.',
    email_login: 'Email login',
    login_text:
      "Log in with your email and password. You'll still need to connect your wallet to create or back projects.",
  },
  faq: {
    link: 'Frequently Asked Questions >',
    what1: 'What is TrustCoin (TSC)?',
    what1_a:
      '<span>TrustCoin (TSC) is the native token of the CrowdTrust platform. </span>It is used for various functions, including secure transactions, staking rewards, and decentralized governance. TSC holders can vote on key platform decisions and earn rewards for their participation.',
    what2: 'What cryptocurrencies are supported on CrowdTrust?',
    what2_a:
      'In addition to <span>TrustCoin (TSC)</span>, CrowdTrust currently supports <span>Ethereum (ETH)</span>, and will be capable of accepting payments from any EVM compatible chain or ERC20 token in the future. More currencies will be added as the platform continues to grow.',
    what3: 'What is the CrowdTrust Market Network?',
    what3_a:
      '<span>The Market Network is an integrated marketplace</span> where creators can access essential services like marketing, design, and legal consultation. These services are designed to help boost the success of crowdfunding campaigns and ensure that creators have the tools they need to reach their funding goals.',
    what4: 'Is there a mobile app for CrowdTrust?',
    what4_a:
      '<span>Yes, the CrowdTrust mobile app is currently in beta development.</span> The app will allow users to manage their campaigns, back projects, and track their funds conveniently on the go. Stay tuned for the full release!',
    how1: 'How can I participate in a crowdfunding campaign on CrowdTrust?',
    how1_a:
      '<span>To participate, you need to create an account on the platform</span>, browse through active campaigns, and back the ones that interest you using TrustCoin (TSC) or other supported cryptocurrencies. Funds will be securely held in the TrustGuard system until milestones are achieved.',
    how2: 'What are the benefits of using CrowdTrust as a creator?',
    how2_a:
      '<span>Creators benefit from AI-driven insights to optimize their campaigns</span>, secure funding through the TrustGuard system, and access to a global audience. Additionally, they can utilize the CrowdTrust Market Network to find services like marketing and design to boost their campaign’s success.',
    how3: 'How do AI-driven insights help my crowdfunding campaign?',
    how3_a:
      '<span>CrowdTrust’s AI tools analyze campaign data in real-time</span>, offering personalized recommendations and predictive analytics. These insights help creators target the right audience, set optimal funding goals, and improve their chances of reaching their crowdfunding targets.',
    how4: 'How does decentralized governance work on CrowdTrust?',
    how4_a:
      '<span>TSC holders have voting rights within the platform’s decentralized governance model.</span> They can vote on key platform decisions, including future developments, new features, and community-driven initiatives, ensuring that the platform evolves in the best interests of its users.',
    how5: 'How do I earn rewards on CrowdTrust?',
    how5_a:
      '<span>You can earn rewards by staking TrustCoin (TSC)</span> and participating in the platform’s governance model. Stakers receive incentives in the form of additional TSC tokens, while governance participants can influence key platform decisions.',
    how6: 'How can I get involved with CrowdTrust?',
    how6_a:
      '<span>You can join as a creator, backer, or investor.</span> Creators can launch campaigns, backers can support projects, and investors can engage with the platform’s tokenomics and governance systems. Additionally, you can join the community on social media and stay updated on future developments.',
  },
  projects: {
    title: 'Projects',
  },
  profile: {
    title: 'Profile',
    settings: 'Settings',
    no_backed: "You haven't backed any projects yet.",
    no_created: "You haven't created any projects yet.",
    create: 'Create Project',
    edit: 'Edit Profile',
    email_text: 'Your email is used for project updates and account recovery.',
    password_text: "A password can be used to log in if your wallet isn't available",
    wallet_text:
      'The Ethereum address used to back projects and receive funds. Changing your wallet will not affect previously backed or created projects.',
    update_email: 'Update Email',
    new_email: 'New email',
    update_password: 'Update Password',
    update_wallet: 'Update Wallet',
    old_password: 'Old password',
    new_password: 'New password',
    confirm_password: 'Confirm new password',
    switch: 'Connect a new MetaMask wallet to update your Ethereum address.',
    sign: 'Sign a message to confirm your address change',
  },
  project: {
    title: 'Projects',
    text: 'Browse active campaigns and previous successes, or ',
    create: 'create your own project.',
    empty: 'No projects available.',
    detail: 'Project Details',
    delivery: 'Estimated Delivery',
    no_rewards: 'No rewards',
    status: {
      Initial: 'Initial',
      Review: 'Review',
      Approved: 'Approved',
      Denied: 'Denied',
      Prelaunch: 'Prelaunch',
      Active: 'Active',
      Complete: 'Complete',
    },
  },
  create: {
    title: 'Create Project',
    text: "This is where your vision takes shape! Whether you're launching a product, funding a cause, or building a community, our editor makes it easy to share your project with the world.",
  },
  footer: {
    copyright: '© 2024 CrowdTrust - All Rights Reserved.',
    resources: 'Resources',
    whitepaper: 'Whitepaper',
    faq: 'FAQs',
    about: 'About',
    links: 'Quick Links',
    browse: 'Browse Projects',
    launch: 'Launch A Project',
    trust: 'Trust & Safety',
    terms: 'Terms',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
  },
  errors: {
    missing_wallet: 'Wallet missing, please go back and reconnect.',
    password_length: 'Password must be at least 8 characters.',
    name_len: 'Name must be between 2 and 20 characters.',
    bio_len: 'Bio must be less than 400 characters.',
    confirm_password: 'Passwords do not match.',
    signer: 'Error connecting to MetaMask',
    InvalidSignature: 'Unable to verify signature, please try again.',
    EthAddressUnique: 'Address is already in use.',
    UserExists: 'Email or wallet is already in use.',
    InvalidFormData: 'Invalid input',
    None: 'Unknown error',
  },
}

export const i18n = new SimpleI18n(fallback)
export const ts = getString(i18n)
export const ta = getArray(i18n)
export const tr = getRecord(i18n)
