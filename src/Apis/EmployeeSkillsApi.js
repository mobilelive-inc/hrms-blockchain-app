import axios from "axios";

export const getSkillsApi = async (id)=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/skills/${id}`)
        return response;
    }
    catch (error){
        throw error;
    }
}