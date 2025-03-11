<template>
  <div class="user_body" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <el-dialog title="修改头像" :visible.sync="dialogVisible_img" top="5vh">
      <div class="user_img_top">
        <div class="user_img_top_left">
          <div class="user_img_top_left_body" id="user_img_body">
            <img :src="img_src" class="user_bottom_img"/>
            <div class="user_img_mask"></div>
            <div class="user_top_img_container" id="user_top_container" @mousedown="handleMouseDown">
              <img :src="img_src" class="user_top_img" id="user_top_img"/>
            </div>
          </div>
        </div>
        <div  class="user_img_top_right" >
          <img class="user_img_top_right_body":src="img_src" id="user_right_img">
        </div>
      </div>
      <p style="margin-bottom: 20px">请选择图片上传：支持JPG、PNG等格式</p>
      <el-button type="primary" @click="handleHeadshotUpdate">上传头像</el-button>
    </el-dialog>
    <!-- <h1>用户中心</h1> -->
    <div class="top" ref="user_top">
      <ul class="top_ui">
        <div class="user_img">
          <img :src="headshot_url" id="show" class="image-style" alt="">
          <label>
            <input id="file" class="user_imgbtn" @change="previewFile($event)" type="file"/>
            <span class="user_imgbtn_show">+</span>
          </label>
        </div>
        <div class="user_btn">
          <el-button plain class="btn_create" @click="dialogVisible_create = true">创建用户</el-button>
          <el-dialog title="创建用户" :visible.sync="dialogVisible_create" >
            <!-- <span>这是一段信息</span> -->
            <form id="dialogContentArea">
              昵称:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.username" style="width: 240px;"/><br/><br/>
              姓名:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.name" style="width: 240px;"/><br/><br/>
              密码:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.password" style="width: 240px;"/><br/><br/>
              性别:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.sex" style="width: 240px;"/><br/><br/>
              工厂:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.factory" style="width: 240px;"/><br/><br/>
              电话:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.phone" style="width: 240px;"/><br/><br/>
              ID号:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.userid" style="width: 240px;"/><br/><br/>
              住址:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="user_add_dialogData.useraddress" style="width: 240px;"/><br/><br/>
              权限:&nbsp;&nbsp;&nbsp;&nbsp;
              <el-select v-model="value1" multiple placeholder="请选择" size="medium">
                <el-option v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </form>
            <span slot="footer" class="dialog-footer_create">
              <el-button @click="dialogVisible_create = false">取 消</el-button>
              <el-button type="primary" @click="add_usermsg()">确 定</el-button>
            </span>
          </el-dialog>

          <el-button plain class="btn_edit" @click="dialogVisible_edit=true">编辑信息</el-button>
          <el-dialog title="编辑个人信息" :visible.sync="dialogVisible_edit" >
            <!-- <span>这是一段信息</span> -->
            <form id="dialogContentArea">
              昵称:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.username" style="width: 240px;"/><br/><br/>
              <!-- 姓名:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.name" style="width: 240px;"/><br/><br/> -->
              <!-- 性别:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.sex" style="width: 240px;"/><br/><br/> -->
              <!-- 工厂:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.factory" style="width: 240px;"/><br/><br/> -->
              电话:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.phone" style="width: 240px;"/><br/><br/>
              <!-- ID号:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.userid" style="width: 240px;"/><br/><br/> -->
              住址:&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="edit_user_allmsg.useraddress" style="width: 240px;"/><br/><br/>
              
            </form>
            <span slot="footer" class="dialog-footer_edit">
              <el-button @click="dialogVisible_edit=false">取消</el-button>
              <el-button type="primary" @click="edit_usermsg">确定</el-button>
            </span>
          </el-dialog>

          <el-button plain class="btn_updatepassword" @click="dialogVisible_idencode=true">更改密码</el-button>
          <el-dialog title="验证身份信息" :visible.sync="dialogVisible_idencode" >
            <div class="user_phoneauth">
              <span class="user_phoneauthtext">请输入手机号：</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <input class="user_phoneauthinput" v-model="phone">
              <el-button plain class="btn_getcode" :disabled="isCounting" @click="getcode">{{ isCounting ? (timeLeft + '秒后重新获取') : '获取验证码' }}</el-button>
            </div>
            <br/>
            <div class="user_code">
              <span class="user_codetext">请输入验证码：</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <input class="user_codeinput" v-model="input_code"/>
            </div>
            <span slot="footer" class="dialog-footer_updatepassword">
              <el-button @click="dialogVisible_edit=false">取消</el-button>
              <el-button type="primary" @click="ensure_code">确定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="修改密码" :visible.sync="dialogVisible_password">
            <span class="user_newpasswordtext">请输入新密码：</span>
            <input class="user_newpasswordinput" v-model="user_newpassword"/>
            <span slot="footer" class="dialog-footer_updatepassword">
            <el-button @click="dialogVisible_edit=false">取消</el-button>
            <el-button type="primary" @click="ensure_password">确定</el-button>
            </span>
          </el-dialog>

        </div>
        </ul>
    </div>

    <!-- <el-tag type="info">管理人员名单：</el-tag> -->
    <div class="user_ManageListtext_div">
      <el-button class="btn_user_ManageList" round style="text-align: center;" @click="isUser_ManageListVisible=true">管理人员名单</el-button>
    </div>
    <el-dialog
    title="管理人员名单"
    :visible.sync="isUser_ManageListVisible"
    @close="handleDialogClose">
    <el-table class="mainArea" :data="user_ManageLisContent" max-height="250px" stripe>
      <el-table-column align="center" prop="userid" label="用户ID" />
      <el-table-column align="center" prop="username" label="用户昵称" />
      <el-table-column align="center" prop="name" label="用户名"/>
      <el-table-column align="center" prop="phone" label="电话号码"/>
      <el-table-column align="center" prop="employee" label="区域管理">
        <template slot-scope="scope">
          <img v-if="scope.row.employee ==1"src="../assets/right_down.png" style="width: 10%;"/>
          <img v-else src="../assets/error_down.png" style="width: 10%;"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="device" label="摄像头管理" width="120px">
        <template slot-scope="scope">
          <img v-if="scope.row.device ==1"src="../assets/right_down.png" style="width: 10%;"/>
          <img v-else src="../assets/error_down.png" style="width: 10%;"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="model" label="记录管理">
        <template slot-scope="scope">
          <img v-if="scope.row.model ==1"src="../assets/right_down.png" style="width: 10%;"/>
          <img v-else src="../assets/error_down.png" style="width: 10%;"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="risk" label="模型管理">
        <template slot-scope="scope">
          <img v-if="scope.row.risk ==1"src="../assets/right_down.png" style="width: 10%;"/>
          <img v-else src="../assets/error_down.png" style="width: 10%;"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="inspect" label="离线检测">
        <template slot-scope="scope">
          <img v-if="scope.row.inspect ==1"src="../assets/right_down.png" style="width: 10%;"/>
          <img v-else src="../assets/error_down.png" style="width: 10%;"/>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isUser_ManageListVisible = false">取 消</el-button>
    </span>
    </el-dialog>

    <div class="user_main_body">
      <div class="perform_title"></div>
      <div class="user_middle">
        <div class="user_msg_body">
        <!-- <div class="perform_body"> -->
          <div class="user_nichengbody">
          <div class="user_name_inputtext">详细信息</div>
            <!-- <input  class="user_name_input"  v-model="user_allmsg.username" placeholder="user_name" disabled="disabled" /> -->
          </div>
          <div class="user_other_msg">
            <div class="user_nameandsex">
              <div class="user_namebody">
                <div class="user_nametext">姓名： </div>
                <div  class="user_nameinput">
                  <input class="user_nameinputbody" v-model="user_allmsg.name" placeholder="name" disabled="disabled"/>
                </div>
              </div>
              <div class="user_sexbody">
                <div class="user_sextext"> 性别：</div>
                <div class="user_sexinput">
                  <input  class="user_sexinputbody"  v-model="user_allmsg.sex" placeholder="sex" disabled="disabled"/>
                </div>
              </div>
            </div>
            <div class="user_facandphone">
              <div class="user_facbody">
                <div class="user_factext">工厂：</div>
                <div  class="user_facinput">
                  <input class="user_facinputbody" v-model="user_allmsg.factory" placeholder="fac" disabled="disabled"/>
                </div>
              
              </div>
              <div class="user_phonebody">
                <div class="user_phonetext"> 电话：</div>
                <div class="user_phoneinput">
                  <input  class="user_phoneinputbody"  v-model="user_allmsg.phone" placeholder="phone" disabled="disabled"/>
                </div>
              </div>
            </div>
            <div class="user_idandaddr">
              <div class="user_idbody">
                <div class="user_idtext">ID号：</div>
                <div  class="user_idinput">
                  <input class="user_idinputbody" v-model="user_allmsg.userid" placeholder="id" disabled="disabled"/>
                </div>
              </div>
              <div class="user_addrbody">
                <div class="user_addrtext"> 住址：</div>
                <div class="user_addrinput">
                  <input  class="user_addrinputbody"  v-model="user_allmsg.useraddress" placeholder="addr" disabled="disabled"/>
                </div>
              </div>
            </div>
            <br/>
            <br/>
          </div>
        <!-- </div> -->
        </div>
        <div class="user_auth">
        <el-table :data="user_power_tabledata">
          <el-table-column type="index" width="50" height="70px" />
          <el-table-column property="power_name" label="权限名" height="70px" />
          <el-table-column prop="power_limit" height="70px">
            <!-- <template slot-scope="scope">
              <img v-if="scope.row.power_limit==='允许'" src="../assets/right.png" style="width: 20%;">
              <img v-else src="../assets/error.png"/>
            </template> -->
          </el-table-column>
        </el-table>
        </div>
      </div>
    </div>



  </div>
  
