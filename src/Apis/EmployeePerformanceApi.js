import axios from "axios";

export const getPerformanceApi = async ()=>{    
    try{
        const response = await axios.get((`http://35.182.242.14/mlml/v11/recommend?expt=backend&tool=php`))
        return response; 
    }
    catch(error){
        throw error;
    }
}