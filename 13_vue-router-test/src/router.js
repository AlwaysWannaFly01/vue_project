/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import A from './components/A.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/helloworld',
        component: HelloWorld
    },
    {
        path: '/a',
        component: A
    }
]
const router = new VueRouter({
    routes
})

/* 全局守卫 */
router.beforeEach((to, from, next) => {
    console.log('beforeEach', to, from);
    next()
})
router.beforeResolve((to, from, next) => {
    console.log('beforeResolve', to, from);
    next()
})
router.afterEach((to, from) => {
    console.log('afterEach', to, from);
})
export default router 