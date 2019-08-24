<template>
  <div v-if="user">
    <sc-avatar
      :src="user.avatar"
      :alt="`${user.firstName} ${user.lastName}`"
      size="xl"
    />
    <sc-label v-t="'security.firstName'" />
    <p :class="$style.info" v-html="user.firstName" />
    <sc-label v-t="'security.lastName'" />
    <p :class="$style.info" v-html="user.lastName" />
  </div>
</template>

<script>
import toNumber from 'lodash/toNumber'

import { scAvatar, scLabel } from '@/base'

import USER from '@/security/graphql/user.gql'

export default {
  name: 'user',
  apollo: {
    user: {
      query: USER,
      variables() {
        return {
          id: toNumber(this.$route.params.id),
        }
      },
      fetchPolicy: 'no-cache',
    },
  },
  components: {
    scAvatar,
    scLabel,
  },
}
</script>

<style module>
.info {
  margin: 0 0 8px 0;
}
</style>
