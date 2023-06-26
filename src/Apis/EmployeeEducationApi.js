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

export const addEducation =async(userAddress,data)=>{

    try{
        const response = await axios.post(
            (`http://localhost:4000/api/registry/employee/education/${userAddress}`), data
            
          )
          return response;
    }   
    catch (error){
        throw error;
    }
}