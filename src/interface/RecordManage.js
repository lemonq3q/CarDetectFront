import {axios} from '@/main.js'
import { genUrl } from '@/util';


function getRecordData(record){
    var url = genUrl('/record',record);
    return axios.get(url);
}

function addRecordData(record){

    return axios.put('/record',record);
}

function deleteRecordData(id){
    return axios.delete('/record?ids='+id);
}

function updateRecordData(param){
    return axios.post('/record',param);
}




export {getRecordData ,addRecordData ,updateRecordData ,deleteRecordData } 