<template>
  <div class="CameraManage_body">
    <!-- 左侧做搜索展示 -->
    <div class="CameraManage_body_left">
      <!-- 搜索框 -->
      <div class="camera_search_block" style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
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
    <el-button type="primary" round @click="centerDialogVisible = true" class="custom-button">增加摄像头</el-button>
  </div>
      <!-- 增加摄像头详情页（对话框） -->
      <el-dialog v-model="centerDialogVisible" title="Warning" width="500" align-center>
        <span>Open the dialog from the center from the screen</span>
        <!-- <template #footer>
          <div class="dialog-footer">
            <div class="areaChoose">
              请选择区域：
              <el-dropdown>
                <el-button type="primary">Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                    <el-dropdown-item>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div>
              请输入摄像头ID
              <el-input v-model="deviceId" style="width: 240px" placeholder="请输入摄像头ID" />
            </div>
            <div>
              摄像头状态： 关闭<el-switch v-model="status" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>开启
            </div>
            <div class="desp">
              <el-input v-model="cameraDesp" style="width: 240px" placeholder="添加描述" />
            </div>
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="addCamera">Confirm</el-button>
          </div>
        </template> -->
      </el-dialog>

      <!-- 表格展示 -->
      <el-table
      :data="tableData"
      stripe
      border
      hight="1000"
      style="width: 100%">
        <el-table-column
          prop="device_id"
          width="150"
          label="设备ID">
        </el-table-column>
        <el-table-column
          prop="area_id"
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
              @click="addDeviceDescription(scope.row.device_id)">添加描述</el-button>
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
      cameraData:[],
      currentPage:1,
      pageNum:100,
      tableData:[],
      pieChart: null,
      categoryChart: null,
      online:0,
      offline:0,
      centerDialogVisible:false,
    }
  },

  mounted() {
    this.getCameraData(null,null);
    this.initChart();
    this.updateRoot('');
    this.updatePath('摄像头管理');

  },
  
  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
    // 获取所有摄像头的值
    getCameraData() {
      this.$http.get('/model/getAll')
      .then((res) => {
        for(let i=0;i<res.data.length;i++){
          let item = {
            id: res.data[i].id,
            name: res.data[i].modelName
          };
          this.modelDatas.push(item);
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },

    // 搜索框，按照查找类型查找
    handlerSearch() {
      if(this.select==3){
        this.getDeviceData(null,null,)
      }else if(this.select==2){
        // 设备id查找
        this.getDeviceData(null,this.input)
      }
      else if(this.select==1){
        // 所属区域查找
        this.getDeviceData(this.input,null)
      }
    },

    // 根据搜索信息和信息类型获取数据    
    getDeviceData(area_id,device_id){
      // 调用接口
      this.$http.get('/device/getDevice',{
      params: {
        device_id: device_id,
        area_id: area_id
      }
      })
      .then((res) => {
        this.cameraData = res.data;
        for(let i=0;i<this.cameraData.length;i++){
          if(this.cameraData[i].description==null){
            this.cameraData[i].description = '无';
          }
        }
        // 设置总数据量
        this.pageNum = this.cameraData.length;
        // 设置当前页数
        this.currentPage = 1;
        // 获取第一页数据
        this.tableData = this.cameraData.slice(0,9);
      })
      .catch(err=>{
        console.log(err);
      })
    },

    // 增加摄像头设备
    addCamera() {
      // 调用接口
      this.$http.post('/device/addDevice',{
        device_id:  this.form.device_id,
        area_id: this.form.area_id,
        lastTime: new Date().getTime(),
        description: this.form.desc==''? null : this.form.desc
      })
      .then((res) => {
        if(res.data=='succeed'){
          this.addDeviceModel(this.form.device_id);
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.centerDialogVisible=false;
        }else {
          this.$message({
            message: '设备编号重复！',
            type: 'warning'
          });
        }
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },
    // 表格中对摄像头进行增加描述和删除操作
    deleteDevice(device_id) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        this.$http.delete('/device/deleteDevice?device_id='+device_id)
        .then((res) => {
          if(res.data=="succeed"){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //更新现有数据
            for(let i=0;i<this.cameraData.length;i++){
              if(this.cameraData[i].device_id==device_id){
                this.cameraData.splice(i,1);
                break;
              }
            }
            this.pageNum--;
            this.tableData = this.cameraData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9);
          }else{
            this.$message({
              type: 'info',
              message: '删除失败'
            });        
          }
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '删除失败'
          });
        })
      }).catch((err) => {
      
      });

      },

    addDeviceDescription(device_id) {

    this.$prompt('请输入描述', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(({ value }) => {
      // 调用增加描述接口
      this.$http.post('/device/updateDescription?device_id='+device_id+'&description='+value)
      .then((res) => {
        if(res.data=="succeed"){
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          //更新现有数据
          for(let i=0;i<this.cameraData.length;i++){
            if(this.cameraData[i].device_id==device_id){
              this.cameraData[i].description = value
              break
            }
          }
          this.tableData = this.cameraData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9);
        }else {
          this.$message({
            type: 'info',
            message: '添加失败'
          });
        }
      })
      .catch((err) => {
        this.$message({
          type: 'info',
          message: '添加失败'
        });
      })
    }).catch(() => {

    });

    },
  }
}

</script>

<style>
  /* @import '../style/components/modelSetting.css' */
  @import '../style/components/cameraManage.css'

</style>