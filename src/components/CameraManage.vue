<template>
  <div class="CameraManage_body">

  </div>
</template>

<script>
import { mapMutations } from 'vuex';


export default {
  name: "CameraManage",
  data: function() {
    return {
    }
  },

  mounted() {
    this.getAreaData();
    this.updateRoot('摄像头管理');
    this.updatePath('');

  },
  
  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
  //获取模型信息
  // getAreaData() {
  //   this.$http.get('/model/getAll')//调用接口
  //   .then((res) => {
  //     this.areaDatas = res.data;
  //   })
  //   .catch((err) => {
  //     this.$message.error('网络连接错误');
  //   });
  // },
  }
}

</script>

<style>
  /* @import '../style/components/modelSetting.css' */
  @import '../style/components/cameraManage.css'

</style>