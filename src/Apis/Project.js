import axios from "axios";

export const createProject = async (data)=>{
    try{
        const response=axios.post(("https://d1h99yrv311co6.cloudfront.net/api/registry/project/create"),data)
        return response;
    }
    catch(error){
        throw error;
    }
}

export const getProjects = async (id)=>{
    try{
        const response=axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/project/create/${id}`)
        return response;
    }
    catch(error){
        throw error;
    }
}