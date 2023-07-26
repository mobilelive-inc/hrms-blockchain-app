import axios from "axios";

export const getFilesApi =async(urlencoded,myHeaders,tokenId)=>{
 
  try{
      const response =  axios
      .get(
        `https://d1h99yrv311co6.cloudfront.net/api/files/${tokenId}`,
        urlencoded.toString(),
        { headers: myHeaders }
      )
        return response;
    }
    catch(error){
        throw error;
    }
} 

export const postFileApi = async (formData,tokenId) => {
  
  try {
    const response = await axios.post(`https://d1h99yrv311co6.cloudfront.net/api/files/upload/${tokenId}`,formData    
    );  
    return response.data;
  } catch (error) {
    throw error;
  }
};
