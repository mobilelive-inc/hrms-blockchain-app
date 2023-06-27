import axios from "axios";

export const isAdmin = async (address)=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/user?userAddress=${address}`)
        return response;
    }
    catch (error){
        throw error;
    }
}

export const getAllUsers = async ()=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/user/all`)
        return response;
    }
    catch (error){
        throw error;
    }
}