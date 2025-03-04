<template>
  <div class="modelSetting_body">
    <el-dialog class="modelSetting_dialog" title="上传图片" :visible.sync="dialogVisible" :close="handleDialogClose">
      <el-form class="modelSetting_dialog_form" :model="form">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :limit="1"
          :auto-upload=false
          :on-exceed="handleExceed"
          :on-change="handlePicChange"
          :on-remove="handlePicRemove"
          :file-list="form.picList">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="handleDialogDetect">检 测</el-button>
      </div>
    </el-dialog>

    <!-- 卡片 -->
    <el-card v-for="modelData in modelDatas" :key="modelData.id" class="box-card">
      <div slot="header" class="clearfix">
        <span class="model_title">{{ modelData.modelName }}</span>
        <el-button v-if="modelData.custom==1 && modelData.state==1" style="float: right; padding: 3px 0; color: #F66E6D;" type="text" @click="handleDelete(modelData.id)">删除</el-button>
        <el-button style="float: right; padding: 3px 0;margin-right: 5px;" type="text" @click="handleCard(modelData)">设置</el-button>
      </div>
      <div class="text item">
        模型准确率：{{ modelData.accuracy }}
      </div>
      <div class="text item">
        更新时间：{{ modelData.time }}
      </div>
      <div class="text item">
        模型简介：{{ modelData.modelDesc }}
      </div>
      <div class="modelSetting_state">
        <div v-if="modelData.state==0" class="modelSetting_disabled">
          <i class="setting_icon iconfont icon-weiwancheng"></i>
          模型正在训练
        </div>
        <div v-if="modelData.state==1" class="modelSetting_able">
          <div class="modelSetting_able_left">
            <i class="setting_icon iconfont icon-yiwancheng"></i>
            模型已训练完成({{ modelData.rounds }}轮)
          </div>
          <div class="modelSetting_able_right" style="color: #4C9BFE;" @click="handleImgTest(modelData)">图片测试</div>
        </div>
      </div>
    </el-card>

    <!-- 右侧弹窗 -->
    <el-drawer
      title="模型设置"
      :wrapperClosable="false"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
      <div class="modelSetting_drawer">
        <el-form ref="setting_form" :model="form" label-width="80px" label-position="top" :rules="rules">
          <el-form-item label="模型名称" prop="modelName">
            <el-input v-model="form.modelName" :disabled="this.form.isCustom"></el-input>
          </el-form-item>
          <div class="modelSetting_upload_title">增加数据集</div>
          <el-upload
            class="modelSetting_upload"
            drag
            action="#"
            :multiple=false
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload=false
            :headers="headers"
            :file-list="form.fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :disabled="this.form.isAvailable">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传zip压缩包，且不超过1GB</div>
          </el-upload>

          <div class="block">
            <span class="demonstration">训练轮数</span>
            <el-slider v-model="form.rounds" :disabled="form.isUpload" :min="1" :max="100"></el-slider>
          </div>

          <div class="block">
            <span class="demonstration">风险等级</span>
            <el-slider v-model="form.level" :disabled="form.isCustom" :min="1" :max="4"></el-slider>
          </div>

          <el-form-item label="模型描述">
            <el-input type="textarea" v-model="form.modelDesc" :rows="8"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
            <el-button @click="HandleCancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import { mapMutations } from 'vuex';

