import axios from "axios";

export const getCertificatesApi = async (id)=>{
    try{
        const response = axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/certifications/${id}`)
        return response;
    }
    catch (error){
        throw error;
    }
}

export const updateCertificationApi= async (data,tokenId)=>{
    try{
        const response = await axios.put((`https://d1h99yrv311co6.cloudfront.net/api/registry/employee/certifications/${tokenId}`),data)
        return response;
    }
    catch(error){

    }
}
export const addCertificationApi = async (data)=>{
    try {   
        const response = await axios.post(("https://d1h99yrv311co6.cloudfront.net/api/registry/employee/certifications"),
        data)
        return response;
    }
    catch (error) {
        throw error;
    }
}