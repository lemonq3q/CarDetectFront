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
              <el-option label="检测区域" value="3"></el-option>
              <el-option label="摄像头" value="4"></el-option>
              <el-option label="请选择" value="5"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
          </el-input>
        </div>

        <!-- form表格展示简略记录 -->
        <el-table
        :data="tableData"
        stripe
        border
        hight="1000"
        style="width: 100%; ">
          <el-table-column
            prop="id"
            label="记录号"
            width="65px">
          </el-table-column>
          <el-table-column
            prop="carId"
            label="车牌号"
            width="110px">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="车辆类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="检测区域"
            width="120px">
          </el-table-column>
          <el-table-column
            prop="areaAddress"
            label="区域地址"
            width="200px">
          </el-table-column>
          <el-table-column
            prop="cameraId"
            label="摄像头ID">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleVeiwDetails(scope.row)">查看详情</el-button>
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
        <!-- <div class="chart_word">总记录数量：{{ online }}</div> -->
        <div class="chart_title">各类型车辆记录分布</div>
        <div class="chart" ref="pieChart"></div>
        <div class="chart_title">各区域记录分布</div>
        <div class="chart" ref="categoryChart"></div>
      </div>
    </div>

    <!-- 详细内容 -->
    <div class="recordManage_body_check" v-if="recordCheckVisual">
        <!-- 左侧展示记录的详细信息 -->
        <div class="recordManage_check_left">
            <div class="recordManage_check_left_title">
                记录详细内容：
            </div>
            <div class="info-group">
                <label>车辆类型：</label>
                <span>{{ this.form.typeId }}</span>
            </div>
            <div class="info-group">
                <label>车辆类型名：</label>
                <span>{{ this.form.typeName }}</span>
            </div>
            <div class="info-group">
                <label>车牌号：</label>
                <span>{{ this.form.carId }}</span>
            </div>
            <div class="info-group">
                <label>检测时间：</label>
                <span>{{ this.form.recordTime }}</span>
            </div>
            <div class="info-group">
                <label>检测区域：</label>
                <span>{{ this.form.areaName }}</span>
            </div>
            <div class="info-group">
                <label>摄像头ID：</label>
                <span>{{ this.form.cameraId }}</span>
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
  import { getRecordData ,addRecordData ,updateRecordData ,deleteRecordData } from '../interface/RecordManage';
  
  export default {
    name: "DeviceSearch",
    computed:{
      tableData() {
        const start = (this.currentPage - 1) * 6;
        const end = start + 6;
        return this.recordDatas.slice(start, end);
      }
    },
    data: function() {
      return {
        input: '',
        select: '3',
        recordDatas: [],
        record:{
          id : null,
          typeId : '',
          typeName : '',
          carId : '',
          recordTime : '',
          video : '',
          areaId : '',
          areaName : '',
          areaAddress : '',
          cameraId : ''
        },
        form:{
          id : null,
          typeId : '',
          typeName : '',
          carId : '',
          recordTime : '',
          video : '',
          areaId : '',
          areaName : '',
          areaAddress : '',
          cameraId : ''
        },
        currentPage: 1,
        pageNum: 10,
        pieChart: null,
        categoryChart: null,
        recordSerachVisual:true,
        recordCheckVisual:false,
      }
    },
  
    mounted() {
      this.getAllRecordData();
      this.updateRoot('记录管理');
      this.updatePath('记录管理');
    },
  
    methods: {
      ...mapMutations([
        'updatePath','updateRoot'
      ]),
      // 获取所有的记录数据(ok)
      getAllRecordData(){
        getRecordData(this.record)
        .then((res) => {
          console.log(res);
          this.recordDatas = [];
          this.recordDatas = res.data.rows;
          console.log(this.recordDatas);
          this.pageNum = res.data.total;
        })
        .catch((err) => {
          this.$message.error('网络连接错误');
          console.log(err);
        })
      },

      // 翻页(ok)
      handleCurrentChange(val) {
        this.currentPage = val
        this.tableData = this.deviceData.slice((this.currentPage-1)*9,(this.currentPage-1)*9+9)
      },

      // 初始化record
      recordInit(){
        this.record.id = '';
        this.record.typeId = '';
        this.record.typeName = '';
        this.record.carId = '';
        this.record.recordTime = '';
        this.record.areaId = '',
        this.record.areaName = '';
        this.record.areaAddress = '';
        this.record.cameraId = '';
        this.record.video = '';
        this.record.recordTime = '';
      },

      // 根据选择搜索相应的记录
      handlerSearch() {
        this.recordInit();
        if(this.select == 1){
          this.record.typeName = this.input;
        }
        else if(this.select == 2){
          this.record.carId = this.input;
        }
        else if(this.select == 3){
          this.record.areaName = this.input;
        }
        else if(this.select == 4){
          this.record.cameraId = this.inupt;
        }
        this.getAllAreaData();
      },

      // 通过点击button查看每条记录的详细内容
      handleVeiwDetails(row){
        this.recordSerachVisual=false;
        this.recordCheckVisual=true;
        console.log(row);
        // getRecordData(this.row)
        // .then((res) => {

        // })
        this.form = {
          typeId : row.typeId,
          typeName : row.typeName,
          carId : row.carId,
          recordTime : row.recordTime,
          areaId : row.areaId,
          areaName : row.areaName,
          areaAddress : row.areaAddress,
          cameraId : row.cameraId
        }
      }
    }
  }
  
  </script>
  
  <style>
  @import '../style/components/recordManage.css'
  
  </style>