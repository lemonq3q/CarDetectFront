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

function updateAreaData(param){
    return axios.post('/area',param);
}

function getModelData(){
    return axios.get('/detectType?pageNum='+ 1 +'&pageSize=' + 9999);
}

function uploadPic(filename,param){
    return axios.post('/area/pic?filename='+filename,param)
}



export {getAreaData ,getModelData ,addAreaData ,deleteAreaData ,uploadPic ,updateAreaData} 