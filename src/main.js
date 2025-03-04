import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './icon/iconfont.css'

import router from './router'
import store from './store'

import axios from './interceptors'
import * as echarts from 'echarts'


// axios.defaults.baseURL = 'https://www.lemonqwq.xyz:8080';
axios.defaults.baseURL = 'http://localhost:8080';

Vue.use(ElementUI)  //注册element-ui

Vue.prototype.$http = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$ip = '123.57.91.218';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
