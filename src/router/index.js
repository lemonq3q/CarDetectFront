import VueRouter from 'vue-router'
import Vue from 'vue'

import Index from '@/pages/Index.vue'
// import DeviceSearch from '@/components/DeviceSearch.vue'
// import DeviceSetting from '@/components/DeviceSetting.vue'
import Home from '@/components/Home.vue'
import AreaCheck from '@/components/AreaCheck.vue'
import AreaManage from '@/components/AreaManage.vue'
import CameraMange from '@/components/CameraManage.vue'
import ModelSetting from '@/components/ModelSetting.vue'
import CustomTrain from '@/components/CustomTrain.vue'
// import Header from '@/components/Header.vue'
import OfflineDetect from '@/components/OfflineDetect.vue'
import RecordManage from '@/components/RecordManage.vue'
import Login from '@/pages/Login.vue'
// import GraphicSetting from '@/components/GraphicSetting.vue'

import store from '../store/index.js'
// import Employee from '@/components/Employee.vue'
// import RiskRecord from '@/components/RiskRecord.vue'
import User from '@/components/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes:[
    {path: '/' , redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/index', component: Index, meta: {requiresAuth: true}, children: [
      {path: '', component: Home, meta: {requiresAuth: true}},
      {path: 'home', component: Home, meta: {requiresAuth: true}},
      {path: 'areaCheck', component: AreaCheck, meta: {requiresAuth: true}},
      {path: 'areaManage', component: AreaManage, meta: {requiresAuth: true}},
      {path: 'cameraManage', component: CameraMange, meta: {requiresAuth: true}},
      {path: 'recordManage', component: RecordManage, meta: {requiresAuth: true}},
      {path: 'modelSetting', component: ModelSetting, meta: {requiresAuth: true}},
      {path: 'customTrain', component: CustomTrain, meta: {requiresAuth: true}},
      {path: 'offlineDetect', component: OfflineDetect, meta: {requiresAuth: true}},
      {path: 'user', component: User, meta: {requiresAuth: true}}
    ]},
  ]
})

//守卫路由，防止未登陆异常跳转
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth &&!store.state.isLogin) {
    next('/login');
  } else {
    next();
  }
});

export default router