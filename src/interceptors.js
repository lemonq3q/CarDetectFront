import axios from 'axios' 
import router from './router/index'
import { Message } from 'element-ui';
import store from './store/index'

axios.interceptors.request.use(config=>{
    //获取到浏览器里面一直存储的token，并将它放到
    let lemonToken =  localStorage.getItem("lemon-token");
    if(lemonToken){
        config.headers['lemon-token']=lemonToken;
    }
    return config;
},error => {
    Promise.reject(error);
});


//2 使用axios设置后置拦截器，处理后台被拦截，没有登录的请求
axios.interceptors.response.use(result=>{
    //屎山，快跑
    //这里的返回类型不统一
    //对succeed和failed单独判断放行
    // console.log(result.data);
    if(typeof(result.data) =='string' && result.data!='succeed' && result.data!='failed' && result.data!='success'){
        var data = JSON.parse(result.data);
    }
    else{
        var data = result.data;
    }
    // console.log('code: '+data.code+','+'msg: '+data.msg);
    // console.log(typeof(data));
    //只要前台被拦截的请求里面含这两个参数，那么就跳转到登录界面
    if(data.code==400 && data.msg=="noUser"){
        console.log('noUser');
        store.state.isLogin = false;
        router.push('/login');
    }
    if(data.code==400 && data.msg=="timeout"){
        console.log('timeout');
        store.state.isLogin = false;
        router.push('/login');
        Message({
            message: '登录超时，请重新登录',
            type: 'warning'
        });
        return Promise.reject(result);
    }
    return result;
},error => {
    Promise.reject(error);
});

export default axios;