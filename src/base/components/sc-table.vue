<template>
  <div>
    <div :class="$style.toolbar" v-if="toolbar">
      <span
        :class="$style.icon"
        v-for="({ title, icon, action }, index) in toolbar"
        v-bind:key="`toolbar-action-${index}`"
        @click="action(data[index])"
      >
        <simple-svg :filepath="icon" :title="title" />
      </span>
    </div>
    <table :class="$style.table">
      <thead>
        <tr :class="$style['header-row']">
          <th
            :class="`${$style.header} ${$style['fixed-left']}`"
            v-if="showNumbers"
            v-html="'№'"
          />
          <th
            :class="$style.header"
            v-for="{ title, id } in columns"
            :key="id"
            v-html="title"
          />
          <th
            :class="`${$style.header} ${$style['fixed-right']}`"
            v-if="actions"
          />
        </tr>
      </thead>
      <tbody v-if="!isLoading">
        <tr
          :class="$style.row"
          v-for="(row, index) in data"
          :key="`row-${index + 1}`"
        >
          <td
            :class="`${$style.cell} ${$style['fixed-left']}`"
            v-if="showNumbers"
            v-html="index + 1"
          />
          <td
            :class="$style.cell"
            v-for="{ id, format, render } in columns"
            :key="`row-${index + 1}-${id}`"
          >
            <component :is="render(data[index][id], index)" v-if="render" />
            <span
              v-else
              v-html="format ? format(data[index][id], index) : data[index][id]"
            />
          </td>
          <td
            :class="`${$style['action-cell']} ${$style['fixed-right']}`"
            v-if="actions"
          >
            <span
              :class="$style.icon"
              v-for="({ title, icon, action, show }, actIndex) in actions"
              v-bind:key="`action-${actIndex}`"
              v-show="show ? show(data[index]) : true"
              @click="action(data[index])"
            >
              <simple-svg :filepath="icon" :title="title" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'sc-table',
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    columns: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showNumbers: {
      type: Boolean,
      default: true,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array,
      default: null,
    },
    toolbar: {
      type: Array,
      default: null,
    },
  },
}
</script>

<style module>
.table {
  display: block;
  border-spacing: 0;
  border-collapse: collapse;
}

.header {
  font-size: responsive 12px 13px;
  font-range: 420px 1280px; /* stylelint-disable property-no-unknown */
  color: #9a9a9a;
  font-weight: normal;
  text-align: left;
  padding: 0 24px;
  height: 56px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.header-row {
  border: 1px solid #e0e0e0;
}

.row {
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: #fbfbfb;
  }
}

.cell {
  font-size: responsive 13px 15px;
  font-range: 420px 1280px; /* stylelint-disable property-no-unknown */
  padding: 0 24px;
  height: 48px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-cell {
  padding: 0 14px;
}

.fixed-left {
  border-right: 1px solid #e0e0e0;
}

.fixed-right {
  border-left: 1px solid #e0e0e0;
}

.toolbar {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  height: 42px;
  margin-bottom: -1px;
  padding: 0 14px;
}

.icon {
  display: inline-block;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 5px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    color: var(--primary);
  }
}
</style>
