/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import A from './components/A.vue'
import B from './components/B.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/helloworld',
        component: HelloWorld,
        meta: {
            title: 'HelloWorld'
        }
    },
    {
        path: '/a',
        component: A,
        meta: {
            title: 'A'
        }
    },
    {
        path: '/b',
        component: B
    }
]
const router = new VueRouter({
    routes
})

/* 方案2，不推荐 ，不建议放在业务的生命周期中*/
// Vue.mixin({
//     beforeCreate() {
//         console.log('beforeCreate', this.$router, this.$route);
//         if (this.$route.meta.title) {
//             document.title = this.$route.meta.title
//         } else {
//             document.title = "默认标题2"
//         }
//     }
// })
/* 全局守卫 */
router.beforeEach((to, from, next) => {
    console.log('beforeEach', to, from);
    /* 方案1 */
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "默认标题"
    }
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