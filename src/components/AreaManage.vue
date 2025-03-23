<template>
    <div class="AreaManage_body">
      <div class="AreaManage__left">
        <div class="AreaManage_left_title">管辖区域查询</div>
        <!-- 搜索框 -->
        <div class="area_search_block" style="margin-top: 15px;">
          <el-input placeholder="请输入区域关键信息查询" v-model="input" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="区域名称" value="1"></el-option>
              <el-option label="区域地址" value="2"></el-option>
              <el-option label="请选择" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
          </el-input>
        </div>

        <!-- 区域展示表格 -->
        <!-- 表格展示 -->
        <el-table
        @cell-click="handlerCellClick"
        :data="tableData"
        stripe
        border
        hight="100"
        style="width: 100%">
          <el-table-column
            prop="id"
            label="区域id"
            width="65px">
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="区域名称"
            width="110px">
          </el-table-column>
          <el-table-column
            prop="address"
            label="区域地址"
            width="110px">
          </el-table-column>
          <el-table-column
            prop="pic"
            label="展示照片"
            width="100px">
            <template slot-scope="scope">
              <el-image :src=scope.row.pic>
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="区域描述"
            width="180px">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deleteArea(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页查询 -->
        <el-pagination
        background
        layout="prev, pager, next"
        :total="pageNum"
        :current-page="currentPage"
        :page-size="8"
        @current-change="handleCurrentChange">
        </el-pagination>
      </div>

      <!-- 右边展示部分 -->
      <div class="AreaManage_body_right">
        <div v-if="page==1" class="area_noSelected">
        <img class="area_none" src="../assets/updateEmployee.png" alt="">
        <div class="customSetting_none_word">请先选择区域</div>
        <el-button class="setting_none_button" @click="handleAddButton" type="primary">添加区域</el-button>
      </div>

      <el-form v-if="page==2 || page==3" ref="area_form" :model="form" class="area_add_form" label-width="80px" label-position="top" :rules="rules">
        <el-form-item label="上传照片" >
          <el-upload
            class="avatar-uploader area_headshot_uploader"
            action="#"
            :show-file-list="false"
            :auto-upload=false
            :on-change="handlePicChange"
            :on-remove="handlePicRemove"
            :file-list="form.pic">
            <img v-if="imageUrl" :src="imageUrl" class="area_avatar">
            <i v-else class="el-icon-plus area_avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-row class="seniority_position_row">
          <el-col :span="10">
            <el-form-item label="区域名" prop="areaName">
              <el-input v-model="form.areaName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="seniority_position_row">
          <el-col :span="10">
            <el-form-item label="检测绑定" >
              <el-switch v-model="form.isDetect"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="10">

          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <el-form-item label="检测模型" prop="typeName">
              <el-checkbox-group v-model="form.detectTypes">
                <el-checkbox v-for="modelData in modelDatas" :key="modelData.id" :label="modelData.id" :disabled="!form.isDetect">{{ modelData.typeName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="seniority_position_row">
          <el-col :span="10">
            <el-form-item label="区域介绍" prop="description">
              <el-input v-model="form.description" size="large" class="desc-input" style="width: 100%; height: 100px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ page==2?'添加':'修改'}}</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </template>
  
  <script>
  import { getAreaData ,getModelData ,addAreaData ,deleteAreaData ,uploadPic ,updateAreaData} from '@/interface/AreaManage';
  import { mapState,mapMutations } from 'vuex';


  export default {
    name: "AreaManage",
    computed:{
      ...mapState([
        'id'
      ]),
      tableData() {
        const start = (this.currentPage - 1) * 6;
        const end = start + 6;
        return this.areaDatas.slice(start, end);
      }
    },
    data: function() {
      return {
        input:"",
        areaDatas:[],          
        currentPage: 1,
        pageNum: 10,
        page: 1,
        select:'请选择',
        modelDatas:[],
        imageUrl: '',
        loading: null,
        area:{
          id:'',
          areaName: '',
          address: '',
          pageNum: this.currentPage,
          pageSize:this.pageNum,
        },
        form: {
          id :'',
          areaName: '',
          address: '',
          pic: [],
          description:'',
          detectTypes: [],
          isDetect:false,
          filename: null,
        },
        rules:{
          areaName:[
            {required: true,message:'请输入区域名',trigger: 'blur'},
          ],
          address:[
            {required: true,message:'请输入区域地址',trigger: 'blur'},
          ],
          description:[
            {required: true,message:'请输入区域介绍',trigger: 'blur'},
          ],
        }
      }
    },

    mounted() {
      this.getAllModelData();
      this.getAllAreaData();
      this.updateRoot('管辖区域');
      this.updatePath('区域管理');

    },
    
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
      
    // 搜索框，按照查找类型查找(ok)
    handlerSearch() {
      if(this.select == 1){
        this.area.areaName = this.input;
      }
      else if(this.select == 2){
        this.area.address = this.input;
      }
      else if(this.select == 3){
        this.area.areaName = null;
        this.area.address = null;
      }
      this.getAllAreaData();
    },

    //获取全部区域信息(ok)
    getAllAreaData(){
      getAreaData(this.area)
      .then((res)=>{
        this.areaDatas = []
        this.areaDatas = res.data.rows;
        for (let i=0;i<this.areaDatas.length;i++) {
          this.areaDatas[i].pic = 'http://'+this.$ip + '/images/' + this.areaDatas[i].pic;
        }
        this.pageNum = res.data.total;
      })
      .catch((err)=>{
        this.$message.error('网络连接错误');
        console.log(err);
      })
    },

    //获取现有的model内容(ok)
    getAllModelData(){
      getModelData()
      .then((res)=>{
        for(let i=0;i<res.data.rows.length;i++){
          let item = {
            id: res.data.rows[i].id,
            typeName: res.data.rows[i].typeName
          };
          this.modelDatas.push(item);
        }
      })
      .catch((err)=>{
        this.$message.error('网络连接错误');
        console.log(err);
      })
    },

    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableData = this.areaDatas.slice((this.currentPage-1)*6,(this.currentPage-1)*6+6);
      console.log(this.tableData);
    },

    //表格点击响应
    handlerCellClick(row,column,cell,event) {
      this.formInit();
      // 获取该row对应的detectTypes数据
      const genreArray = [];
      this.area.areaName = row.areaName;
      this.area.address = row.address;
      getAreaData(this.area)
      .then((res) => {
        console.log(res);
        // 如果detectTypes不是空的就循环访问构造新数组
        if(res.data.rows[0].detectTypes.length>0){
          this.form.isDetect = true;
          for(let i = 0; i < res.data.rows[0].detectTypes.length; i++ ){
          // 提取每个对象的 genre 属性值
          const genre = res.data.rows[0].detectTypes[i].genre;
          // 将 genre 值推入新的数组
          genreArray.push(genre);
        }
        }
        this.form.detectTypes = genreArray;
      })
      // 先把照片放到右侧
      // this.form.pic = row.pic;
      this.form.id = row.id;
      this.form.areaName  = row.areaName;
      this.form.address = row.address;
      this.form.description = row.description;
      this.form.detectTypes = genreArray;
      this.imageUrl = row.pic;
      this.page = 3;
    },



    //添加区域按钮
    handleAddButton() {
      this.page = 2;
    },


    // 添加图片
    handlePicChange(file,fileList){
      this.form.pic = [file];
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    //删除文件
    handlePicRemove(file,fileList) {
      this.form.pic = [];
      this.imageUrl = null;
    },

    //提交
    onSubmit() {
      this.$refs['area_form'].validate((valid) => {
        console.log(1)
        if (valid) {
          // this.loading = this.$loading({
          //   lock: true,
          //   text: '数据上传中',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0,0,0,0.7)'
          // });
          if(this.page==2){
            this.addAreaInfo();
          }else{
            this.updateAreaInfo();
          }
        } else {

        }
      });
    },

    //取消
    handleCancel() {
      this.form =  {
        areaName: '',
        address: '',
        pic: [],
        description: ''
      };
      this.imageUrl = '';
      this.page = 1;
    },

    // 获得图片名称(ok)
    getHeadshotName(){
      if (this.form.pic && this.form.pic.length > 0) {
      const file = this.form.pic[0];
      const originalName = file.name; // 原始文件名
      const timestamp = Date.now(); // 当前时间戳

      // 提取文件的扩展名
      const fileExtension = originalName.split('.').pop(); // 获取文件后缀名（如 jpg、png 等）

      // 生成新的文件名：时间戳 + 扩展名
      const newFileName = `${timestamp}.${fileExtension}`;
        // 返回新的文件名
        return newFileName;
      } else {
        console.error("没有文件被选择");
        return null; // 如果没有文件被选择，返回 null
      }
    },

    //上传图片(ok)
    uploadHeadshot() {
      var param = new FormData();
      this.form.pic.forEach(
        (val, index) => {
          param.append("file", val.raw);
        }
      );
      var id = this.getHeadshotName();
      uploadPic(id,param)
      .then((res) => {
        console.log(res);
        if(res.data.data == 1){
          this.$message({
            message: "上传完成！",
            type: "success"
          });
          this.getAllAreaData();
        }else{
          this.$message.error('照片上传失败');
        } 
        // this.loading.close();
      })
      .catch((err) => {
        this.$message.error('上传失败');
        // this.loading.close();
        console.log(err);
      });

    },

    // 初始化表单
    formInit(){
      this.form.id ='';
      this.form.areaName = '';
      this.form.address= '';
      this.form.pic= [];
      this.form.description='';
      this.form .detectTypes=[],
      this.form.isDetect=false;
      this.form.imageUrl ='../assets/add.png';
      this.form.filename= null;
    },

    // 添加区域信息(ok)
    addAreaInfo() {
      var id = this.getHeadshotName();
      const objectArray = [];
      this.form.detectTypes.forEach (item => {
        objectArray.push({ genre: item });
      });
      var request_data={
        id :this.form.id,
        areaName: this.form.areaName,
        address: this.form.address,
        pic: id,
        detectTypes: objectArray,
        description: this.form.description,
      }
      console.log(request_data);
    addAreaData(request_data)
    .then((res) => {
        if(this.form.pic.length==0){
          this.loading.close();
        }else {
          this.uploadHeadshot();
          this.page=1;
          this.formInit();
        }
    })
    .catch((err) => {
      this.$message.error('网络连接错误');
      console.log(err);
    })
  },

    //修改区域信息
    updateAreaInfo() {
      const objectArray = [];
      this.form.detectTypes.forEach (item => {
        objectArray.push({ genre: item });
      });
      var request_data={
        id: this.form.id,
        areaName: this.form.areaName,
        address: this.form.address,
        detectTypes: objectArray,
        description: this.form.description,
      }
      console.log(request_data);
      updateAreaData(request_data)
      .then((res) => {
        if(res.data=="failed"){
            this.$message.error('修改失败')
        }else {
          // if(this.form.pic.length==0){
          //   this.loading.close();
          // }else {
            // this.uploadHeadshot();
            this.page=1;
            this.formInit();
            this.area.areaName=null;
            this.area.address=null;
            this.getAllAreaData();
          // }
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
        console.log(err);
      })
    },
    
    // 根据id删除区域
    deleteArea(id){
      this.$confirm('此操作将永久删除该区域 , 是否继续 ?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idsToDelete = [parseInt(id, 10)];
        deleteAreaData(idsToDelete)
        .then((res) => {
          this.$message.error('删除成功');
          this.area.areaName='';
          this.area.address='';
          this.getAllAreaData();
        })
        })
        .catch((err) => {
        console.log(err);
      });
    },
}
  }
  
  </script>
  
  <style>
    @import '../style/components/areaManage.css'
  
  </style>