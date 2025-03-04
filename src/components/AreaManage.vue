<template>
    <div class="AreaManage_body">
  
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';


  export default {
    name: "AreaManage",
    data: function() {
      return {
      }
    },
  
    mounted() {
      this.getAreaData();
      this.updateRoot('管辖区域');
      this.updatePath('区域管理');

    },
    
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
    // //获取模型信息
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
    @import '../style/components/areaManage.css'
  
  </style>