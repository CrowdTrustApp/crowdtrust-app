import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    noScroll?: boolean
    scrollAnchor?: string
    requiresAuth?: boolean
  }
}

const metaAuth = (title: string) => ({
  title,
  requiresAuth: true,
})

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (to?.hash) {
      return { el: to.hash }
    }
    if (savedPosition) {
      return savedPosition
    }
    if (to?.meta?.noScroll && from?.meta?.noScroll) {
      return {}
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('./views/HomeWrap.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('./views/Home.vue'),
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('./views/About.vue'),
        },
        {
          path: '/faq',
          name: 'Faq',
          component: () => import('./views/Faq.vue'),
        },
        {
          path: '/back',
          name: 'Back',
          component: () => import('./views/Back.vue'),
        },
        {
          path: '/services',
          name: 'Services',
          component: () => import('./views/Services.vue'),
        },
        {
          path: '/how',
          name: 'How',
          component: () => import('./views/How.vue'),
        },
        {
          path: '/connect',
          name: 'Connect',
          component: () => import('./views/Connect.vue'),
        },
        {
          path: '/terms',
          name: 'Terms',
          component: () => import('./views/Terms.vue'),
        },
        {
          path: '/cookies',
          name: 'Cookies',
          component: () => import('./views/Cookies.vue'),
        },
        {
          path: '/privacy',
          name: 'Privacy',
          component: () => import('./views/Privacy.vue'),
        },
        {
          path: '/trust',
          name: 'Trust',
          component: () => import('./views/Trust.vue'),
        },
      ],
    },
    {
      path: '/profile',
      component: () => import('./views/AppWrap.vue'),
      children: [
        {
          path: '',
          name: 'Profile',
          component: () => import('./views/Profile.vue'),
          redirect: '/profile/backed',
          meta: metaAuth('Profile'),
          children: [
            {
              path: 'created',
              name: 'Created',
              component: () => import('./components/profile/CreatedProjects.vue'),
            },
            {
              path: 'backed',
              name: 'Backed',
              component: () => import('./components/profile/BackedProjects.vue'),
            },
            {
              path: 'settings',
              name: 'Settings',
              component: () => import('./components/profile/Settings.vue'),
            },
          ],
        },
        {
          path: '/projects',
          name: 'Projects',
          component: () => import('./views/Projects.vue'),
        },
        {
          path: '/project/:id',
          name: 'Project',
          component: () => import('./views/Project.vue'),
        },
        {
          path: '/create',
          name: 'Create',
          component: () => import('./views/Create.vue'),
        },
        {
          path: '/launch',
          name: 'Launch',
          component: () => import('./views/Launch.vue'),
        },
      ],
    },
  ],
})

router.afterEach((to, _from) => {
  const parent = to.matched.find((record) => record.meta.title)
  const parentTitle = parent ? parent.meta.title : null
  document.title = to.meta.title || parentTitle || 'CrowdTrust'
})

export default router
