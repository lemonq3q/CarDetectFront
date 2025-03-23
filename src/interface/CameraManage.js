import {axios} from '@/main.js'
import { genUrl } from '@/util';

function getCameraData(camera){
    var url = genUrl('/camera',camera);
    return axios.get(url);
}

function addCameraData(camera){

    return axios.post('/camera',camera);
}

function deleteCameraData(id){
    return axios.delete('/camera?ids='+id)
}

export {getCameraData,addCameraData,deleteCameraData} 