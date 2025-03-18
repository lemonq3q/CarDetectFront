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
        recordDatas: [],
        record:{
          
        },
        currentPage: 1,
        factory: '0',
        pageNum: 10,
        tableData: [],
        pieChart: null,
        categoryChart: null,
        recordSerachVisual:true,
        recordCheckVisual:false,
      }
    },
  
    mounted() {
      this.getAllRecordData();
      this.getDeviceData(null,null,null);
      this.initChart();
      this.updateRoot('');
      this.updatePath('记录管理');
    },
  
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
      // 获取所有的记录数据
      getAllRecordData(){
        get
      },



      // 分页查询
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
    }
  }
  
  </script>
  
  <style>
  @import '../style/components/recordManage.css'
  
  </style>