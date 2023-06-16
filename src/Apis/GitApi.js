import axios from "axios";

export const getGitOrganizationApi = async ()=> {
    
    try{
    const response=await axios
        .get(
          "https://d1h99yrv311co6.cloudfront.net/api/github/user/organizations"
        )
        return response;
    }
    catch(error){
        throw error;
    }
}

export const getGitRepos = async (organization)=>{

    try{
       const response= axios
        .get(
          `https://d1h99yrv311co6.cloudfront.net/api/github/organization/repos?orgName=${organization}`
        )
        return response;
    }
    catch (error){
        throw error;
    }

}

export const getGitCommits = async (organization,name)=>{
    try{
        const response=axios.get(
        `https://d1h99yrv311co6.cloudfront.net/api/github/repo/commits?user=${organization}&repoName=${name}`        
        )
        return response;
    }
    catch(error){
        throw error;
    }
}


 