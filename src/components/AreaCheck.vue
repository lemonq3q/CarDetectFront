<template>
  <div class="AreaCheck_body">
    <div class="areaChosen" v-if="areaVisual">
      <el-card v-for="areaData in areaDatas" :key="areaData.id" class="box-card">
        <div slot="header" class="clearfix">
          <span class="area_title">{{ areaData.areaName }}</span>
        </div>
        <div class="text item">
          地址：{{ areaData.address }}
        </div>
        <div class="text item">
          照片：
            <el-image :src="areaData.pic" class="image-slot">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
        </div>
        <div class="text item">
          区域介绍：{{ areaData.description }}
        </div>
        <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="enterCamera(areaData)">查看详情</div>
      </el-card>
    </div>

    <div class="cameraChosen" v-if="cameraVisual">
      <el-card v-for="cameraData in cameraDatas" :key="cameraData.id" class="box-card">
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
import { getAreaData } from '../interface/AreaManage';

export default {
  name: "AreaCheck",
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      areaDatas: [],
      cameraDatas: [],
      areaVisual: true,
      cameraVisual: false,
    };
  },

  mounted() {
    this.getAllAreaData();
    this.updateRoot('管辖区域');
    this.updatePath('区域查看');
  },

  methods: {
    ...mapMutations([
      'updatePath',
      'updateRoot'
    ]),

    getAllAreaData() {
      getAreaData(this.area)
        .then((res) => {
          this.areaDatas = res.data.rows;
          for (let i = 0; i < this.areaDatas.length; i++) {
            this.areaDatas[i].pic = 'http://' + this.$ip + '/images/' + this.areaDatas[i].pic;
          }
          this.pageNum = res.data.total;
        })
        .catch((err) => {
          this.$message.error('网络连接错误');
          console.log(err);
        });
    },

    enterCamera(area) {
      this.areaVisual = false;
      this.cameraVisual = true;
      this.getCameraData(area);
    },

    getCameraData() {
      this.$http.get('/model/getAll')
        .then((res) => {
          this.cameraDatas = res.data;
        })
        .catch((err) => {
          this.$message.error('网络连接错误');
        });
    },

    enterVedio(camera) {
      // Implement the video viewing logic
    }
  }
};
</script>

<style>
/* 为父容器设置flex布局 */
.AreaCheck_body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 设置卡片之间的间距 */
  width: 100%; /* 确保容器宽度为100% */
}

/* 让每个卡片占据大约19%的宽度，最多5列 */
.el-card {
  flex: 0 1 19%;
  box-sizing: border-box;
}

/* 确保卡片内的内容布局正常 */
.el-card .clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card .text.item {
  display: flex;
  margin-bottom: 10px;
  text-align: left;
}

.el-card .modelSetting_able_right {
  margin-top: 20px;
  text-align: right;
  cursor: pointer;
}

/* 控制卡片图片区域 */
.image-slot {
  width: 100px;
  height: 100px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 响应式设计：适配不同屏幕 */
@media (max-width: 1200px) {
  .el-card {
    flex: 0 1 23%; /* 每行显示4个 */
  }
}

@media (max-width: 992px) {
  .el-card {
    flex: 0 1 48%; /* 每行显示2个 */
  }
}

@media (max-width: 768px) {
  .el-card {
    flex: 0 1 98%; /* 每行显示1个 */
  }
}
</style>
