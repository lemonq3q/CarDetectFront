import {axios} from '@/main.js'
import { genUrl } from '@/util';


function getAreaData(area){
    var url = genUrl('/area',area);
    return axios.get(url);
}

function addAreaData(area){

    return axios.put('/area',area);
}

function deleteAreaData(id){
    return axios.delete('/area?ids='+id);
}

// function deleteAreaData(idsToDelete){
//     const idsParam = idsToDelete.map(id => encodeURIComponent(id.toString())).join(',');

//     // 拼接请求 URL
//     const url = `/area?ids=${idsParam}`;
//     return axios(url);
// }

function getModelData(){
    return axios.get('/detectType?pageNum='+ 1 +'&pageSize=' + 9999);
}

function uploadPic(filename,param){
    return axios.post('/area/pic?filename='+filename,param)
}



export {getAreaData,getModelData,addAreaData,deleteAreaData,uploadPic} 