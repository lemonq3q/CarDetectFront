<template>
  <div class="menu_body">
    <div class="logo_container">
      <img class="logo" src="../assets/logo.png" alt="">
      <div class="logo_title">智安<span style="color: #FCE610;">云盾</span></div>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-openeds="['1', '2','3','4','5','6','7']">

      <!-- 首页，展示一些数据做的美观一点 -->
      <router-link to="/index/">
        <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
        </el-menu-item>
      </router-link>

      <!-- 区域界面，分为查看和管理的两个子页面 -->
      <el-submenu index="2">
        <template slot="title" class="group_title">
          <i class="el-icon-location"></i>
          <span>区域界面</span>
        </template>
        <el-menu-item-group>
          <router-link to="/index/areaCheck">
            <el-menu-item index="2-1">
              <i class="iconfont icon-shebeichaxun"></i>
              <span>区域查看</span>
            </el-menu-item>
          </router-link>
          <router-link to="/index/areaManage">
            <el-menu-item index="2-2">          
              <i class="iconfont icon-shebeishezhi"></i>
              <span>区域管理</span>
            </el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>

      <!-- 摄像头管理，增删查改 -->
      <router-link to="/index/cameraManage">
        <el-menu-item index="3">
            <i class="iconfont icon-yuangongguanli" style="font-size: 20px;margin-left:2px;"></i>
            <span slot="title">摄像头管理</span>
        </el-menu-item>
      </router-link>

      <!-- 记录管理，增删查改 -->
      <router-link to="/index/recordManage">
        <el-menu-item index="4">
            <i class="iconfont icon-yuangongguanli" style="font-size: 20px;margin-left:2px;"></i>
            <span slot="title">记录管理</span>
        </el-menu-item>
      </router-link>

      <!-- 模型管理、模型训练 （旧版保留）-->
      <el-submenu index="5">
        <template slot="title" class="group_title">
          <i class="el-icon-location"></i>
          <span>模型管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/index/modelSetting">
            <el-menu-item index="5-1">
              <i class="iconfont icon-moxingshezhi"></i>
              <span>模型设置</span>
            </el-menu-item>
          </router-link>
          <router-link to="/index/customTrain">
            <el-menu-item index="5-2">          
              <i class="iconfont icon-moxingxunlian"></i>
              <span>自定义训练</span>
            </el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      
      <router-link to="/index/offlineDetect">
        <el-menu-item index="6">
            <i class="iconfont icon-yuangongguanli" style="font-size: 20px;margin-left:2px;"></i>
            <span slot="title">离线检测</span>
        </el-menu-item>
      </router-link>

      <router-link to="/index/user">
        <el-menu-item index="7">
            <i class="iconfont icon-yuangongguanli" style="font-size: 20px;margin-left:2px;"></i>
            <span slot="title">用户中心</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  comments: {

  }
}

</script>

<style>
@import '../style/components/menu.css'

</style>

