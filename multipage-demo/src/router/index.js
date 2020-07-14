import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import One from '../js/One.vue'
import Two from '../js/Two.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/one',
      name: 'One',
      component: One
    },
    {
      path: '/two',
      name: 'Two',
      component: Two
    }
  ]
})
