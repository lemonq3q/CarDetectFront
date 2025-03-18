<template>
  <div class="login_body">
    <div class="login_container">
      <div class="account_sign_container">
        <div :class="{'account_sign':true, 'animation_account':isAnimating}">
          <h1 class="login_title">账号登录</h1>
          <input class="login_input" type="text" placeholder="用户名" v-model="form.username">
          <input class="login_input" type="password" placeholder="密码" v-model="form.password">
          <button class="login_button" @click="handleAccountLogin">登 录</button>
        </div>
      </div>
      <div class="phone_sign_container">
        <div :class="{'phone_sign':true, 'animation_phone':isAnimating}">
          <h1 class="login_title">验证码登录</h1>
          <input class="login_input" type="text" placeholder="手机号" v-model="form.phone">
          <div class="verify_block">
            <input class="login_input verify_input" type="text" placeholder="验证码" v-model="form.captcha">
            <button class="verify_button" @click="handleGetCaptcha">{{ buttonValue }}</button>
          </div>
          <button class="login_button" @click="handlePhoneLogin">登 录</button>
        </div>
      </div>
      <div :class="{'overlay_container':true, 'animation_overlay_container':isAnimating}">
        <div :class="{'overlay':true,'animation_overlay':isAnimating}">
          <div class="overlay_left">
            <div class="login_logo_container">
              <img class="logo login_logo" src="../assets/logo.png" alt="">
              <div class="logo_title" style="margin:0 10px;">智安<span style="color: #FCE610;">云盾</span></div>
            </div>
            <h1 class="change_title">使用账户密码进行登录</h1>
            <button class="change_button" @click="handleChange(0)">切换</button>
          </div>
          <div class="overlay_right">
            <div class="login_logo_container">
              <img class="logo login_logo" src="../assets/logo.png" alt="">
              <div class="logo_title" style="margin:0 10px;">智安<span style="color: #FCE610;">云盾</span></div>
            </div>
            <h1 class="change_title">使用验证码进行登录</h1>
            <button class="change_button" @click="handleChange(1)">切换</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <button @click="handleLogin">进入</button> -->
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';

export default {
  name: 'Login',

  computed: {
    ...mapState([
      'path','userheadshot','username','root'
    ]),
  },

  data: function() {
    return {
      isAnimating: false,
      isGet: true,
      buttonValue: '获取验证码',
      form: {
        username: '',
        password: '',
        phone: '',
        verify: '',
        captcha: ''
      },
      fixedPhone: '',
      fixedUsername: ''
    }
  },
  
  //自动登录
  mounted(){
    this.autoLogin();
  },

  methods: {
    ...mapMutations([
      'updateHeadShot','updateUsername','updateUserId','setLogin'
    ]),

    // //测试登录用
    // handleLogin() {
    //   this.$router.push('/index/');
    // },

    //切换动画
    handleChange(flag) {
      if(flag==1) {
        this.isAnimating = true;
      }else{
        this.isAnimating = false;
      }
    },

    //通过手机号获取用户信息
    getUserInfoByPhone(){
      this.$http.get('/user/getUserByPhone?phone='+this.fixedPhone)
      .then((res) => {
        this.updateHeadShot(res.data.headshot);
        this.updateUsername(res.data.username);
        this.updateUserId(res.data.userid);
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },
    
    //通过用户名获取用户信息
    getUserInfoByUsername() {
      this.$http.get('/user/getUserByUsername?username='+this.fixedUsername)
      .then((res) => {
        this.updateHeadShot(res.data.headshot);
        this.updateUsername(res.data.username);
        this.updateUserId(res.data.userid);
      })
      .catch((err) => {
        this.$message.error('网络连接错误');
      });
    },

    //账户密码登陆
    handleAccountLogin() {
      if(this.form.username==""){
        this.$message({
          message: '请输入用户名',
          type: 'warning'
        });
      }else if(this.form.password==""){
        this.$message({
          message: '请输入密码',
          type: 'warning'
        });
      }else {
        this.fixedUsername = this.form.username;
        this.$http.get('/upload/usernameUpload?username='+this.form.username+'&password='+this.form.password)
        .then((res) => {
          if(res.data=="succeed"){
            this.tokenLogin(this.fixedUsername,null);
          }else{
            this.$message.error('账号或密码错误');
          }
        })
        .catch((err) => {
          this.$message.error('网络连接错误');
          console.log(err);
        })
      }
    },

    //验证码登陆
    handlePhoneLogin() {
      if(this.form.captcha==""){
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        });
        return;
      }else if(this.form.verify!=""){
        if(this.form.captcha==this.form.verify){
          this.tokenLogin(null,this.fixedPhone);
        }else{
          this.$message.error('验证码错误');
        }
      }else {
        this.$message({
          message: '未发送验证码',
          type: 'warning'
        });
      }
    },

    //获取验证码
    handleGetCaptcha() {
      if(this.isGet==false){
        return;
      }else{
        if(this.form.phone==''){
          this.$message({
            message: '请输入手机号',
            type: 'warning'
          });
          return;
        }else{
          this.fixedPhone = this.form.phone;
          this.$http.get('/upload/getCaptcha?phone='+this.form.phone+'&isVerify=1')
          .then((res) => {
            if(res.data=='failed'){
              this.$message({
                message: '手机号未注册',
                type: 'warning'
              });
            }else{
              this.form.verify = res.data;
              this.isGet = false;
              var time = 60;
              this.buttonValue = time + 's';
              var inter = setInterval(() => {
                if(time<0) {
                  this.isGet = true;
                  this.buttonValue = '获取验证码'
                  clearInterval(inter);
                }else {
                  time--;
                  this.buttonValue = time + 's';
                }
              }, 1000);
            }
          })
          .catch((err) => {
            this.$message.error('网络连接错误');
          })
        }
      }
    },

    //发送鉴权登录
    tokenLogin(username,phone){
      if(username){
        this.$http.get('/upload/registerToken?username='+username)
        .then((res)=>{
          let data = res.data;
          localStorage.setItem('lemon-token',data.msg);
          // console.log(data);
          this.setUserInfo(data.data.userid,data.data.username,data.data.headshot);
          this.$router.push('/index/home');
        })
        .catch((err)=>{
          this.$message.error('网络连接错误');
          console.log(err);
        });
      }
      if(phone){
        this.$http.get('/upload/registerToken?phone='+phone)
        .then((res)=>{
          let data = res.data
          localStorage.setItem('lemon-token',data.msg);
          this.setUserInfo(data.data.userid,data.data.username,data.data.headshot);
          this.$router.push('/index/home');
        })
        .catch((err)=>{
          this.$message.error('网络连接错误');
          console.log(err);
        });
      }
    },

    //进入登录页面尝试自动登录
    autoLogin(){
      let lemonToken = localStorage.getItem("lemon-token");
      if(lemonToken){
        this.$http.get('/upload/autoLogin?token='+lemonToken)
        .then((res)=>{
          let data = res.data;
          if(data.code==200 && data.msg=='userid'){
            console.log(data.data.headshot);
            this.setUserInfo(data.data.userid,data.data.username,data.data.headshot);
            this.$router.push('/index/home');
          }
          else{
            console.log('noUser');
          }
        })
        .catch((err)=>{
          this.$message.error('网络连接错误');
          console.log(err);
        });
      }
    },

    setUserInfo(userid,username,headshot){
      console.log(headshot);
      this.updateHeadShot('http://'+this.$ip+'/images/'+headshot);
      this.updateUsername(username);
      this.updateUserId(userid);
      this.setLogin(true);
    }
  }
}
</script>

<style>
@import '../style/pages/Login.css'

</style>