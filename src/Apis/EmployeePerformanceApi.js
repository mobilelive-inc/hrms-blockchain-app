import axios from "axios";

export const getPerformanceApi = async ()=>{    
    try{
        const response = await axios.get((`https://d1h99yrv311co6.cloudfront.net/mlml/v11/recommend?expt=backend&tool=php`))
        return response; 
    }
    catch(error){
        throw error;
    }
}