import React from "react";
import Login from "./SystemAdmin/Login";
import { Route, Switch, HashRouter } from "react-router-dom";

import SideBar from "./SystemAdmin/SideBar";
import Header from "./SystemAdmin/Header";
import Systemusers from "./SystemAdmin/Systemusers";
import Dashboard from "./SystemAdmin/Dashboard";

import UserGroups from "./SystemAdmin/UserGroups";
import Branches from "./SystemAdmin/Branches";
import Companies from "./SystemAdmin/Companies";
import BranchAccess from "./SystemAdmin/BranchAccess";
import Audittrails from "./SystemAdmin/Audittrails";
import Profile from "./SystemAdmin/Profile";
import Logout from "./SystemAdmin/Logout";
// Patient management
import Patient from "./PatientManagement/Patient"
import PatientAttendance from "./PatientManagement/PatientAttendance"

//SetIps
import Fees from "./SetUps/Fees"
import PaymentModes from "./SetUps/PaymentModes"
import ItemCategories from "./SetUps/ItemCategories"
import Suppliers from "./SetUps/Suppliers"
import Items from "./SetUps/Items"
import Patientactions from "./SetUps/Patientactions"
import Departments from "./SetUps/Departments"
import Departmentaccess from "./SetUps/Departmentaccess"

//Inventory
import Requisitions from "./Inventory/Requisitions"
import RequisitionsApproval from "./Inventory/RequisitionsApproval"
import InventoryReceipt from "./Inventory/InventoryReceipt"
import InventoryAdjustment from "./Inventory/InventoryAdjustment"
import StockList from "./Inventory/StockList"

function App() {
  let token = localStorage.getItem("xtoken");
  if (token) {
    return (
      <div id="wrapper">
        <HashRouter>
          <SideBar />
          <Header>
            <Switch>
              <Route path="/" exact component={Systemusers} />
              <Route path="/Home" exact component={Dashboard} />
              
              <Route path="/Systemusers" exact component={Systemusers} />
              <Route path="/SecurityGroups" exact component={UserGroups} />
              <Route path="/Branches" exact component={Branches} />
              <Route path="/Companies" exact component={Companies} />
              <Route path="/BranchAccess" exact component={BranchAccess} />
              <Route path="/Audittrails" exact component={Audittrails} />
              <Route path="/Profile" exact component={Profile} />
              <Route path="/Patient" exact component={Patient} />
              <Route path="/Fees" exact component={Fees} />
              <Route path="/PaymentModes" exact component={PaymentModes} />
              <Route path="/ItemCategories" exact component={ItemCategories} />
              <Route path="/Suppliers" exact component={Suppliers} />
              <Route path="/Patientactions" exact component={Patientactions} />
              <Route path="/Departments" exact component={Departments} />
              <Route path="/Departmentaccess" exact component={Departmentaccess} />
              <Route path="/PatientAttendance" exact component={PatientAttendance} />
              
              <Route path="/Items" exact component={Items} />    
              <Route path="/Requisitions" exact component={Requisitions} />    
              <Route path="/RequisitionsApproval" exact component={RequisitionsApproval} />   
              <Route path="/InventoryReceipt" exact component={InventoryReceipt} />   
              <Route path="/InventoryAdjustment" exact component={InventoryAdjustment} />   
              <Route path="/StockList" exact component={StockList} /> 
              <Route path="/Logout" exact component={Logout} />    
              
            </Switch>
          </Header>
        </HashRouter>
      </div>
    );
  } else {
    return (
      <div id="wrapper">
        <HashRouter>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/Logout" exact component={Logout} />   
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
