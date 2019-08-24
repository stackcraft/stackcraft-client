import home from './views/home.vue'
import changelog from './views/changelog.vue'

import homeSvg from './assets/home.svg'

import en from './locales/en.json'
import ru from './locales/ru.json'

/*
 * Core module is responsible the basic entities, authorization and project
 * documentation.
 */
const core = {
  name: 'core',
  menu: [
    {
      name: 'home',
      link: '/',
      icon: homeSvg,
    },
  ],
  routes: [
    {
      path: '/',
      component: home,
    },
    {
      path: '/changelog',
      component: changelog,
    },
  ],
  locales: {
    en,
    ru,
  },
}

export default core
