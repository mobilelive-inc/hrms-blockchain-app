import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Web3 from "web3";
import "react-toastify/dist/ReactToastify.css";
import MetaMaskGuide from "./MetaMaskGuide";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminPageCreate from "./pages/Admin/CreateUser";
import CreateProject from "./pages/Admin/CreateProject";
import ViewProjects from "./pages/Admin/ViewProjects";
import AllEmployees from "./pages/Admin/AllEmployees";
import EmployeePage from "./pages/Employee/Employee";
import UpdateProfile from "./pages/Employee/UpdateProfile";
import Navbar from "./components/Navbar";
import GetEmployee from "./pages/GetRoutes/GetEmployee";
import GetOrg from "./pages/GetRoutes/GetOrg";
import NoRole from "./pages/NoRole/NoRole";
import Notifications from "./pages/NoRole/Notifications";
import NotificationsEmployee from "./pages/Employee/Notifications";
import LoadComp from "./components/LoadComp";
import {isAdmin} from "./Apis/Admin";
import {getUserApi} from "./Apis/UsersApi";
// import AddResources from "./pages/Admin/AddResources";
// import AddResources from "./pages/Admin/AddResources";


function App() {
  const [isMeta, setisMeta] = useState(false);
  const [isEmployee, setisEmployee] = useState(false);
  const [account, setaccount] = useState("");
  // const [isOrganizationEndorser, setisOrganizationEndorser] = useState(false);
  const [isOwner, setisOwner] = useState(false);
  const [loadcomp, setloadcomp] = useState(false);
  const [isManager,setisManager] = useState(false);

  const loadBlockChainData = async () => {
    const web3 = await window.web3;
    // console.log(web3);
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      setaccount(accounts[0]);
      const checkAdmin = await isAdmin(accounts[0]);
      const userData = await getUserApi(accounts[0]);
      if(checkAdmin.data.response.isAdmin){
        setisOwner(true);
      }else if(!checkAdmin.data.response.isAdmin && userData.data.response.userInfo.tokenId !== 0){
        let role = userData.data.response.userInfo.role;
        if(role === 'employee'){
          setisEmployee(true);
        }
        else if (role==='pm'){
          setisManager(true);
        }
      }else{
        toast.error("User not found for given address!");
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = () => {
      window.location.href = '/'
    };
  
    const func = async () => {
      setisMeta(true);
      setloadcomp(true);
      if (window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        window.web3 = await new Web3(window.ethereum);
        await loadBlockChainData();
      } else if (window.web3) {
        window.web3 = await new Web3(window.web3.currentProvider);
        await loadBlockChainData();
      } else {
        setisMeta(false);
      }
      setloadcomp(false);
    };
  
    func();
  
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);
  
  const adminRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={AllEmployees} />
        {/* <Route
          path="/all-organization-endorser"
          exact
          component={AllOrganizationEndorser}
        /> */}
        <Route path="/create-user" exact component={AdminPageCreate} />
        <Route path="/create-project" exact component = {CreateProject}/>
        <Route path="/view-projects" exact component={ViewProjects}/>
        {/* <Route path="/notifications" exact component={NotificationsAdmin} /> */}
      </Switch>
    );
  };

  const managerRoutes = ()=>{
    console.log("in")
    return (
      <Switch>
        <Route path="/" exact component={CreateProject}/>
        <Route path="/view-projects" exact component={ViewProjects}/>
        {/* <Route path="/create-project" exact component={CreateProject}/> */}
      </Switch>
    )
  }
  const employeeRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={EmployeePage} />
        <Route path="/update-profile" exact component={UpdateProfile} />
        <Route path="/notifications" exact component={NotificationsEmployee} />
      </Switch>
    );
  };

  /* const isOrganizationEndorserRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Organization} />
        <Route path="/endorse-skill" exact component={EndorseSkill} />
        <Route path="/endorse-section" exact component={Endorse} />
        <Route path="/notifications" exact component={NotificationsOrg} />
      </Switch>
    );
  }; */

  const noRoleRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={NoRole} />
        <Route path="/notifications" exact component={Notifications} />
      </Switch>
    );
  };

  const renderRoutes = () => {
    if (isOwner) return adminRoutes();
    else if (isEmployee) return employeeRoutes();
    else if (isManager) return managerRoutes();
    // else if (isOrganizationEndorser) return isOrganizationEndorserRoutes();
    else return noRoleRoutes();
  };

  return (
    <div>
      {loadcomp ? (
        <LoadComp />
      ) : isMeta && account !== "" ? (
        <BrowserRouter>
          <Navbar />
          <Container>
            <ToastContainer />
            <Switch>
              <Route
                path="/getemployee/:employee_address"
                exact
                component={GetEmployee}
              />
              <Route path="/getOrg/:orgAddress" exact component={GetOrg} />
              {renderRoutes()}
            </Switch>
          </Container>
        </BrowserRouter>
      ) : (
        <MetaMaskGuide />
      )}
    </div>
  );
}

export default App;
