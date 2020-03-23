
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      console.log(url)
      /* 用于判断是否为http地址，若是 */
      if (isExternal(url)) {
        /* 命中这里， */
        /* 点击会跳转到相应链接，在新窗口打开 */
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      /* 否则命中这里； */
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
