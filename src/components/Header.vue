<template>
  <div class="header">
    <div class="left">
      <!-- 下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <i class="menu_icon el-icon-s-fold"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">刷新数据</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus" command="refresh">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="index_tip"><span style="color: #49586e;">{{ root }}</span>&thinsp;&thinsp;&thinsp;&thinsp;
      {{path==''?'':'/'}}&thinsp;&thinsp;&thinsp;&thinsp;<span  style="color: #49586e;">{{ path==''?'':path }}</span></span>
    </div>
    <div class="right">
      <img class="header_img" :src="userheadshot" alt="">
      <span class="header_username">{{ username }}</span>
      <span class="header_date" style="width: 150px; color: grey;">{{ date }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: "Header",
  computed: {
    ...mapState([
      'path','userheadshot','username','root'
    ]),
  },

  data: function() {
    return {
      date: '',
      headshot: 'http://'+this.$ip+':80/images/userheadshot.png'
    }
  },

  mounted() {
    setInterval(this.getCurrentDate,1000);
    var num = 0;
    var inter = setInterval(() => {
      if(this.userheadshot!=null){
        this.headshot = 'http://'+this.$ip+':80/images/'+this.userheadshot;
      }
      num++;
      if(num==10){
        clearInterval(inter);
      }
    }, 50);
  },

  methods: {
    ...mapMutations([
      'setLogin'
    ]),

    //生成时间
    getCurrentDate(){
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1); // 月份是从0开始的，所以需要+1
      const day = String(now.getDate());
      const hours = String(now.getHours()).slice(-2);
      const minutes = String(now.getMinutes()).slice(-2);
      const seconds = String(now.getSeconds()).slice(-2);

      this.date =  `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },

    handleCommand(command){
      // console.log("command enter");
      if(command=="refresh"){
        this.handleExit();
      }
    },

    handleExit() {
      var lemonToken = localStorage.getItem('lemon-token');
      console.log(lemonToken);
      this.$http('/upload/exitLogin?token='+lemonToken)
      .then(res=>{
        if(res.data.code==200){
          this.setLogin(false);
          this.$router.push('/login');
        }
      })
      .catch(err=>{
        console.log(err);
        this.$message.error('网络连接错误');
      })
    }
  }
}

</script>

<style>
@import "../style/components/header.css";

</style>