export default {
  name: "ModelSetting",
  data: function() {
    return {
      dialog: false,
      select_id: 0,
      modelDatas: [],
      dialogVisible: false,
      imageUrl: '',
      selectModelData: null,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      form: {
        id: 0,
        isCustom: false,
        isAvailable: false,
        modelName: '',
        modelDesc: '',
        isUpload: true,
        rounds: 0,
        level: 1,
        fileList: [],
        picList: []
      },
      Loading: null,
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ]
      },
      fileLimit: ["zip"]
    }
  },

  mounted() {
    this.getModelData();
    this.updateRoot('模型管理');
    this.updatePath('模型设置');
  },
  
  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
    //右侧弹窗关闭
    handleClose() {
      this.drawerClose();
    },
    //右侧弹窗取消
    HandleCancel() {
      this.drawerClose();
    },

    //上传表单
    onSubmit() {
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
              this.uploadModelBaseInfo(0);
              this.uploadDataSet();
            }else {
              return;
            }
          }else{
            this.loading = this.$loading({
                lock: true,
                text: '数据上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0,0,0,0.7)'
              });
            this.uploadModelBaseInfo(1);
          }
        } else {

        }
      });

    },

    //卡片按钮
    handleCard(modelData) {
      this.form.id = modelData.id;
      this.form.modelName = modelData.modelName;
      this.form.modelDesc = modelData.modelDesc;
      this.form.isCustom = modelData.custom==1?false:true;
      this.form.level = modelData.level;
      this.selectModelData = modelData;
      if(this.form.isCustom==true){
        this.form.isAvailable = true;
      }else if(modelData.state==0){
        this.form.isAvailable = true;
      }
      this.dialog = true;
    },

    //模型删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/model/deleteModel?id='+id)
        .then((res) => {
          if(res.data=="succeed"){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            for(let i=0;i<this.modelDatas.length;i++){
              if(this.modelDatas[i].id==id){
                this.modelDatas.splice(i,1);
                break;
              }
            }
          }else{
            this.$message.error('删除失败');
          }
        })
        .catch((err) => {
          this.$message.error('网络连接错误');
        })
      }).catch(() => {
                
      });
    },

    //获取模型信息
    getModelData() {
      this.$http.get('/model/getAll')
      .then((res) => {
        this.modelDatas = res.data;
        for(let i=0;i<this.modelDatas.length;i++){
          var date = new Date(this.modelDatas[i].time);
          var year = date.getFullYear(); 
          var month = ("0" + (date.getMonth() + 1)).slice(-2); 
          var day = ("0" + date.getDate()).slice(-2); 

          // 构造年月日字符串
          this.modelDatas[i].time = year + "-" + month + "-" + day;

          this.modelDatas[i].modelDesc = this.modelDatas[i].modelDesc==null?'无':this.modelDatas[i].modelDesc;
          this.modelDatas[i].accuracy += '%';
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },

    //上传文件之前判断格式
    beforeUploadFile(file) {
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

    //关闭右侧窗口
    drawerClose() {
      this.dialog = false;
      this.form = {
        id: 0,
        isCustom: false,
        modelName: '',
        modelDesc: '',
        isUpload: true,
        rounds: 0,
        fileList: []
      };
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
        this.$http.get('http://'+this.$ip+':8081/train?id='+this.form.id+'&epochs='+this.form.rounds+'&weights='+this.selectModelData.modelPath)
        .then((res) => {
          
        })
        .catch((err) => {

        });
        this.loading.close();
      })
      .catch((err) => {
        this.loading.close();
      });

    },

    //上传模型基本信息
    uploadModelBaseInfo(flag) {
      var now_id = this.form.id;
      var now_name = this.form.modelName;
      var now_Desc = this.form.modelDesc==""?"无":this.form.modelDesc;
      this.$http.post('/model/updateBaseInfo?modelName='
      +this.form.modelName+'&modelDesc='+now_Desc+'&id='+this.form.id+'&level='+this.form.level)
      .then((res) => {
        this.$message({
          message: "基本信息上传成功！",
        type: "success"
        });
        for(let i=0;i<this.modelDatas.length;i++){
          if(this.modelDatas[i].id==now_id){
            this.modelDatas[i].modelName = now_name;
            this.modelDatas[i].modelDesc = now_Desc;
          }
        }
        if(flag==1){
          this.loading.close();
        }
      })
      .catch((err) => {
        if(flag==1){
          this.loading.close();
        }
        this.$message.error('网络连接错误');
      })
    },

    //图片测试处理
    handleImgTest(modelData) {
      this.dialogVisible = true;
      this.selectModelData = modelData;
    },

    //添加图片
    handlePicChange(file,fileList){
      this.form.picList = [file];
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    //删除文件
    handlePicRemove(file,fileList) {
      this.form.picList = [];
      this.imageUrl = '';
    },

    //dialog取消
    handleDialogCancel() {
      this.dialogVisible = false;
      this.form.picList = [];
      this.imageUrl = '';
    },

    handleDialogClose() {
      this.form.picList = [];
      this.imageUrl = '';
    },
    //图片检测
    handleDialogDetect() {
      this.loading = this.$loading({
        lock: true,
        text: '图片检测中',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
      var param = new FormData();
      console.log(this.form.picList);
      this.form.picList.forEach(
        (val, index) => {
          param.append("file", val.raw);
        }
      );
      var filename = Date.now() + '.jpg';
      this.$http.post("/model/uploadTestPic?filename="+filename, param)
      .then((res) => {
        this.$http.get('http://'+this.$ip+':8081/detect/pic?Path='+filename+'&weights='+this.selectModelData.modelPath)  
        .then((res) => {
          if(res.data=="success"){
            this.imageUrl = 'http://'+this.$ip+':80/images/'+filename;
            console.log(this.imageUrl);
            this.$message({
              message: '检测成功',
              type: 'success'
            });
            this.loading.close();
          }else {
            this.loading.close();
            this.$message({
              message: '未检测到目标',
              type: 'warning'
            });
          }
        })
        .catch((err) => {
          this.loading.close();
          console.log(err);
          this.$message.error('检测失败');
        });
      })
      .catch((err) => {
        this.$message.error('图片上传失败');
        this.loading.close();
      });
    }
  }
}

</script>

<style>
  @import '../style/components/modelSetting.css'

</style>