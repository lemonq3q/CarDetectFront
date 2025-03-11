<template>
    <div class="AreaManage_body">
      <div class="AreaManage__left">
        <div class="AreaManage_left_title">管辖区域查询</div>
        <!-- 搜索框 -->
        <div class="area_search_block" style="margin-top: 15px;">
          <el-input placeholder="请输入区域关键信息查询" v-model="input" class="input-with-select">
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
            label="区域id">
          </el-table-column>
          <el-table-column
            prop="name"
            label="区域名称">
          </el-table-column>
          <el-table-column
            label="区域照片"
            width="180"
            align="center">
            <template slot-scope="scope">
              <img class="area_headshot" :src="scope.row.headshot" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="区域地址">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button
              size="mini"
              @click="addAreaDescription(scope.row.device_id)">添加描述</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteDevice(scope.row.device_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页查询 -->
        <el-pagination
        background
        layout="prev, pager, next"
        :total="pageNum"
        :current-page="currentPage"
        :page-size="9"
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
            :file-list="form.headshot">
            <img v-if="imageUrl" :src="imageUrl" class="area_avatar">
            <i v-else class="el-icon-plus area_avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-row class="seniority_position_row">
          <el-col :span="10">
            <el-form-item label="区域名" prop="name">
              <el-input v-model="form.name"></el-input>
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
            <el-form-item label="检测绑定" prop="name">
              <el-switch v-model="form.isDetect"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="10">

          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <el-form-item label="检测模型" prop="typeName">
              <el-checkbox-group v-model="form.typeName">
            <el-checkbox v-for="typeName in typeNames" :key="typeName.id" :label="typeName.id" :disabled="!form.isDetect">{{ modelData.name }}</el-checkbox>
          </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="seniority_position_row">
          <el-col :span="10">
            <el-form-item label="区域介绍" prop="desc">
              <el-input v-model="form.desc" size="large" class="desc-input" style="width: 100%; height: 100px;"></el-input>
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
  import { mapState,mapMutations } from 'vuex';


  export default {
    name: "AreaManage",
    computed:{
      ...mapState([
        'id'
      ]),
    },
    data: function() {
      return {
        input:"",
        areaDatas:[],
        currentPage: 1,
        pageNum: 100,
        tableData: [],
        page: 1,
        selectArea: null,
        imageUrl: '',
        loading: null,
        form: {
          name: '',
          address: '',
          headshot: [],
          desc:''
        },
        rules:{
          name:[
            {required: true,message:'请输入区域名',trigger: 'blur'},
          ],
          address:[
            {required: true,message:'请输入区域地址',trigger: 'blur'},
          ],
          desc:[
            {required: true,message:'请输入区域介绍',trigger: 'blur'},
          ],
        }
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
    //获取全部区域信息
    getAreaData() {
      this.$http.get('/model/getAll')//调用接口
      .then((res) => {
        this.areaDatas = res.data;
        this.currentPage = 1;
        this.pageNum = this.employeeData.length;
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },

    // 通过关键信息获取区域信息
    getAreaDataByName(){
      this.$http.get('')
      .then((res) => {
        this.areaData = res.data;
        this.currentPage = 1;
        this.pageNum =this.areaData.length;
      })
    },
    
    // 根据id删除区域
    deleteArea(id){
      this.$confirm('此操作将永久删除员工 , 是否继续 ?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('')
        .then((res) => {
          if(res.data=="succeed"){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.deleteMyData(id);
          }else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => {
          this.$message.error('网络连接失败');
        });
        }).catch((err) => {
       
      });
    },

    // 删除现有数据
    deleteMyData(id) {
      for(let i=0;i<this.employeeData.length;i++){
        if(this.employeeData[i].id==id){
          this.employeeData.splice(i,1);
          break;
        }
      }
      this.pageNum--;
      this.tableData = this.employeeData.slice((this.currentPage-1)*7,(this.currentPage-1)*7+7);
    },

    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableData = this.areaData.slice((this.currentPage-1)*7,(this.currentPage-1)*7+7);
    },

    //搜索处理
    handlerSearch() {
      if(this.input==""){
        this.getAreaData();
      }else{
        this.getAreaDataByName();
      }
    },

    //表格点击响应
    handlerCellClick(row,column,cell,event) {
      this.selectEmployee = row
      this.form = {
        id: row.id,
        name: row.name,
        address: row.address,
        headshot: [],
        desc: row.desc,
      };
      this.imageUrl = row.headshot;
      this.page = 3;
    },

    //添加员工按钮
    handleAddButton() {
      this.page = 2;
    },

    //添加图片
    handlePicChange(file,fileList){
      this.form.headshot = [file];
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    
    //删除文件
    handlePicRemove(file,fileList) {
      this.form.headshot = [];
      this.imageUrl = '';
    },

    //提交
    onSubmit() {
      this.$refs['area_form'].validate((valid) => {
        if (valid) {
          this.loading = this.$loading({
            lock: true,
            text: '数据上传中',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,0.7)'
          });
          if(this.page==2){
            this.addAreaData();
          }else{
            this.updateArea();
          }
        } else {

        }
      });
    },

    //取消
    handleCancel() {
      this.form =  {
        name: '',
        address: '',
        headshot: [],
        desc: ''
      };
      this.imageUrl = '';
      this.page = 1;
    },

    //上传图片
    uploadHeadshot(id) {
      var param = new FormData();
      this.form.headshot.forEach(
        (val, index) => {
          param.append("file", val.raw);
        }
      );
      console.log(param);
      this.$http.post("/addData/uploadImage?filename="+id, param)
      .then((res) => {
        if(res.data=="succeed"){
          this.$message({
            message: "上传完成！",
            type: "success"
          });
        }else {
          this.$message.error('照片上传失败');
        }     
        this.loading.close();
      })
      .catch((err) => {
        this.$message.error('上传失败');
        this.loading.close();
      });

    },

    //添加区域信息
    addAreaData() {
      this.$http.post('/updateData/addEmployee',{
        name: this.form.name,
        address: this.form.address,
        desc: this.form.desc
      })
      .then((res) => {
        if(res.data=="failed"){
          this.$message.error('添加失败')
        }else {
          if(this.form.headshot.length==0){
            this.loading.close();
          }else {
            this.uploadHeadshot(res.data);
          }
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      })
    },

    //修改员工信息
    updateEmployee() {
      var tmpData = {
        id: this.form.id,
        name: this.form.name,
        address: this.form.address,
        desc: this.form.desc,
      };
      this.$http.post('/updateData/updateEmployee',{
        id: this.form.id,
        name: this.form.name,
        address: this.form.address,
        desc: this.form.desc
      })
      .then((res) => {
        if(res.data=="failed"){
          this.$message.error('修改失败');
          this.loading.close();
        }else {
          if(this.form.headshot.length!=0){
            this.uploadHeadshot(this.form.id);
          }else{
            this.loading.close();
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            for(let i=0;i<this.employeeData.length;i++){
              if(this.employeeData[i].id==tmpData.id){
                this.employeeData[i].name = tmpData.name;
                this.employeeData[i].address = tmpData.address;
                this.employeeData[i].desc = tmpData.desc;
                this.tableData = this.employeeData.slice((this.currentPage-1)*7,(this.currentPage-1)*7+7);
                break;
              }
            }
          }
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
        this.loading.close();
      })
    },
    // // 搜索框
    // handlerSearch(){
    //   this.getSearchData(this.input);
    // },
    // getSearchData(area_id){
    //   this.tableData = [];
    //   this.$http.get('/device/getDevice',{
    //     params: {
    //       area_id: area_id==''? null : area_id,
    //     }
    //   })
    //   .then((res) => {
    //     for(let i=0;i<res.data.length;i++){
    //       let item = {
    //         id: res.data[i].id,
    //         name: res.data[i].name,
    //         name:res.data[i].address,
    //         pic:res.data[i].pic,
    //         desc:res.data[i].desc,
    //       }
    //       this.tableData.push(item);
    //     }
    //   })
    //   .catch((err) => {

    //   });
    // },

    }
  }
  
  </script>
  
  <style>
    /* @import '../style/components/modelSetting.css' */
    @import '../style/components/areaManage.css'
  
  </style>