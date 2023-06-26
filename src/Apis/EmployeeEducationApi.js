import axios from "axios";

export const getEducationApi = async (id)=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/education/${id}`)
        return response;
    }
    catch (error){
        throw error;
    }
}

export const addEducation =async(data)=>{
    try{
        const response = await axios.post(
            ("https://d1h99yrv311co6.cloudfront.net/api/registry/employee/education"),
             data
          )
          return response;
    }   
    catch (error){
        throw error;
    }
}