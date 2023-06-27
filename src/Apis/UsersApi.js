import axios from "axios";

export const getUserApi = async (address)=>{
    try{
    const response = await axios.get(
        `https://d1h99yrv311co6.cloudfront.net/api/registry/user?userAddress=${address}`
        
      );
      return response;
    }
    catch(error){
        throw (error);
    }
}

export const createUser = async (data)=>{
    try{
        const response=axios.post(("https://d1h99yrv311co6.cloudfront.net/api/registry/user/create"),data)
        return response;
    }
    catch(error){
        throw error;
    }
}
export const updateUserApi = async (userAddress,data)=>{
    const url = `https://d1h99yrv311co6.cloudfront.net/api/registry/user?userAddress=${userAddress}`;
    try{
        const response = await axios.post(
            url, data        
          )
          return response;
        }
        catch(error){
            throw (error);
        }
}

