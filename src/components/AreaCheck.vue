<template>
  <!-- 区域展示 -->
    <div class="AreaCheck_body">
      <!-- 卡片 -->
      <el-card v-for="areaData in areDatas" :key="areaData.id" class="box-card" isVisible="this.areaVisual">
        <div slot="header" class="clearfix">
          <span class="area_title">{{ areaData.name }}</span>
        </div>
        <div class="text item">
          地址：{{ areaData.address }}
        </div>
        <div class="text item">
          照片：{{ areaData.pic }}
        </div>
        <div class="text item">
          区域介绍：{{ areaData.desp }}
        </div>
        <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="handleImgTest(areaData)">图片测试</div>

      </el-card>
    </div>

    <!-- 该区域内对应的摄像头展示 -->
    <div class="CameraCheck">
      <el-card v-for="cameraData in cameraDatas" :key="cameraData.id" class="box-card" isVisible="this.cameraVisual">
        <div slot="header" class="clearfix">
          <span class="area_title">{{ cameraData.deviceId }}</span>
        </div>
        <div class="text item">
          状态：{{ cameraData.status }}
        </div>
        <div class="text item">
          所属区域：{{ cameraData.areaId }}
        </div>
        <div class="text item">
          区域介绍：{{ cameraData.desp }}
        </div>
        <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="handleImgTest(areaData)">图片测试</div>

      </el-card>
    </div>

    <!-- 这个对话框用于展示用户点击的摄像头的画面 -->
    <dialog>

    </dialog>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';


  export default {
    name: "AreaCheck",
    data: function() {
      return {
        areaDatas: [],
        areaVisual:true,
        cameraVisual:false,
        // Loading: null,
      }
    },
  
    mounted() {
      this.getAreaData();
      this.updateRoot('管辖区域');
      this.updatePath('区域查看');
    },
    
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
    //获取区域信息
    getAreaData() {
      this.$http.get('/model/getAll')//调用接口
      .then((res) => {
        this.areaDatas = res.data;
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },

    }
  }
  
  </script>
  
  <style>
    @import '../style/components/areaCheck.css'
  
  </style>