import axios from '@/main.js'

function api1(params){
    return axios.get('/user/getUserByPhone?phone='+params.xxxx) 
}

export {api1}
// get和delete拼进去axios.get('/user/getUserByPhone?phone='+params.xxxx) 
// post和put结构体直接放在后面axios.get('/user/getUserByPhone'，params) 