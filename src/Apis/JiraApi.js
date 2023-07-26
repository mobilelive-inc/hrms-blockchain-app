import axios from "axios";

const getJiraApi = async (name)=>{
    try{
    const response = await axios.get(
        "https://d1h99yrv311co6.cloudfront.net/api/jira/issues",
        {
          params: {
            userName: name,
          },
        }
      );
      return response;
    }
    catch(error){
        throw (error);
    }
}

export default getJiraApi;