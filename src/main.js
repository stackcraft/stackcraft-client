import Vue from 'vue'

import Apollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { RetryLink } from 'apollo-link-retry'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { createApolloFetch } from 'apollo-fetch'
import { getMainDefinition } from 'apollo-utilities'
import { print } from 'graphql/language/printer'

import Router from 'vue-router'

import I18n from 'vue-i18n'

import VueSimpleSVG from 'vue-simple-svg'

import assign from 'lodash/assign'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isNull from 'lodash/isNull'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import merge from 'lodash/merge'
import now from 'lodash/now'
import reduce from 'lodash/reduce'
import some from 'lodash/some'
import toNumber from 'lodash/toNumber'

import app from '@/app.vue'

import core from '@/core'
import security from '@/security'

import { getToken, removeToken, setToken } from '@/core/utils/token-helpers'

import UPDATE_TOKEN from '@/core/graphql/update-token.gql'

import './registerServiceWorker'

/**
 * This project consists of independent modules. Each module of the project,
 * except of the module with the name "core", is able to participate in the work
 * of the project or not. All other modules are optional
 *
 * The module describes certain entities and logic of working with them,
 * participates in the organization of the project structure
 *
 * The structure of a module looks like this:
 *
 * @example
 *
 * import entities from '@/module/views/entities.vue'
 *
 * import entitiesSvg from '@/module/assets/entities.svg'
 *
 * import en from '@/module/locales/en.json'
 * import ru from '@/module/locales/ru.json'
 *
 * const module = {
 *   // Module name
 *   name: 'moduleName',
 *
 *   // List of added menu items
 *   menu: [
 *     {
 *       // Name of menu link which will be transformed with i18n locales
 *       name: 'entity',
 *       link: '/entities',
 *       icon: entitiesSvg,
 *     }
 *   ],
 *
 *   // List of added routes
 *   routes: [
 *     {
 *       path: '/entities',
 *       component: entities,
 *     }
 *   ],
 *
 *   // JSONs of module.locales. All locales data available by using it with
 *   // module name, e.g.: 'moduleName.entities'
 *   locales: {
 *     en,
 *     ru,
 *   },
 * }
 *
 */

const modules = [core, security]

/*
 * Apollo
 */
Vue.use(Apollo)

const httpLink = createHttpLink({
  uri: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/graphql`,
})

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/graphql`,
  options: {
    reconnect: true,
  },
})

const refreshTokenLink = setContext(async () => {
  const { accessToken, refreshToken, tokenExpires } = getToken()
  const isTokenValidOrUndefined =
    isNull(accessToken) || (tokenExpires && toNumber(tokenExpires) > now())
  if (isTokenValidOrUndefined) {
    return {
      accessToken,
    }
  }
  const apolloFetch = createApolloFetch({
    uri: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/graphql`,
  })
  const response = await apolloFetch({
    query: print(UPDATE_TOKEN),
    variables: {
      refreshToken,
    },
  })
  if (
    some(response.errors, {
      message: 'Invalid refresh token',
    })
  ) {
    removeToken()
    window.location = '/'
  }
  const {
    data: { updateToken },
  } = response
  setToken(updateToken)
  return {
    accessToken: updateToken.accessToken,
  }
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {}, accessToken }) => {
    if (accessToken) {
      assign(headers, {
        authorization: accessToken,
      })
    }
    return {
      headers,
    }
  })
  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    forEach(graphQLErrors, async ({ message }) => {
      if (includes(message, 'Not authorized')) {
        removeToken()
      }
      return forward(operation)
    })
  }
})

const retryLink = new RetryLink({
  attempts: {
    max: 3,
  },
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
})

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const link = ApolloLink.from([
  refreshTokenLink,
  authLink,
  errorLink,
  retryLink,
  terminatingLink,
])

const cache = new InMemoryCache()

/*
 * Set "cache-and-network" fetch policy. Apollo first will try to read data from
 * cache, if all the data needed to fulfill query is in the cache then that data
 * will be returned. However, regardless of whether or not the full data is in
 * your this fetchPolicy will always execute query with the network interface
 * unlike cache-first which will only execute your query if the query data is
 * not in your cache
 *
 * This fetch policy optimizes for users getting a quick response while also
 * trying to keep cached data consistent with your server data at the cost of
 * extra network requests.
 *
 * The problem:
 *
 * @link https://twitter.com/azat_io/status/1135145592202694657
 */
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
}

const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions,
  connectToDevTools: process.env.NODE_ENV === 'development',
})

const apolloProvider = new Apollo({
  defaultClient: apolloClient,
})

/*
 * Router
 */

Vue.use(Router)

const routes = compact(flatten(map(modules, 'routes')))

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

/*
 * I18n
 */

Vue.use(I18n)

const messages = reduce(
  modules,
  (result, { name, locales }) =>
    merge(
      mapValues(locales, value => ({
        [name]: value,
      })),
      result,
    ),
  {},
)

const i18n = new I18n({
  // Default project locale
  locale: process.env.I18N_LOCALE || 'en',
  // Fallback project locale (always English as a primary project language)
  fallbackLocale: 'en',
  messages,
})

/*
 * SVG
 *
 * Globally add <simple-svg> component which allows to load a SVG image as an
 * inline SVG with an access to change its fill colors
 *
 * @link https://github.com/seiyable/vue-simple-svg
 */

Vue.use(VueSimpleSVG)

/**
 * Init app
 */

const menu = compact(
  flatten(
    map(modules, ({ name: moduleName, menu: menuList }) =>
      map(menuList, ({ name, ...menuItem }) => ({
        name: `${moduleName}.${name}`,
        ...menuItem,
      })),
    ),
  ),
)

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  i18n,
  router,
  render: h =>
    h(app, {
      props: {
        menu,
      },
    }),
}).$mount('#app')
