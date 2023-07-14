import axios from "axios";

export const getPerformanceApi = async ()=>{    
    try{
        const response = await axios.get((`https://d1h99yrv311co6.cloudfront.net/mlml/v11/getAll`))
        return response; 
    }
    catch(error){
        throw error;
    }
}

export const employeePerformanceApi = async (email)=>{
    email="Viktor.bilyk@hotmail.com";    
    try{
        const response = await axios.get((`https://d1h99yrv311co6.cloudfront.net/mlml/v11/getScoreByEmail?em=${email}`))
        return response; 
    }
    catch(error){
        throw error;
    }
}