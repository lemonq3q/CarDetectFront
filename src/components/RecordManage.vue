<template>
    <div class="recordManage_body">
    <div class="recordManage_body_search" v-if="recordSerachVisual">
        <div class="recordManage_left">
      <!-- 搜索框 -->
        <div class="search_block" style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="车辆类型名" value="1"></el-option>
              <el-option label="车牌号" value="2"></el-option>
              <el-option label="检测时间" value="3"></el-option>
              <el-option label="检测区域" value="4"></el-option>
              <el-option label="摄像头" value="5"></el-option>
              <el-option label="请选择" value="6"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
          </el-input>
        </div>

        <!-- form表格展示 -->
        <el-table
        :data="tableData"
        stripe
        border
        hight="1000"
        style="width: 100%">
          <el-table-column
            prop="car_id"
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="type_id"
            label="车辆类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="type_name"
            label="车辆类型名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="time"
            label="检测时间">
          </el-table-column>
          <el-table-column
            prop="area_id"
            label="检测区域">
          </el-table-column>
          <el-table-column
            prop="camera_id"
            label="摄像头ID">
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

      <!-- 右侧展示 -->
      <div class="recordManage_right">
        <div class="chart_title">记录综合情况</div>
        <div class="chart_word">总记录数量：{{ online }}</div>
        <div class="chart_title">各类型车辆记录分布</div>
        <div class="chart" ref="pieChart"></div>
        <div class="chart_title">各区域记录分布</div>
        <div class="chart" ref="categoryChart"></div>
      </div>
    </div>
    <div class="recordManage_body_check" v-if="recordCheckVisual">
        <!-- 左侧展示记录的详细信息 -->
        <div class="recordManage_check_left">
            <div class="recordManage_check_left_title">
                记录详细内容：
            </div>
            <div class="info-group">
                <label>车辆类型：</label>
                <span>{{ type_id }}</span>
            </div>
            <div class="info-group">
                <label>车辆类型名：</label>
                <span>{{ type_name }}</span>
            </div>
            <div class="info-group">
                <label>车牌号：</label>
                <span>{{ car_id }}</span>
            </div>
            <div class="info-group">
                <label>检测时间：</label>
                <span>{{ time }}</span>
            </div>
            <div class="info-group">
                <label>检测区域：</label>
                <span>{{ area_id }}</span>
            </div>
            <div class="info-group">
                <label>摄像头：</label>
                <span>{{ camera_id }}</span>
            </div>
        </div>
        <!-- 右侧展示切片的视频流 -->
        <div class="recordManage_check_right">
            <div class="recordManage_check_right_vedio">

            </div>
            <div class="recordManage_check_right_duration">

            </div>
        </div>
    </div>

    </div>
  </template>
  
  <script>
  import {getPieChart, getCategoryChart} from '../echart'
  import { mapMutations } from 'vuex';
  
  export default {
    name: "DeviceSearch",
  
    data: function() {
      return {
        input: '',
        select: '3',
        deviceData: [],
        currentPage: 1,
        factory: '0',
        pageNum: 100,
        tableData: [],
        pieChart: null,
        categoryChart: null,
        online: 0,
        offline: 0,
        recordSerachVisual:false,
        recordCheckVisual:true,
      }
    },
  
    mounted() {
      this.getDeviceData(null,null,null);
      this.initChart();
      this.updateRoot('设备管理');
      this.updatePath('设备搜索');
    },
  
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
      //根据搜索信息和信息类型获取数据
      getDeviceData(device_id,type,workshop) {
  
        this.$http.get('/device/getDevice',{
          params: {
            device_id: device_id,
            type: type,
            workshop: workshop
          }
        })
        .then((res) => {
          this.deviceData = res.data;
          for(let i=0;i<this.deviceData.length;i++){
            if(this.deviceData[i].description==null){
              this.deviceData[i].description = '无';
            }
  
            var date = new Date(this.deviceData[i].lastTime);
            var year = date.getFullYear(); 
            var month = ("0" + (date.getMonth() + 1)).slice(-2); 
            var day = ("0" + date.getDate()).slice(-2); 
  
            // 构造年月日字符串
            this.deviceData[i].lastTime = year + "-" + month + "-" + day;
            this.deviceData[i].workshop = '厂房'+ this.deviceData[i].workshop;
          }
          // 设置总数据量
          this.pageNum = this.deviceData.length;
          // 设置当前页数
          this.currentPage = 1;
          // 获取第一页数据
          this.tableData = this.deviceData.slice(0,9);
          // 更新图的数据
          var chartData = this.getPieData(this.deviceData);
          this.updatePieChart('设备种类饼图',chartData);
          chartData = this.getCategoryData(this.deviceData);
          this.updateCategoryChart(chartData);
          //更新在线数据
          var onlineData = this.getOnlineNum(this.deviceData);
          this.online = onlineData.online;
          this.offline = onlineData.offline;
        })
        .catch(err=>{
          console.log(err);
        })
  
      },
  
      deleteDevice(device_id) {
  
        this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/device/deleteDevice?device_id='+device_id)
          .then((res) => {
            if(res.data=="succeed"){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //更新现有数据
              for(let i=0;i<this.deviceData.length;i++){
                if(this.deviceData[i].device_id==device_id){
                  this.deviceData.splice(i,1);
                  break;
                }
              }
              this.pageNum--;
              this.tableData = this.deviceData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9);
              // 更新图的数据
              var chartData = this.getPieData(this.deviceData);
              this.updatePieChart('设备种类饼图',chartData);
              chartData = this.getCategoryData(this.deviceData);
              this.updateCategoryChart(chartData);
              //更新在线数据
              var onlineData = this.getOnlineNum(this.deviceData);
              this.online = onlineData.online;
              this.offline = onlineData.offline;
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
          this.$http.post('/device/updateDescription?device_id='+device_id+'&description='+value)
          .then((res) => {
            if(res.data=="succeed"){
              this.$message({
                type: 'success',
                message: '添加成功'
              });
               //更新现有数据
              for(let i=0;i<this.deviceData.length;i++){
                if(this.deviceData[i].device_id==device_id){
                  this.deviceData[i].description = value
                  break
                }
              }
              this.tableData = this.deviceData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9);
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
  
      handleCurrentChange(val) {
        
        this.currentPage = val
        this.tableData = this.deviceData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9)
      
      },
  
      handlerSearch() {
  
        var workshop = this.factory
        if(workshop=='0'){
          workshop = null
        }
        if(this.select==3){
          this.getDeviceData(null,null,workshop)
        }else if(this.select==2){
          this.getDeviceData(null,this.input,workshop)
        }
        else if(this.select==1){
          this.getDeviceData(this.input,null,workshop)
        }
  
      },
  
      handlerWorkshopChange(factory) {
        if(factory=='0'){
          if(this.select==3){
            this.getDeviceData(null,null,null)
          }else if(this.select==2){
            this.getDeviceData(null,this.input,null)
          }
          else if(this.select==1){
            this.getDeviceData(this.input,null,null)
          }
        }else {
          if(this.select==3){
            this.getDeviceData(null,null,factory)
          }else if(this.select==2){
            this.getDeviceData(null,this.input,factory)
          }
          else if(this.select==1){
            this.getDeviceData(this.input,null,factory)
          }
        }
  
      },
  
      // 初始化图表
      initChart() {
  
        this.pieChart = this.$echarts.init(this.$refs.pieChart);
        this.categoryChart = this.$echarts.init(this.$refs.categoryChart);
  
      },
  
      // 更新饼状图
      updatePieChart(title,data) {
  
        var option = getPieChart(title,data);
        this.pieChart.setOption(option);
  
      },
      // 更新柱状图
      updateCategoryChart(data) {
        var option = getCategoryChart(data);
        this.categoryChart.setOption(option);
      },
  
      //获取饼图数据
      getPieData(data) {
        var result = [];
        for(let i=0;i<data.length;i++){
          let flag = 0;
          for(let j=0;j<result.length;j++){
            if(result[j].name==data[i].type){
              result[j].value++;
              flag = 1;
            }
          }
          if(flag==0){
            let item = {
              value: 1,
              name: data[i].type
            };
            result.push(item);
          }
        }
        return result;
      },
  
      //获取柱状图数据
      getCategoryData(data) {
        let x = ['厂房1','厂房2','厂房3','厂房4'];
        let y = [0,0,0,0];
        for(let i=0;i<data.length;i++){
          for(let j=0;j<4;j++){
            if(data[i].workshop==x[j]){
              y[j]++;
            }
          }
        }
        return {
          x: x,
          y: y
        };
      },
      
      //获取设备在线和离线的数据
      getOnlineNum(data) {
        var online = 0;
        var offline = 0;
        for(let i=0;i<data.length;i++){
          if(data[i].state==1){
            online++;
          }
          else{
            offline++;
          }
        }
        return {
          online: online,
          offline: offline
        };
      }
      
    },
  
  }
  
  </script>
  
  <style>
  @import '../style/components/recordManage.css'
  
  </style>