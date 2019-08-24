import addUser from './views/add-user.vue'
import roles from './views/roles.vue'
import settings from './views/settings.vue'
import user from './views/user.vue'
import users from './views/users.vue'

import usersSvg from './assets/users.svg'
import rolesSvg from './assets/roles.svg'
import settingsSvg from './assets/settings.svg'

import en from './locales/en.json'
import ru from './locales/ru.json'

/*
 * Security module
 */
const security = {
  name: 'security',
  menu: [
    {
      name: 'users',
      link: '/users',
      icon: usersSvg,
    },
    {
      name: 'roles',
      link: '/roles',
      icon: rolesSvg,
    },
    {
      name: 'settings',
      link: '/settings',
      icon: settingsSvg,
    },
  ],
  routes: [
    {
      path: '/add-user',
      component: addUser,
    },
    {
      path: '/roles',
      component: roles,
    },
    {
      path: '/settings',
      component: settings,
    },
    {
      path: '/user/:id',
      component: user,
    },
    {
      path: '/users',
      component: users,
    },
  ],
  locales: {
    en,
    ru,
  },
}

export default security
