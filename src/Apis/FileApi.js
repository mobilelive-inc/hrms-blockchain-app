import axios from "axios";

export const getFilesApi =async(urlencoded,myHeaders)=>{
 
  try{
      const response =  axios
      .post(
        "https://d1h99yrv311co6.cloudfront.net/api/files/files",
        urlencoded.toString(),
        { headers: myHeaders }
      )
        return response;
    }
    catch(error){
        throw error;
    }
} 

export const postFileApi = async (formData) => {
  
  try {
    const response = await axios.post("https://d1h99yrv311co6.cloudfront.net/api/files/upload",formData    
    );  
    return response.data;
  } catch (error) {
    throw error;
  }
};
