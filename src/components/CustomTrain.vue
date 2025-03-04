<template>
  <div class="customTrain_body">
    <div class="customTrain_left">
      <el-form v-if="page==2" ref="setting_form" :model="form" label-width="80px" label-position="top" :rules="rules">
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="form.modelName"></el-input>
        </el-form-item>
        
        <el-form-item class="upload_item" label="上传数据集">
          <el-upload
            class="customTrain_upload"
            drag
            action="#"
            :multiple=false
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload=false
            :file-list="form.fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="customTrain_tip el-upload__tip" slot="tip">只能上传zip压缩包，且不超过1GB</div>
          </el-upload>
        </el-form-item>

        <div class="customTrain_block">
          <span class="demonstration">训练轮数</span>
          <el-slider v-model="form.rounds" :min="1" :max="100"></el-slider>
        </div>

        <div class="customTrain_block">
          <span class="demonstration">风险等级</span>
          <el-slider v-model="form.level" :min="1" :max="4"></el-slider>
        </div>
       
        <el-form-item label="模型描述">
          <el-input type="textarea" v-model="form.modelDesc" :rows="4"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即添加</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>

      <div v-if="page==1" class="no_select">
        <img class="customTrain_none" src="../assets/uploadDataSet.png" alt="">
        <div class="customSetting_none_word">请仔细阅读右侧指南</div>
        <el-button class="setting_none_button" @click="handleAddButton" type="primary">添加自定义模型</el-button>
      </div>
    </div>

    <div class="customTrain_right">
      <div class="customTrain_tip_title">训练集上传指南</div>
      <div class="customTrain_word_title">1、自定义训练简述</div>
      <div class="customTrain_word">
        自定义训练仅支持简单的<span class="customTrain_highlight_word">单一物品识别</span>的模型训练，
        如检测小猫小狗，电动车自行车停放等，涉及<span class="customTrain_highlight_word">语义分析，姿态检测</span>等复杂算法的识别无法实现
      </div>
      <div class="customTrain_word_title">2、文件名称</div>
      <div class="customTrain_word">
        数据集目录下的文件与文件夹尽量不要出现<span class="customTrain_highlight_word">中文</span>
      </div>
      <div class="customTrain_word_title">3、文件限制</div>
      <div class="customTrain_word" style="margin-bottom: 10px;">
        <span style="font-weight: 700;">•格式限制：</span>仅支持<span class="customTrain_highlight_word">zip</span>压缩包形式的文件上传，
        且大小不超过<span class="customTrain_highlight_word">1GB</span>
      </div>
      <div class="customTrain_word">
        <span style="font-weight: 700;">•结构限制：</span>压缩包解压后应该只有<span class="customTrain_highlight_word">一层父级目录</span>，
        内部为<span class="customTrain_highlight_word">两个子目录</span>，名字分别为<span class="customTrain_highlight_word">images与labels</span>
        ,images目录内存放数据集的图片资源，labels内存放标注文件
      </div>
      <div class="customTrain_word_title">4、文件结构示例</div>
      <img class="customTrain_img" src="../assets/example.png" alt="">
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: "CustomTrain",
  data: function() {
    return {
      form: {
          id: 0,
          modelName: '',
          fileList: [],
          rounds: 1,
          modelDesc: '无',
          level: 1
        },
        fileLimit: ["zip"],
        page: 1,
        loading: null,
        rules: {
          modelName: [
            { required: true, message: '请输入模型名称', trigger: 'blur' },
          ],
        }
    };
  },

  mounted() {
    this.updateRoot('模型管理');
    this.updatePath('自定义训练');
  },

  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
    //上传表单
    onSubmit() {
      console.log('submit enter');
      this.$refs['setting_form'].validate((valid) => {
        if (valid) {
          if(this.form.fileList.length!=0){
            if(this.beforeUploadFile(this.form.fileList[0])){
              this.loading = this.$loading({
                lock: true,
                text: '数据上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0,0,0,0.7)'
              });
              this.uploadBaseInfo();
            }else {
              return;
            }
          }else{
            this.$message({
              message: '请上传训练用数据集',
              type: 'warning'
            });
            return;
          }
        } else {

        }
      });
    },

    //格式判断
    beforeUploadFile(file) {
      console.log('judge enter');
      if(file.type != "" || file.type != null || file.type != undefined){
        const fileExt = file.name.replace(/.+\./, "").toLowerCase(); //获得文件格式
        const isLt1G = file.size / 1024 / 1024 < 1024;  //限制大小
        if (!isLt1G) {
          this.$message({
            message: '上传文件大小不能超过 1GB!',
            type: 'warning'
          });
          return false;
        }
        if(this.fileLimit.includes(fileExt)){
          return true;
        }else {
          this.$message.error("请上传zip格式的压缩包!");
			    return false;
        }
      }
    },

    //添加文件
    handleFileChange(file,fileList) {
      this.form.fileList = fileList;
      this.form.isUpload = false;
    },

    //删除文件
    handleFileRemove(file,fileList) {
      this.form.fileList = [];
      this.form.isUpload = true;
    },

    //文件超出数量限制处理
    handleExceed(files, fileList) {
      this.$message.error('只能上传一个文件，请替换现有文件或删除后再上传新文件。');
    },

    //取消按钮
    handleCancel() {
      this.form = {
        id: 0,
        modelName: '',
        fileList: [],
        rounds: 1,
        modelDesc: '无'
      },
      this.page = 1;
    },

    //页面跳转
    handleAddButton() {
      this.page = 2;
    },

    //添加模型信息
    uploadBaseInfo() {
      var now_Desc = this.form.modelDesc==""?"无":this.form.modelDesc;
      this.$http.post('/model/addBaseInfo?modelName='+this.form.modelName+'&modelDesc='+now_Desc+'&level='+this.form.level)
      .then((res) => {
        if(res.data=='failed'){
          this.$message.error('上传失败');
        }else{
          this.form.id = res.data;
          this.uploadDataSet();
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      })
    },

    //上传文件数据集
    uploadDataSet() {
      var param = new FormData();
      this.form.fileList.forEach(
        (val, index) => {
          param.append("file", val.raw);
        }
      );

      this.$http.post("/model/uploadDataSet?id="+this.form.id+"&rounds="+this.form.rounds, param)
      .then((res) => {
        this.$message({
          message: "数据集上传完成！",
          type: "success"
        });
        this.$http.get('http://'+this.$ip+':8081/train?id='+this.form.id+'&epochs='+this.form.rounds)
        .then((res) => {

        })
        .catch((err) => {

        });
        this.loading.close();
      })
      .catch((err) => {
        this.loading.close();
        this.$message.error('数据集上传失败');
      });

    },


  }
}

</script>

<style>
@import '../style/components/customTrain.css'

</style>