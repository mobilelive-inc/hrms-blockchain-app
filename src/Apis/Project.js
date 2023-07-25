import axios from "axios";

export const createProject = async (data)=>{
    try{
        const response=axios.post(("https://d1h99yrv311co6.cloudfront.net/api/registry/project/create"),data)
        return response;
    }
    catch(error){
        throw error;
    }
}

export const getProjects = async (id)=>{
    try{
        const response=axios.get(`https://d1h99yrv311co6.cloudfront.net/api/registry/project/create/${id}`)
        return response;
    }
    catch(error){
        throw error;
    }
}

export const addResource = async (data) => {
    try {
      const response = await axios.post(
        "https://d1h99yrv311co6.cloudfront.net/api/registry/project/add/resource",
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
export const deleteResource = async (data,resource_index)=>{
  try {
    const response = await axios.delete(
      `https://d1h99yrv311co6.cloudfront.net/api/registry/project/resources/${resource_index}`,
      {
        data:data
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
export const getAllResources = async(id)=>{
  try {
    const response = await axios.get(
      `https://d1h99yrv311co6.cloudfront.net/api/registry/project/resources/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}