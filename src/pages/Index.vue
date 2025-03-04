<template>
  <el-container>
    <el-aside width="250px">
        <Menu></Menu>
    </el-aside>
    
    <el-container id="el_container_body">
      <el-header>
          <Header></Header>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'

export default {
  name: 'Index',
  components: {
    Menu,
    Header
  }
}
</script>

<style>
@import '../style/pages/global.css'

</style>