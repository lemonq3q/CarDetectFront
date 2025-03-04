<!-- 首页展示数据页面 -->
<template>
  <div class="home_body">
    <div class="home_top">
      <div class="home_title">Dashboard</div>
      <div class="home_subtitle">Device / Model</div>
    </div>

    <div class="home_middle">
      <div class="home_board_body">
        <div class="home_react_board">
          <img class="home_board_img" src="../assets/online_num.png" alt="">
          <div class="home_board_word">
            <div class="home_num">{{ online }}</div>
            <div class="home_board_title">在线设备</div>
          </div>
        </div>
        <div class="home_react_board">
          <img class="home_board_img" src="../assets/device_sum.png" alt="">
          <div class="home_board_word">
            <div class="home_num">{{ online+offline }}</div>
            <div class="home_board_title">设备总量</div>
          </div>
        </div>
        <div class="home_react_board">
          <img class="home_board_img" src="../assets/model_num.png" alt="">
          <div class="home_board_word">
            <div class="home_num">{{ availableModel }}</div>
            <div class="home_board_title">可用模型</div>
          </div>
        </div>
        <div class="home_react_board">
          <img class="home_board_img" src="../assets/accuracy.png" alt="">
          <div class="home_board_word">
            <div class="home_num">{{ percentage_accuracy }}</div>
            <div class="home_board_title">平均准确率</div>
          </div>
        </div>
      </div>
      <div class="home_pie" ref="homePieChart"></div>
    </div>

    <div class="home_footer">
      <div class="home_footer_left">
        <div class="home_chart_title">最近模型训练情况</div>
        <div class="home_footer_chart1" ref="home_footer_chart1"></div>
      </div>
      <div class="home_footer_right">
        <div class="home_chart_topTitle">设备分布</div>
        <div class="home_footer_chart2" ref="home_footer_chart2"></div>
      </div>   
    </div>
  </div>
</template>

<script>
import {getHomePie, getScatterChart, getHomeCategory} from '../echart'
import { mapMutations } from 'vuex';

export default {
  name: "Home",
  computed: {
    // ...mapMutations([
    //   'updatePath'
    // ])
  },
  data: function(){
    return {
      modelDatas: [],
      percentage_accuracy: 0,
      online: 0,
      offline: 0,
      availableModel: 0,
      pieChart: null,
      scatterChart: null,
      categoryChart: null,
      currentEmphasisIndex: null
    }
  },

  mounted() {
    this.getModelData();
    this.getDeviceData();
    this.initChart();
    this.updateRoot('首页');
    this.updatePath('');
  },

  methods: {
    ...mapMutations([
      'updatePath','updateRoot'
    ]),
    //获取模型信息
    getModelData() {
      this.$http.get('/model/getAll')
      .then((res) => {
        this.getModelBoardData(res.data);
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

    // 初始化图表
    initChart() {
      this.pieChart = this.$echarts.init(this.$refs.homePieChart);
      this.scatterChart = this.$echarts.init(this.$refs.home_footer_chart1);
      this.categoryChart = this.$echarts.init(this.$refs.home_footer_chart2);
      this.scatterChart.setOption(getScatterChart());
      this.pieChart.dispatchAction({
        type:'' ,
        seriesIndex: 0 ,
        dataIndex: 0 ,
      })
    },

     //根据搜索信息和信息类型获取数据
     getDeviceData() {
      this.$http.get('/device/getDevice',{
        params: {
          device_id: null,
          type: null,
          workshop: null
        }
      })
      .then((res) => {
        console.log('device_get');
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
        chartData = this.getOnlineByFactoryData(this.deviceData);
        this.categoryChart.setOption(getHomeCategory(chartData));
        // 更新在线数据
        var onlineData = this.getOnlineNum(this.deviceData);
        this.online = onlineData.online;
        this.offline = onlineData.offline;
      })

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
    },

    //处理总数与在线数量
    getOnlineByFactoryData(data) {
      var sum = [0,0,0,0];
      var online = [0,0,0,0];
      for(let i=0;i<data.length;i++){
        if(data[i].workshop=='厂房1'){
          sum[0]++;
          if(data[i].state==1){
            online[0]++;
          }
        }else if(data[i].workshop=='厂房2'){
          sum[1]++;
          if(data[i].state==1){
            online[1]++;
          }
        }else if(data[i].workshop=='厂房3'){
          sum[2]++;
          if(data[i].state==1){
            online[2]++;
          }
        }else if(data[i].workshop=='厂房4'){
          sum[3]++;
          if(data[i].state==1){
            online[3]++;
          }
        }
      }
      return {
        sum: sum.reverse(),
        online: online.reverse()
      };
    },

    //处理modelData
    getModelBoardData(data) {
      var availableNum = 0;
      var percentage = 0.0;
      var ac_num = 0.0;
      for(let i=0;i<data.length;i++){
        if(data[i].state==1){
          availableNum++;
        }
        if(data[i].accuracy!=0){
          ac_num++;
          percentage += data[i].accuracy;
        }
      }
      this.availableModel = availableNum;
      this.percentage_accuracy = (percentage / ac_num).toFixed(2) + '%';
    },

     // 更新饼状图
     updatePieChart(title,data) {
      var option = getHomePie(title,data);
      this.pieChart.setOption(option);
      setTimeout(()=>{
        this.pieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0, // 同上
          dataIndex: 0
        });
        this.currentEmphasisIndex = 0;
      },200)
      this.setPieChartBehave();
    },

    //设置饼状图行为
    setPieChartBehave() {
      this.pieChart.on('mouseover',(event) => {
        if (event.componentType === 'series' && event.seriesType === 'pie') {
          var dataIndex = event.dataIndex;
          
          if (this.currentEmphasisIndex !== dataIndex) {
            // 取消先前高亮的数据项（如果存在）
            if (this.currentEmphasisIndex !== null) {
              this.pieChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0, // 假设只有一个饼图系列，此处填写相应系列索引
                dataIndex: this.currentEmphasisIndex
              });
            }

            // 高亮当前鼠标所在的数据显示项
            this.pieChart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0, // 同上
              dataIndex: dataIndex
            });

            // 更新当前高亮数据项的索引
            this.currentEmphasisIndex = dataIndex;
          }
        }
      });

    this.pieChart.on('mouseout',(event) => {
      if (event.componentType === 'series' && event.seriesType === 'pie') {

        }
      });
    }

  }

}

</script>

<style>
@import '../style/components/home.css';

</style>