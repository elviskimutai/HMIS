import React, { Component } from "react";
import swal from "sweetalert";
import Table from "./../SystemAdmin/Table";
import TableWrapper from "./../SystemAdmin/TableWrapper";
import Modal from "react-awesome-modal";
var dateFormat = require('dateformat');
var moment = require('moment');
var _ = require("lodash");
class PatientAttendance extends Component {
  constructor() {
    super();
    this.state = {
      Users: [],    
      privilages: [],     
      openView: false,
      OnePatientAttendance: [] ,
      PatientAttendance:[],     
      Timestamp:Date().toLocaleString(),
      PatientName:""
     
   
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  
  }
 
  ProtectRoute() {
    fetch("/api/UserAccess", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ privilages: data });
      })
      .catch(err => {
        //this.setState({ loading: false, redirect: true });
      });
    //end
  }
  validaterole = (rolename, action) => {
    let array = [...this.state.privilages];
    let AuditTrailsObj = array.find(obj => obj.RoleName === rolename);
    if (AuditTrailsObj) {
      if (action === "AddNew") {
        if (AuditTrailsObj.AddNew) {
          return true;
        } else {
          return false;
        }
      } else if (action === "View") {
        if (AuditTrailsObj.View) {
          return true;
        } else {
          return false;
        }
      } else if (action === "Edit") {
        if (AuditTrailsObj.Edit) {
          return true;
        } else {
          return false;
        }
      } else if (action === "Export") {
        if (AuditTrailsObj.Export) {
          return true;
        } else {
          return false;
        }
      } else if (action == "Remove") {
        if (AuditTrailsObj.Remove) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  fetchRoles = User => {
    fetch("/api/UserAccess/" + User, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Roles => {
        if (Roles.length > 0) {
          const UserRoles = [_.groupBy(Roles, "Category")];

          this.setState({ Menus: UserRoles[0].Menus });
          this.setState({ AdminCategory: UserRoles[0].Admin });
        } else {
          swal("", Roles.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
 
  

 
  closeModal=()=> {
    this.setState({ openView: false });
  }
  fetchOnePatientAttendances = (PatientID) => {
    fetch("/api/PatientAttendance/"+PatientID+"/" +localStorage.getItem("BranchID")+"/" + localStorage.getItem("CompanyID")+"/One", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Users => {
        if (Users.length > 0) {
            
          this.setState({ OnePatientAttendance: Users });
        } else {
          swal("", Users.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  
  openModal=(PatientID,PatientName)=> {
    
    this.setState({  OnePatientAttendance: [],PatientName:PatientName });

    this.fetchOnePatientAttendances(PatientID)
    this.setState({  openView: true });
  }
  
  fetchPatientAttendances = () => {
    fetch("/api/PatientAttendance/" +localStorage.getItem("BranchID")+"/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Users => {
        if (Users.length > 0) {
            
          this.setState({ PatientAttendance: Users });
        } else {
          swal("", Users.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };

 
  componentDidMount() {
    let token = localStorage.getItem("xtoken");
    if (token == null) {
      localStorage.clear();
      return (window.location = "/#/Logout");
    } else {
      fetch("/api/ValidateTokenExpiry", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("xtoken")
        }
      })
        .then(response =>
          response.json().then(data => {
            if (data.success) {
              this.ProtectRoute();
              this.fetchPatientAttendances();
            } else {
              localStorage.clear();
              return (window.location = "/#/Logout");
            }
          })
        )
        .catch(err => {
          localStorage.clear();
          return (window.location = "/#/Logout");
        });
    }
  }
 


  render() {
    const ColumnData = [
      {
        label: "Names",
        field: "Names",
        sort: "asc",
        width: 200
      },
      {
        label: "Branch",
        field: "Branch",
        sort: "asc",
        width: 200
      },
      {
        label: "Date",
        field: "Date",
        sort: "asc",
        width: 200
      },
      {
        label: "Time",
        field: "PatientTime",
        sort: "asc",
        width: 200
      },
      
      {
        label: "Action",
        field: "Action",
        sort: "asc",
        width: 200
      },
       {
        label: "View",
        field: "View",
        sort: "asc",
        width: 200
      }
    ];
    let Rowdata1 = [];
    
    const Rows = [...this.state.PatientAttendance];
console.log(Rows)
    if (Rows.length > 0) {
      Rows.map((k, i) => {
        let Rowdata = {
          Names: k.Names,
          Branch: k.Branch,
          Date:dateFormat(k.PatientDate, "mediumDate"),
          PatientTime: k.PatientTime,          
          Action: k.Action,
         
          View: (
            <span>
            
              &nbsp;
              {this.validaterole("Patient Attendance", "Edit") ? (
                <a
                  className="text-blue"
                  style={{ color: "#007bff" }}
                  onClick={e => this.openModal(k.PatientID,k.Names)}
                >
                  View 
                </a>
              ) : (
                <i>-</i>
              )}
              &nbsp;
          
            </span>
          )
        };
        Rowdata1.push(Rowdata);
      });
    }
  
    

    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading">
          <div className="col-lg-12">
            <br />
            <div className="row">
              <div className="col-sm-8">
                <b>PatientAttendances</b>
              </div>
              <div className="col-sm-4">
                <span className="float-right">
                  {this.validaterole("PatientAttendance Management", "AddNew") ? (
                    <button
                      type="button"
                      onClick={this.openModal}
                      className="btn btn-primary fa fa-plus"
                    >
                      &nbsp;New
                    </button>
                  ) : null}
               
                </span>
              </div>
            </div>
          </div>
        
          <Modal
            visible={this.state.openView}
            width="60%"
            height="530px"
            effect="fadeInUp"
          >
            <div style={{ "overflow-y": "scroll", height: "530px" }}>
              <a className="close" onClick={() => this.closeModal()}>
                &times;
              </a>
              <div className="container-fluid">
                <div className="col-sm-12">
                  <h2 style={{textAlign: "center",color:"Blue"}}>{this.state.PatientName}</h2>
                  
                  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                         <table className="table table-sm">
                         
                         <thead>
                           <th>Date</th>
                           <th>Branch</th>
                           <th>Action</th>
                         </thead>
                         <tbody>
                           {this.state.OnePatientAttendance.map((k, i)=>{
                             return <tr>
                                   <td>{k.CreatedAt}</td>
                                   <td>{k.Branch}</td>
                                   <td>{k.Action}</td>
                                </tr>
                           })}
                         </tbody>
                           
                           
                      </table>
                     
                    </div>
                </div>
              </div>
            </div>
          </Modal>
            </div>

        <TableWrapper>
          <Table Rows={Rowdata1} columns={ColumnData} />
        </TableWrapper>
      </div>
    );
  }
}
export default PatientAttendance;
