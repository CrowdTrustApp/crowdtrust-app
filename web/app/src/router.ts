import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    noScroll?: boolean
    scrollAnchor?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
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
          name: 'FAQ',
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
      ],
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('./views/Profile.vue'),
      children: [
        {
          path: '/projects',
          name: 'Projects',
          component: () => import('./views/Projects.vue'),
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
