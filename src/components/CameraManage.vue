<template>
  <div class="CameraManage_body">
    <!-- 左侧做搜索展示 -->
    <div class="CameraManage_body_left">
      <!-- 搜索框 -->
    <div class="camera_search_block" style="margin-top: 15px;">
      <el-input placeholder="请输入摄像头关键信息查询" v-model="input" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="所属区域" value="1"></el-option>
          <el-option label="设备id" value="2"></el-option>
          <el-option label="请选择" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
      </el-input>
    </div>


      <!-- 增加摄像头按钮 -->
      <div class="button-container">
    <el-button type="primary" round @click="centerDialogVisible = true; " class="custom-button">增加摄像头</el-button>
  </div>
      <!-- 增加摄像头详情页（对话框） -->
      <el-dialog :visible.sync="centerDialogVisible" title="新增摄像头" width="500" align-center>
        <div class="dialog_container_top">
          <div class="container_left">
            <div class="form-group-top">
              <label class="form-label">摄像头 ID  ：</label>
              <el-input v-model="form.deviceId" placeholder="请输入摄像头ID" class="cameraIdInput"/>
            </div>
            <div class="form-group-top">
              <label class="form-label">摄像头状态：</label>
              <el-switch v-model="form.status" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>开启
            </div>
            <div class="form-group-top">
              <label class="form-label"> 绑定的区域：</label>
              <el-select v-model="form.area_Id" placeholder="请选择" >
                <el-option
                  v-for="areaData in areaDatas"
                  :key="areaData.id"
                  :label="areaData.areaName"
                  :value="areaData.areName">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="container_right">

          </div>
        </div>
        <div class="dialog_container_bottom">
            <div class="form-group-bottom">
              <label class="form-label">设备分辨率：</label>
              <div class="form_div_ingredient">
                <el-input v-model="form.widthResolution" placeholder="请输入宽分辨率"></el-input>
              </div>
              <div class="form_div_ingredient">
                <el-input v-model="form.heightResolution" placeholder="请输入高分辨率"></el-input>
              </div>
            </div>
            <div class="form-group-bottom">
              <label class="form-label">摄像头描述：</label>
              <el-input
                v-model="form.description"
                placeholder="添加描述"
                class="form-input"
                type="textarea"
                :rows="4" 
              />
            </div>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCamera" class="dialog-button confirm">确定</el-button>
          <el-button @click="centerDialogVisible = false" class="dialog-button cancel">取消</el-button>
        </span>
      </el-dialog>

      <!-- 表格展示 -->
      <el-table
      :data="cameraDatas"
      stripe
      border
      hight="1000"
      style="width: 100%">
        <el-table-column
          prop="deviceId"
          width="150"
          label="设备ID">
        </el-table-column>
        <el-table-column
          prop="areaId"
          width="150"
          label="所属区域">
        </el-table-column>
        <el-table-column
          width="100"
          label="设备状态"
          align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==1" type="success">在线</el-tag>
            <el-tag v-else type="info">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="最近在线时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="cameraDesp"
          label="设备描述">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteCamera(scope.row.deviceId)">删除</el-button>
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

    <!-- 右侧做图像展示 -->
     <div class="CameraManage_body_right">
      <div class="chart_title">设备在线情况</div>
      <div class="chart_word">在线数量：{{ online }}</div>
      <div class="chart_word">离线数量：{{ offline }}</div>
      <div class="chart_title">摄像头区域分布</div>
      <div class="chart" ref="categoryChart"></div>
     </div>     
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
import { getAreaData } from '@/interface/AreaManage';
import { getCameraData,addCameraData,deleteCameraData } from '@/interface/CameraManage';

export default {
  name: "CameraManage",
  computed:{
    ...mapState([
      'deviceId'
    ])
  },
  data: function() {
    return {
      input:'',
      select:'3',
      selectArea:'',
      areaDatas:[],
      cameraDatas:[],
      currentPage:1,
      pageNum:100,
      tableData:[],
      pieChart: null,
      categoryChart: null,
      online:0,
      offline:0,
      centerDialogVisible:false,
      camera:{
        deviceId: '',
        status: false,
        areaId :'',
        description :'',
        pageNum: this.currentPage,
        pageSize:this.pageNum,
      },
      // 添加摄像头需要提交的表单
      form:{
        deviceId : '',
        status : false,
        area_Id : '',
        description : '',
        widthResolution:'',
        heightResolution:'',
      }
    }
  },

  mounted() {
    this.getAllCameraData();
    this.getAllAreaData();
    // this.initChart();
    this.updateRoot('');
    this.updatePath('摄像头管理');

  },
  
  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
    // 获取所有摄像头的值(ok)
    getAllCameraData(){
      getCameraData(this.camera)
      .then((res)=>{
        this.cameraDatas = []
        this.cameraDatas = res.data.rows;
        this.pageNum = res.data.total;
      })
      .catch((err)=>{
        this.$message.error('网络连接错误');
        console.log(err);
      })
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

    // 搜索框，按照查找类型查找(ok)
    handlerSearch() {
      if(this.select == 1){
        this.camera.areaId = this.input;
      }
      else if(this.select == 2){
        this.camera.deviceId = this.input;
      }
      else if(this.select == 3){
        this.camera.areaId = null;
        this.camera.deviceId = null;
      }
      this.getAllCameraData();
    },

    // 增加摄像头设备信息(lmy)
    addCamera(){
    },
    // 修改摄像头设备信息(lmy)

    // 根据id对摄像头进行删除操作
    deleteCamera(id){
      this.$confirm('此操作将永久删除该区域 , 是否继续 ?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idsToDelete = [parseInt(id, 10)];
        console.log(idsToDelete)
        deleteCameraData(idsToDelete)
        .then((res) => {
          this.$message.error('删除成功');
          this.camera.areaId='';
          this.camera.deviceId='';
          this.getAllCameraData();
        })
        })
        .catch((err) => {
        console.log(err);
      });
    },


    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableData = this.areaData.slice((this.currentPage-1)*7,(this.currentPage-1)*7+7);
    },
  }
}

</script>

<style>

  @import '../style/components/cameraManage.css'

</style>