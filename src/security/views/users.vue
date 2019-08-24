<template>
  <sc-table v-bind="tableProps" />
</template>

<script>
import Vue from 'vue'

import moment from 'moment'

import gql from 'graphql-tag'

import concat from 'lodash/concat'
import filter from 'lodash/filter'

import { scAvatar, scTable } from '@/base'

import eyeSvg from '@/security/assets/eye.svg'
import plusSvg from '@/security/assets/plus.svg'
import trashSvg from '@/security/assets/trash.svg'

import CURRENT_USER from '@/security/graphql/current-user.gql'
import DELETE_USER from '@/security/graphql/delete-user.gql'
import USERS from '@/security/graphql/users.gql'
import USER_ADDED from '@/security/graphql/user-added.gql'
import USER_DELETED from '@/security/graphql/user-deleted.gql'

export default {
  name: 'users',
  apollo: {
    users: USERS,
    currentUser: CURRENT_USER,
    user: {
      query: gql`
        query {
          user(id: 9) {
            firstName
            lastName
            email
          }
        }
      `,
      variables() {
        return {
          id: 9,
        }
      },
    },
  },
  components: {
    scTable,
  },
  computed: {
    tableProps() {
      return {
        data: this.$apolloData.data.users,
        columns: [
          {
            id: 'avatar',
            title: this.$t('security.avatar'),
            render: (src, index) =>
              Vue.component('avatar', {
                components: {
                  scAvatar,
                },
                data: () => {
                  const user = this.$apolloData.data.users[index]
                  return {
                    src,
                    alt: `${user.firstName} ${user.lastName}`,
                    size: 'm',
                  }
                },
                template: '<sc-avatar :src="src" :alt="alt" :size="size"/>',
              }),
          },
          {
            id: 'email',
            title: this.$t('security.email'),
          },
          {
            id: 'firstName',
            title: this.$t('security.firstName'),
          },
          {
            id: 'lastName',
            title: this.$t('security.lastName'),
          },
          {
            id: 'created',
            title: this.$t('security.created'),
            format: value => moment(value).format('DD.MM.YYYY HH:MM'),
          },
        ],
        isLoading: Boolean(this.$apolloData.loading),
        resizable: true,
        actions: [
          {
            title: this.$t('security.view-user'),
            icon: eyeSvg,
            action: ({ id }) => {
              // eslint-disable-next-line fp/no-mutating-methods
              this.$router.push(`/user/${id}`)
            },
          },
          {
            title: this.$t('security.delete-user'),
            icon: trashSvg,
            action: ({ id }) =>
              this.$apollo.mutate({
                mutation: DELETE_USER,
                variables: {
                  id,
                },
              }),
            show: user =>
              user.id !== this.$apolloData.data.currentUser.id && !user.super,
          },
        ],
        toolbar: [
          {
            title: this.$t('security.add-user'),
            icon: plusSvg,
            action: () => {
              // eslint-disable-next-line fp/no-mutating-methods
              this.$router.push('/add-user')
            },
          },
        ],
      }
    },
  },
  created() {
    this.$apollo.queries.users.subscribeToMore({
      document: USER_DELETED,
      updateQuery: (
        { users },
        {
          subscriptionData: {
            data: { userDeleted },
          },
        },
      ) => ({
        users: filter(users, ({ id }) => id !== userDeleted.id),
      }),
    })
    this.$apollo.queries.users.subscribeToMore({
      document: USER_ADDED,
      updateQuery: (
        { users },
        {
          subscriptionData: {
            data: { userAdded },
          },
        },
      ) => ({
        users: concat(users, userAdded),
      }),
    })
  },
}
</script>
