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
    <el-button type="primary" round @click="handleAddDiaolog " class="custom-button">增加摄像头</el-button>
  </div>
      <!-- 增加摄像头详情页（对话框） -->
      <el-dialog :visible.sync="centerDialogVisible" :title="diaologTitle" width="500" align-center @close="handleDiaologClose">
        <div class="camera_form" v-show="formSetting">
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

            <div class="container_right" id="graphic_container">
              <div class="graphic" id="graphic" @click="handleGraphicClick">
                <span>点击此处设置检测区域</span>
              </div>
            </div>
          </div>
          <div class="dialog_container_bottom">
              <div class="form-group-bottom">
                <label class="form-label">设备分辨率：</label>
                <div class="form_div_ingredient">
                  <el-input v-model="form.widthResolution" placeholder="宽" style="width: 100%;" @input="handleResolutionInput"></el-input>
                </div>
                <div class="between">:</div>
                <div class="form_div_ingredient">
                  <el-input v-model="form.heightResolution" placeholder="高" style="width: 100%;" @input="handleResolutionInput"></el-input>
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
            <el-button type="primary" @click="handleDialogConfirm" class="dialog-button confirm">确定</el-button>
            <el-button @click="centerDialogVisible = false" class="dialog-button cancel">取消</el-button>
          </span>
        </div>
        <div class="graphic_setting" id="graphic_setting" v-show="!formSetting">
          <div class="camera_graphic" id="camera_graphic">
            <canvas id="canvas"></canvas>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="graphicConfirm" class="dialog-button confirm">确定</el-button>
            <el-button @click="graphicReset" class="dialog-button cancel">重置</el-button>
          </div>
        </div>
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
              type="primary"
              @click="handleUpdateDiaolog(scope.row)">修改</el-button>
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
import { reactive } from 'vue';