</template>



<script>


import { mapState,mapMutations } from 'vuex';
import {ref} from 'vue'
// import axios from 'axios';

export default {
  name: "User",

  computed: {
    ...mapState([
      'path','userheadshot','username','root','userId'
    ]),
  },
  
  data:function(){
    return{
      loading: null,
      anglePosition: 1,
      isImgContainerMove: false,
      imgContainerOWidth: 0,
      imgContainerOHeight: 0,
      mouseOx: 0,
      mouseOy: 0,
      imgContainerOx: 0,
      imgContainerOy: 0,
      isMouseDown: false,
      phone:'',
      // 初始化倒计时时间（秒为单位）
      timeLeft: 60,
      // 标记是否正在倒计时
      isCounting: false,
      //验证码
      iden_code:'',
      //用户输入的验证码
      input_code:'',
      //更改密码界面
      dialogVisible_password:false,
      //用户输入的新密码
      user_newpassword:'',
      //用户管理人员名单
      user_ManageLisContent:[],
      //权限
      options: [{
          value: '1',
          label: '员工管理'
        }, {
          value: '2',
          label: '设备管理'
        }, {
          value: '3',
          label: '模型管理'
        }, {
          value: '4',
          label: '风险管理'
        }, {
          value: '5',
          label: '巡检管理'
      }],
      value1: [],
      //权限表格内容
      user_power_tabledata:[{
        power_name:'区域管理',
        power_limit:'禁止'
      },{
        power_name:'摄像头管理',
        power_limit:'禁止'
      },{
        power_name:'记录管理',
        power_limit:'禁止'
      },{
        power_name:'模型管理',
        power_limit:'禁止'
      },{
        power_name:'离线检测',
        power_limit:'禁止'
      }],


      headshot_url: '',
      dialogVisible_create:false,
      dialogVisible_edit:false,
      dialogVisible_idencode:false,
      dialogVisible_img:false,
      isUser_ManageListVisible:false,
      img_src:'',
      user_msglist:'',
      resultList:{},
      user_allmsg:{},
      edit_user_allmsg:{},
      value_init:{},
      user_add_dialogData: {
      'username': '',
      'name': '',
      'password':'',
      'sex': '',
      'factory': '',
      'phone': '',
      'userid': '',
      'useraddress': '',
    },
    user_eidt_dialogData:{}
    }
  },

  mounted(){
    this.updateRoot('用户中心');
    this.updatePath('');
    this.get_usermsg();
    this.get_user_ManageList();
  },

  methods:{
    ...mapMutations([
      'updatePath','updateRoot','updateHeadShot'
    ]),
    get_usermsg(){
        this.$http.get(`/fyy/getusermsgbyuserid?id=${this.$store.state.userId}`).then((response)=> {
        this.resultList=response.data;
        // console.log(this.resultList);
        // console.log(response.data)
        this.user_allmsg=this.resultList;
        this.headshot_url="http://"+this.$ip+'/images/'+this.user_allmsg.headshot;
        const user_top = this.$refs.user_top;
        user_top.style.backgroundImage = 'url("'+this.headshot_url+'")';
        // console.log(this.user_allmsg.username);
        this.edit_user_allmsg=this.resultList;
        this.user_power_tabledata[0].power_limit=this.resultList.employee==1?'允许':'禁止';
        this.user_power_tabledata[1].power_limit=this.resultList.device==1?'允许':'禁止';
        this.user_power_tabledata[2].power_limit=this.resultList.model==1?'允许':'禁止';
        this.user_power_tabledata[3].power_limit=this.resultList.risk==1?'允许':'禁止';
        this.user_power_tabledata[4].power_limit=this.resultList.inspect==1?'允许':'禁止';
        // if(this.resultList.employee==1){
        //   this.user_power_tabledata[0].power_limit='允许';
        // }
        // if(this.resultList.device==1){
        //   this.user_power_tabledata[1].power_limit='允许';
        // }
        // if(this.resultList.model==1){
        //   this.user_power_tabledata[2].power_limit='允许';
        // }
        // if(this.resultList.risk==1){
        //   this.user_power_tabledata[3].power_limit='允许';
        // }
        // if(this.resultList.inspect==1){
        //   this.user_power_tabledata[4].power_limit='允许';
        // }
        // console.log(this.user_power_tabledata)
      }).catch((e)=>{
        console.log(e)
        alert("网页出现了未知错误，请联系管理员！");
      })
      // var resultList = {'username':'gr'}
      // this.user_username=resultList.username;
    },

    get_user_ManageList(){
      this.$http.get(`/fyy/getadmmsg?id=${this.$store.state.userId}`).then((response)=> {
        this.user_ManageLisContent=response.data;
      });
    },
    previewFile(){
      // this.headshot_url = URL.createObjectURL(e.target.files[0]);
      // const preview =document.querySelector("#show");
      const file=document.querySelector("#file").files[0];
      this.img_src=URL.createObjectURL(file);
      this.dialogVisible_img=true;
      document.querySelector("#file").value = '';
      console.log(this.dialogVisible_img);
      setTimeout(()=>{
        var img=new Image();
        img.onload = ()=>{
          var img_height = 400;
          var img_width = 400;
          // console.log(img.width,img.height);
          if(img.width>img.height){
            img_height = img.height/img.width*400;
          }
          else{
            img_width = img.width/img.height*400;
          }
          const user_img_top_body = document.getElementById('user_img_body');
          const user_top_img_container = document.getElementById('user_top_container');
          const user_top_img = document.getElementById('user_top_img');
          // console.log(img_width,img_height);
          //动态调整大小
          user_img_top_body.style.width = img_width + 'px';
          user_img_top_body.style.height = img_height + 'px';

          var len = img_width<img_height?img_width*0.7:img_height*0.7;
          user_top_img_container.style.width = len + 'px';
          user_top_img_container.style.height = len + 'px';

          user_top_img.style.width = img_width + 'px';
          user_top_img.style.height = img_height + 'px';

          //使盒子水平垂直居中
          user_top_img_container.style.top = (img_height - len)/2 + 'px';
          user_top_img_container.style.left = (img_width - len)/2 + 'px';
          //使最顶层图片固定位置
          user_top_img.style.top = -(img_height - len)/2-2 + 'px';
          user_top_img.style.left = -(img_width - len)/2-2 + 'px';

          this.adaptRightImg();
        }
        img.src=this.img_src;
      },100);
      

    },

    add_usermsg(){

      var user = {
        'username':this.user_add_dialogData.username,
        'name':this.user_add_dialogData.name,
        'password':this.user_add_dialogData.password,
        'sex':this.user_add_dialogData.sex,
        'factory':this.user_add_dialogData.factory,
        'phone':this.user_add_dialogData.phone,
        'userid':this.user_add_dialogData.userid,
        'useraddress':this.user_add_dialogData.useraddress,
        'employee':0,
        'device':0,
        'model':0,
        'risk':0,
        'inspect':0,
        'managerid':this.user_allmsg.userid
      }
      for(var i=0;i<this.value1.length;i++){
        if(this.value1[i]==1){
          user.employee=1;
        }
        else if(this.value1[i]==2){
          user.device=1;
        }
        else if(this.value1[i]==3){
          user.model=1;
        }
        else if(this.value1[i]==4){
          user.risk=1;
        }
        else if(this.value1[i]==5){
          user.inspect=1;
        }
      }
      // console.log(user)
      this.$http.post("/fyy/insertusermsg",user)
      .then(res=>{
        // console.log('添加用户成功', res);
        alert("添加用户成功")
        this.dialogVisible_create = false
        // this.user_add_dialogData=''
      })
      .catch(err=>{
        console.log('请求失败', err);
      });
    },
    edit_usermsg(){
      var updateuser = {
        'userid':this.user_allmsg.userid,
        'username':this.edit_user_allmsg.username,
        // 'name':this.edit_user_allmsg.name,
        // 'sex':this.edit_user_allmsg.sex,
        // 'factory':this.edit_user_allmsg.factory,
        'phone':this.edit_user_allmsg.phone,
        'useraddress':this.edit_user_allmsg.useraddress
      }
      // console.log(updateuser)
      this.$http.post("/fyy/updateusermsg",updateuser)
      .then(res=>{
        // console.log('修改成功', res);
        alert("修改用户成功")
        this.dialogVisible_edit = false
        // this.user_eidt_dialogData=''
      })
      .catch(err=>{
        // console.log(e)
        console.log('请求失败', err);
      });
      // axios.get('/fyy/updateusermsg',this.edit_user_allmsg.toString()
      // ).then(res=>{
      //   console.log('请求成功', res);
      // })
      // .catch(err=>{
      //   console.log('请求失败', err);
      // });
      // dialogVisible_edit = false
    },
    getcode(){
      //开始倒数
      if (!this.isCounting) {
        this.isCounting = true; // 开始倒计时
        let timer = setInterval(() => {
          if (this.timeLeft > 0) {
            // 倒计时递减
            this.timeLeft--;
          } else {
            // 倒计时结束，重置状态
            clearInterval(timer); // 清除定时器
            this.timeLeft = 60; // 重置倒计时时间
            this.isCounting = false; // 倒计时结束
          }
        }, 1000);
      }
      //向服务器发送输入的电话号码
      this.$http.get(`/fyy/captcha?phone=`+this.phone+`&id=`+this.user_allmsg.userid).then((response)=> {
        // console.log(this.phone)
        // console.log(this.user_allmsg.userid)
        if(response.data==0){
          //如果没有电话，弹窗提示
          alert("手机号错误！")
        }
        else{
          //如果有电话，接收服务器送的验证码
          this.iden_code=response+'';
          // console.log(response)
          // console.log(this.iden_code)
        }
      }).catch((e)=>{
        // console.log(e)
        alert("获取验证码失败");
      })
    },
    ensure_code(){
      // 判断验证码是否输入正确
      if(this.input_code==this.iden_code.data){
      //正确后调用下一个对话框
        this.dialogVisible_idencode=false
        this.dialogVisible_password=true
        // this.$http.get(`/`)
      }
      else{
        // console.log(1)
        // console.log(this.input_code)
        alert("验证码输入错误")
      }
    },
    ensure_password(){
      //下一个对话框输入新密码发送给服务器，接收服务器的返回值进行相应的弹窗
      this.$http.get('fyy/updatepassword?id='+this.user_allmsg.userid+'&password='+this.user_newpassword).then((response)=>{
        // console.log(this.user_newpassword)
        // console.log(response)
        alert("修改密码成功")
        this.dialogVisible_password=false
      }).catch((e)=>{
        console.log(e)
        alert("服务器连接错误")
      })
    },
    handleMouseDown(e){
      e.preventDefault();
      //设置鼠标参数
      this.isMouseDown = true;
      this.mouseOx = e.x;
      this.mouseOy = e.y;

      //设置盒子原点信息
      const user_top_img_container = document.getElementById('user_top_container'); 
      const user_img_top_body = document.getElementById('user_img_body');
      var imgContainerRect = user_top_img_container.getBoundingClientRect();
      var bodyRect = user_img_top_body.getBoundingClientRect();
      this.imgContainerOx = imgContainerRect.x - bodyRect.x;
      this.imgContainerOy = imgContainerRect.y - bodyRect.y;
      this.imgContainerOWidth = imgContainerRect.width;
      this.imgContainerOHeight = imgContainerRect.height;

      //判断移动还是缩放
      var mouseRelativeX = e.x - imgContainerRect.x;
      var mouseRelativeY = e.y - imgContainerRect.y;

      var r = 20;

      if(Math.sqrt(mouseRelativeX**2+mouseRelativeY**2)<r){
        this.anglePosition = 1;
        this.isImgContainerMove = false;
        return;
      }

      if(Math.sqrt((mouseRelativeX-imgContainerRect.width)**2+mouseRelativeY**2)<r){
        this.anglePosition = 2;
        this.isImgContainerMove = false;
        return;
      }

      if(Math.sqrt(mouseRelativeX**2+(mouseRelativeY-imgContainerRect.height)**2)<r){
        this.anglePosition = 3;
        this.isImgContainerMove = false;
        return;
      }

      if(Math.sqrt((mouseRelativeX-imgContainerRect.width)**2+(mouseRelativeY-imgContainerRect.height)**2)<r){
        this.anglePosition = 4;
        this.isImgContainerMove = false;
        return;
      }

      this.isImgContainerMove = true;
    },
    handleMouseMove(e){
      e.preventDefault();
      if(!this.isMouseDown){
        return;
      }
      if(this.isImgContainerMove){
        this.imgContainerMove(e);
        this.adaptRightImg();
      }
      else{
        this.imgContainerScale(e);
        this.adaptRightImg();
      }
    },

    imgContainerMove(e){
      var move_x = e.x - this.mouseOx;
      var move_y = e.y - this.mouseOy;
      const user_img_top_body = document.getElementById('user_img_body');
      const user_top_img_container = document.getElementById('user_top_container'); 
      const user_top_img = document.getElementById('user_top_img');

      const bodyRect = user_img_top_body.getBoundingClientRect();
      const imgContainerRect = user_top_img_container.getBoundingClientRect();
      //
      var now_x = this.imgContainerOx + move_x;
      var now_y = this.imgContainerOy + move_y;
      //防止盒子超出范围
      now_x = now_x>=0?now_x:0;
      now_y = now_y>=0?now_y:0;

      now_x = now_x<=bodyRect.width-imgContainerRect.width?now_x:bodyRect.width-imgContainerRect.width;
      now_y = now_y<=bodyRect.height-imgContainerRect.height?now_y:bodyRect.height-imgContainerRect.height;
      //设置盒子位置
      user_top_img_container.style.left = now_x + 'px';
      user_top_img_container.style.top = now_y + 'px';

      user_top_img.style.left = -now_x-2 + 'px';
      user_top_img.style.top = -now_y-2 + 'px';
    },

    imgContainerScale(e){
      var imgBody = document.getElementById('user_img_body');
      var imgContainer = document.getElementById('user_top_container');
      const imgBodyRect = imgBody.getBoundingClientRect();
      const user_top_img = document.getElementById('user_top_img');
      var move_x = e.x - this.mouseOx;
      var move_y = e.y - this.mouseOy;
      var x0 = this.imgContainerOx;
      var y0 = this.imgContainerOy;
      var x1,y1,x2,y2;

      if(this.anglePosition==1){
        x2 = x0;
        y2 = y0;
        x1 = x0 + this.imgContainerOWidth;
        y1 = y0 + this.imgContainerOWidth;
      }
      else if(this.anglePosition==2){
        x2 = x0 + this.imgContainerOWidth;
        y2 = y0;
        x1 = x0;
        y1 = y0 + this.imgContainerOWidth;
      }
      else if(this.anglePosition==3){
        x2 = x0;
        y2 = y0 + this.imgContainerOWidth;
        x1 = x0 + this.imgContainerOWidth;
        y1 = y0;
      }
      else if(this.anglePosition==4){
        x2 = x0 + this.imgContainerOWidth;
        y2 = y0 + this.imgContainerOWidth;
        x1 = x0;
        y1 = y0;
      }

      var ex = (x2+move_x-x1)!=0?(x2+move_x-x1)/Math.abs(x2+move_x-x1):0;
      var ey = (y2+move_y-y1)!=0?(y2+move_y-y1)/Math.abs(y2+move_y-y1):0;

      var len = Math.min(Math.abs(x2+move_x-x1),Math.abs(y2+move_y-y1));
      var x3 = x1+len*ex;
      var y3 = y1+len*ey;
      //溢出判断
      var overFlowX = 0;
      var overFlowY = 0;
      if(x3<0){
        overFlowX = -x3;
      }
      else if(x3>imgBodyRect.width){
        overFlowX = x3 - imgBodyRect.width;
      }
      if(y3<0){
        overFlowY = -y3;
      }
      else if(y3>imgBodyRect.height){
        overFlowY = y3 - imgBodyRect.height;
      }
      var maxOverFlow = Math.max(overFlowX,overFlowY);
      console.log(x3 - imgBodyRect.width,y3 - imgBodyRect.height);
      x3 = x3 + -ex*maxOverFlow;
      y3 = y3 + -ey*maxOverFlow;
      len -= maxOverFlow;
      x0 = Math.min(x1,x3);
      y0 = Math.min(y1,y3);

      //设置盒子
      imgContainer.style.width = len + 'px';
      imgContainer.style.height = len + 'px';
      imgContainer.style.left = x0 + 'px';
      imgContainer.style.top = y0 + 'px';
      user_top_img.style.left = -x0-2 + 'px';
      user_top_img.style.top = -y0-2 + 'px';
    },

    //右边图像初始化
    adaptRightImg(){
      const imgBodyRect = document.getElementById('user_img_body').getBoundingClientRect();
      const imgContainerRect = document.getElementById('user_top_container').getBoundingClientRect();
      var img_width = imgBodyRect.width;
      var img_height = imgBodyRect.height;
      var len = imgContainerRect.width;
      var imgContainerTop = imgContainerRect.y - imgBodyRect.y;
      var imgContainerLeft = imgContainerRect.x - imgBodyRect.x;
      const user_right_img = document.getElementById('user_right_img');
      var rightImgWidth = 200*img_width/len;
      var rightImgHeight = 200*img_width/len/img_width*img_height;
      user_right_img.style.width = rightImgWidth + 'px';
      user_right_img.style.height = rightImgHeight + 'px';
      
      user_right_img.style.top = -imgContainerTop/img_height*rightImgHeight + 'px';
      user_right_img.style.left = -imgContainerLeft/img_width*rightImgWidth + 'px';
    },

    handleMouseUp(e){
      e.preventDefault();
      this.isMouseDown = false;
    },

    //上传头像
    handleHeadshotUpdate(){
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
      fetch(this.img_src)
      .then(res=>res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('file',blob);
        const img = new Image();
        img.onload = ()=>{
          const imgBodyRect = document.getElementById('user_img_body').getBoundingClientRect();
          const imgContainerRect = document.getElementById('user_top_container').getBoundingClientRect();
          var x = (imgContainerRect.x - imgBodyRect.x)/imgBodyRect.width*img.width;
          var y = (imgContainerRect.y - imgBodyRect.y)/imgBodyRect.width*img.width;
          var len = imgContainerRect.width/imgBodyRect.width*img.width;
          this.$http.post('/file/headshot?x='+Math.round(x)+'&y='+Math.round(y)+'&width='+Math.round(len)+'&height='+Math.round(len)+'&userid='+this.userId,formData)
          .then(res=>{
            this.loading.close();
            let data = res.data;
            if(data.code==200 && data.msg=='success'){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.headshot_url = 'http://'+this.$ip+'/images/'+data.data;
              this.updateHeadShot(this.headshot_url);
              const user_top = this.$refs.user_top;
              user_top.style.backgroundImage = 'url("'+this.headshot_url+'")';
            }
            else{
              console.log(data);
              this.$message.error('上传失败');
            }
          })
          .catch(err=>{
            this.loading.close();
            console.log(err);
            this.$message.error('上传失败');
          });
        }
        img.src = this.img_src;
      })
    }
  }
}


</script>

<style>
/* #dialogContentArea{width: 100%; text-align: center; padding: 20px 0px;} */
@import '../style/components/user.css'
</style>