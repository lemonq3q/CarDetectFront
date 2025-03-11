<template>
  <!-- 区域展示 -->
    <div class="AreaCheck_body" >
      <div class="areaChosen" v-if="areaVisual">
        <!-- 卡片 -->
        <el-card v-for="areaData in areDatas" :key="areaData.id" class="box-card" >
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
          <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="enterCamera(areaData)">查看详情</div>

        </el-card>
      </div>

      <!-- 该区域内对应的摄像头展示 -->
      <div class="cameraChosen" v-if="cameraVisual">
        <el-card v-for="cameraData in cameraDatas" :key="cameraData.id" class="box-card" >
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
          <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="enterVedio(cameraData)">查看详情</div>

        </el-card>
      </div>

      <!-- 这个对话框用于展示用户点击的摄像头的画面（全画面） -->
      <el-dialog v-model="dialogVisible" fullscreen top="40vh" width="70%" draggable>
        <span>摄像头设备id的监控画面</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';


  export default {
    name: "AreaCheck",
    data: function() {
      return {
        areaDatas: [],
        cameraDatas:[],
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
    //点击区域进入相应摄像头详情页
    enterCamera(area){
      this.areaVisual=false;
      this.cameraVisual=true;
      getCameraData(area);
    },
    //获取点击区域内的摄像头的信息
    getCameraData(){
      this.$http.get('/model/getAll')//调用接口
      .then((res)=>{
        this.cameraDatas = res.data;
      })
      .catch((err)=>{
        this.$message.error('网络连接错误');
      });
    },
    //进入dialog画面，查看摄像头的画面和状态（要用到rtmp推流）
    enterVedio(camera){

    }
    }
  }
  
  </script>
  
  <style>
    @import '../style/components/areaCheck.css'
  
  </style>