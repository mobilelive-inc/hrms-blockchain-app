import axios from "axios";

export const getWorkExperienceApi = async (id)=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/work/${id}`)
        return response;
    }
    catch (error){
        throw error;
    }
}


export const updateExperienceApi = async (data,tokenId)=>{
    try{
        const response = await axios.put((`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/work/${tokenId}`),data)
        return response; 
    }
    catch(error){
        throw error;
    }
}

export const addExperienceApi =async(data)=>{
    try{
        const response = axios.post((`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/work`),data)
        return response;
    }
    catch (error){
        throw error;
    }
}