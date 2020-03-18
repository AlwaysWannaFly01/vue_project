import Vue from 'vue'
import App from './App.vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI)

import { Button, Message } from 'element-ui';

Vue.component(Button.name, Button);
Vue.prototype.$message = Message;

Vue.config.productionTip = false
new Vue({
    render: h => h(App),
}).$mount('#app')