export default {
  name: "CameraManage",
  computed:{
    ...mapState([
      'deviceId'
    ])
  },
  data: function() {
    return {
      diaologType: 1,
      diaologTitle: '新增摄像头',
      Label: null,
      labelX: -1,
      labelY: -1,
      labelPosX: -1,
      labelPosY: -1,
      startPosX: -1,
      startPosY: -1,
      endPosX: -1,
      endPosY: -1,
      tole: 10,
      Point1: null,
      Point2: null,
      ctx: null,
      unPoint: null,
      isDrawing: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      formSetting: true,
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
        widthResolution: 1920,
        heightResolution:1080,
      }
    }
  },

  mounted() {
    this.getAllCameraData();
    this.getAllAreaData();
    // this.initChart();
    this.updateRoot('');
    this.updatePath('摄像头管理');
    this.initialUnPoint();
    this.initialPoint();
    this.initialLabel();
  },
  
  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),

    initialUnPoint(){
      var point = document.createElement("div");
      point.id = "unPoint";
      point.style.width = "20px";
      point.style.height = "20px";
      point.style.backgroundColor = "rgba(247, 155, 155, 0.5)";
      point.style.display = 'none';
      point.style.position = "absolute";
      point.style.borderRadius = "50%";
      point.style.pointerEvents = "none";
      this.unPoint = point;
    },
    initialPoint(){
      this.Point1 = document.createElement("div");
      this.Point1.style.width = "20px";
      this.Point1.style.height = "20px";
      this.Point1.style.backgroundColor = "#E4080A";
      this.Point1.style.position = "absolute";
      this.Point1.style.borderRadius = "50%";
      this.Point1.style.display = "none";
      this.Point1.style.pointerEvents = "none";

      this.Point2 = document.createElement("div");
      this.Point2.style.width = "20px";
      this.Point2.style.height = "20px";
      this.Point2.style.backgroundColor = "#E4080A";
      this.Point2.style.position = "absolute";
      this.Point2.style.borderRadius = "50%";
      this.Point2.style.display = "none";
      this.Point2.style.pointerEvents = "none";
    },

    initialLabel(){
      this.Label = document.createElement("div");
      // this.Label.textContent = "区域外";
      this.Label.style.border = "1px dashed gray";
      this.Label.style.position = "absolute";
      // this.Label.style.fontSize = "15px";         // 字体大小设置为 20px
      // this.Label.style.padding = "3px";           // 内边距设置为 5px
      this.Label.classList.add("camera_div");
      this.Label.style.display = "none";
      this.Label.style.pointerEvents = "none";
      this.Label.style.userSelect = "none"; 
    },

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

    handleDialogConfirm(){
      if(this.diaologType==1){
        this.addCamera();
      }
      else{
        this.updateCamera();
      }
    },

    // 增加摄像头设备信息(lmy)
    addCamera(){
      this.form.signalLine = Math.floor(this.startPosX) + ',' +  Math.floor(this.startPosY) + ',' + Math.floor(this.endPosX) + ',' + Math.floor(this.endPosY);
      this.form.direction = Math.floor(this.labelPosX) + ',' + Math.floor(this.labelPosY);
      /**
       * 待处理
       */
    },
    // 修改摄像头设备信息(lmy)
    updateCamera(){
      this.form.signalLine = Math.floor(this.startPosX) + ',' +  Math.floor(this.startPosY) + ',' + Math.floor(this.endPosX) + ',' + Math.floor(this.endPosY);
      this.form.direction = Math.floor(this.labelPosX) + ',' + Math.floor(this.labelPosY);
      /**
       * 待处理
       */
    },

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

    handleResolutionInput(value) {
      const father_width = document.getElementById("graphic_container").offsetWidth;
      const father_height = document.getElementById("graphic_container").offsetHeight;
      const graphic = document.getElementById("graphic")
      var father_perce = father_width/father_height;
      var perce = this.form.widthResolution/this.form.heightResolution;
      if(perce > 2.33 || perce < 0.42){
        return;
      }
      if(perce > father_perce){
        graphic.style.width = father_width + 'px';
        graphic.style.height = father_width/perce + 'px';
      }
      else{
        graphic.style.width = father_height*perce + 'px';
        graphic.style.height = father_height + 'px';
      }

    },

    judge(x,y){
      var can_width = document.getElementById("canvas").width;
      var can_height = document.getElementById("canvas").height;
      if(x>-this.tole && x < this.tole && y>-this.tole && y<can_height+this.tole){
        return true;
      }
      if(x>can_width-this.tole && x<can_width+this.tole && y>-this.tole && y<can_height+this.tole){
        return true;
      }
      if(x>-this.tole && x < can_width+this.tole && y>-this.tole && y<this.tole){
        return true;
      }
      if(x>-this.tole && x < can_width+this.tole && y>can_height-this.tole && y<can_height+this.tole){
        return true;
      }
      return false;
    },

    judgeInner(x,y){
      var can_width = document.getElementById("canvas").width;
      var can_height = document.getElementById("canvas").height;
      if(x>this.tole && x < can_width-this.tole && y > this.tole && y < can_height-this.tole){
        return true;
      }
      return false;
    },
    
    moveUnPoint(x,y){
      const {x:correctX, y:correctY} = this.correctXY(x,y);
      // console.log(x,y);
      var unPointLen = 20;
      this.unPoint.style.left = correctX - unPointLen/2 + "px";  
      this.unPoint.style.top = correctY - unPointLen/2 + "px";
      this.unPoint.style.display = "block";
    },
    
    correctXY(x,y){
      const rect = document.getElementById("canvas").getBoundingClientRect();
      var can_width = rect.width;
      var can_height = rect.height;
      if(x>-this.tole && x<this.tole){
        x = 0;
      }
      if(x>can_width-this.tole && x<can_width+this.tole){
        x = can_width;
      }
      if(y>-this.tole && y<this.tole){
        y = 0;
      }
      if(y>can_height-this.tole && y<can_height+this.tole){
        y = can_height;
      }
      // console.log(x,y);
      return {x,y};
    },

    movePoint(id,x,y){
      var pointLen = 20;
      if(id==1){
        this.Point1.style.display = "block";
        this.Point1.style.left = x - pointLen/2 + "px";  //向内偏移自身一半的大小
        this.Point1.style.top = y - pointLen/2 + "px";
      }
      else{
        this.Point2.style.display = "block";
        this.Point2.style.left = x - pointLen/2 + "px";  //向内偏移自身一半的大小
        this.Point2.style.top = y - pointLen/2 + "px";
      }
    },

    moveLabel(x, y){
      this.Label.style.display = "block";
      this.Label.style.left = x - this.Label.offsetWidth/2 + 'px';
      this.Label.style.top = y - this.Label.offsetHeight/2 + 'px';
    },

    handleMouseDown(e){
      if(this.isDrawing){
        return;
      }
      const rect = document.getElementById('canvas').getBoundingClientRect();
      var relativeX = e.clientX - rect.x;
      var relativeY = e.clientY - rect.y;
      const {x:correctX, y:correctY} = this.correctXY(relativeX,relativeY);
      if(this.judge(relativeX,relativeY)){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.Point2.style.display = "none"; 
        this.isDrawing = true;
        this.startX = correctX;
        this.startY = correctY;
        this.endX = -1;
        this.endY = -1;
        this.movePoint(1,correctX, correctY);
      }
      else if(this.judgeInner(relativeX, relativeY)){
        this.labelX = correctX;
        this.labelY = correctY;
        this.moveLabel(relativeX,relativeY);
      }
    },

    handleMouseMove(e){
      const rect = document.getElementById('canvas').getBoundingClientRect();
      var relativeX = e.clientX - rect.x;
      var relativeY = e.clientY - rect.y;
      if (this.isDrawing) {
          // 清除画布
          this.ctx.clearRect(0, 0, canvas.width, canvas.height);
          // 绘制线
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(relativeX, relativeY);
          this.ctx.stroke();
      }
      if(this.judge(relativeX,relativeY)){
        this.moveUnPoint(relativeX,relativeY);
      }
      else{
        this.unPoint.style.display = 'none';
      }
    },

    handleMouseUp(e){
      if(!this.isDrawing){
        return;
      }
      this.isDrawing = false;
      const rect = document.getElementById('canvas').getBoundingClientRect();
      var relativeX = e.clientX - rect.x;
      var relativeY = e.clientY - rect.y;
      if(this.judge(relativeX,relativeY)){
        const {x:correctX, y:correctY} = this.correctXY(relativeX,relativeY);
        this.endX = correctX;
        this.endY = correctY;
        this.movePoint(2,this.endX, this.endY);
        // 清除画布
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制线
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(correctX, correctY);
        this.ctx.stroke();
      }
      else{
        this.Point1.style.display = "none";
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    handleGraphicClick(){
      this.formSetting = false;
      const camera_graphic = document.getElementById("camera_graphic");
      // 鼠标按下事件
      window.addEventListener('mousedown', this.handleMouseDown);
      // 鼠标移动事件
      window.addEventListener('mousemove', this.handleMouseMove);
      // 鼠标松开事件
      window.addEventListener('mouseup', this.handleMouseUp);
      camera_graphic.appendChild(this.unPoint);
      camera_graphic.appendChild(this.Point1);
      camera_graphic.appendChild(this.Point2);
      camera_graphic.appendChild(this.Label);
      
      setTimeout(() => {
        if(this.ctx == null){
          var perce = this.form.widthResolution/this.form.heightResolution;
          camera_graphic.style.height = camera_graphic.offsetWidth/perce + 'px';
          const canvas = document.getElementById('canvas');
          canvas.width = camera_graphic.offsetWidth;
          canvas.height = camera_graphic.offsetHeight;
          this.ctx = canvas.getContext('2d');
        }
        if(this.diaologType == 2){
          this.getCanvas();
        }
      }, 50);
    },

    getCanvas(){
      const canvas = document.getElementById('canvas');
      [this.startPosX, this.startPosY, this.endPosX, this.endPosY] = this.form.signalLine.split(",").map(Number);
      [this.labelPosX, this.labelPosY] = this.form.direction.split(",").map(Number);
      this.startX = this.startPosX/this.form.widthResolution*canvas.width;
      this.startY = this.startPosY/this.form.heightResolution*canvas.height;
      this.endX = this.endPosX/this.form.widthResolution*canvas.width;
      this.endY = this.endPosY/this.form.heightResolution*canvas.height;
      this.labelX = this.labelPosX/this.form.widthResolution*canvas.width;
      this.labelY = this.labelPosY/this.form.heightResolution*canvas.height;
      this.movePoint(1,this.startX,this.startY);
      this.movePoint(2,this.endX,this.endY);
      this.moveLabel(this.labelX,this.labelY);
      // 清除画布
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制线
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.endX, this.endY);
      this.ctx.stroke();
    },

    handleAddDiaolog(){
      this.diaologTitle = "新增摄像头";
      this.diaologType = 1;
      this.centerDialogVisible = true;
      this.formSetting = true;
    },

    handleUpdateDiaolog(row){
      this.form = row
      this.diaologTitle = "更新摄像头";
      this.diaologType = 2;
      this.centerDialogVisible = true;
      this.formSetting = true;
    },

    handleDiaologClose(){
      window.removeEventListener('mousedown',this.handleMouseDown);
      window.removeEventListener('mousemove',this.handleMouseMove);
      window.removeEventListener('mouseup',this.handleMouseUp);
    },

    graphicConfirm(){
      if(this.startX==-1 || this.startY==-1 || this.endX==-1 || this.endY==-1 || this.labelX==-1 || this.labelY==-1){
        this.$message.error('检测信息不全');
        return;
      }
      const rect = document.getElementById("canvas").getBoundingClientRect();
      this.startPosX = this.startX/rect.width*this.form.widthResolution;
      this.startPosY = this.startY/rect.height*this.form.heightResolution;
      this.endPosX = this.endX/rect.width*this.form.widthResolution;
      this.endPosY = this.endY/rect.height*this.form.heightResolution;
      this.labelPosX = this.labelX/rect.width*this.form.widthResolution;
      this.labelPosY = this.labelY/rect.height*this.form.heightResolution;
      this.formSetting = true;
    },

    graphicReset(){
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.Point1.style.display = "none";
      this.Point2.style.display = "none";
      this.unPoint.style.display = "none";
      this.Label.style.display = "none";
      this.graphicDataReset();
    },
    
    graphicDataReset(){
      this.startX = -1;
      this.startY = -1;
      this.endX = -1;
      this.endY = -1;
      this.labelX = -1;
      this.labelY = -1;
    }

  }
}

</script>

<style>

  @import '../style/components/cameraManage.css'

</style>