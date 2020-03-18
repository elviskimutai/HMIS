import React, { Component } from "react";

import swal from "sweetalert";
import Table from "./../SystemAdmin/Table";
import TableWrapper from "./../SystemAdmin/TableWrapper";
import Modal from "react-awesome-modal";
import Select from "react-select";
var dateFormat = require("dateformat");
//var jsPDF = require("jspdf");
//require("jspdf-autotable");
var _ = require("lodash");
class Patient extends Component {
  constructor() {
    super();
    this.state = {
      Users: [],    
      privilages: [],
      Names: "",
      Address: "",
      Email: "",
      Mobile: "",
      DOB: "",
      Gender: "",    
      open: false,  
      isUpdate: false,
      openView: false,
      openCheckinModal:false,
      PatientsAttendance:[],
      Race:"",
      ActionID:"",
      NextOfKin:"",
      NextOfkinRelationship:"",
      EmergencyContact:"",
      Ocupation:"",
      ResidentialAddress:"",
      RefferedBy:"",  
      Patientactions: [],
      Timestamp:Date().toLocaleString(),
      Departments:[],
      DepartmentID:"",
      Officer:""
   
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.Resetsate = this.Resetsate.bind(this);
  }
  fetchPatientactions = () => {
    fetch("/api/Patientactions/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Patientactions => {
        if (Patientactions.length > 0) {
          this.setState({ Patientactions: Patientactions });
        } else {
          //swal("", "Patientactions.message", "error");
          swal("", Patientactions.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
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
  Resetsate() {
    const data = {
      Names: "",
      Address: "",
      Email: "",
      Race:"",
      NextOfKin:"",
      NextOfkinRelationship:"",
      EmergencyContact:"",
      Ocupation:"",
      ResidentialAddress:"",
      RefferedBy:"", 
      Mobile: "",   
      isUpdate: false,    
      DOB: "",
      Gender: ""
    };
    this.setState(data);
  }
  openModal=()=> {
    this.setState({ open: true, openView: false });
  }

  openCheckinModal=()=> {
    this.setState({ openCheckinModal: true,openView: false  });
  }
  closeCheckinModal=()=> {
    this.setState({ openCheckinModal: false });
  }
  closeModal=()=> {
    this.setState({ open: false });
  }
  closeViewModal=()=> {
    this.setState({ openView: false });
  }
  
  handleInputChange = event => {
    // event.preventDefault();
    // this.setState({ [event.target.name]: event.target.value });
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };
  handleSelectChange = (UserGroup, actionMeta) => {
    if (actionMeta.name === "DepartmentID") {
      
    let Officer =this.state.Departments.filter(dep=>dep.DepartmentID==UserGroup.value)[0].UserName;
        
      this.setState({ Officer: Officer,[actionMeta.name]: UserGroup.value });
    } else {
      this.setState({ [actionMeta.name]: UserGroup.value });
    }
  };
  
  fetchPatients = () => {
    fetch("/api/Patient/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Users => {
        if (Users.length > 0) {
          this.setState({ Users: Users });
        } else {
          swal("", Users.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchPatientsAttendance = (ID) => {
    fetch("/api/PatientAttendance/"+ID+"/"+localStorage.getItem("BranchID")+"/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(PatientsAttendance => {
        
        if (PatientsAttendance.length > 0) {
          this.setState({ PatientsAttendance: PatientsAttendance });
        } else {
          swal("", PatientsAttendance.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchDepartments = () => {
    fetch("/api/Departments/" + localStorage.getItem("CompanyID")+"/"+localStorage.getItem("BranchID")+"/Logins", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Departments => {
        if (Departments.length > 0) {
          this.setState({ Departments: Departments });
        } else {
          swal("", Departments.message, "error");
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
              this.fetchPatients();
              this.fetchDepartments();
              this.fetchPatientactions();
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
  handleSubmit = event => {
    event.preventDefault();
    let ComapnyID = localStorage.getItem("CompanyID");
    let BranchID = localStorage.getItem("BranchID");
    const data = {
      BranchID: BranchID,
      ComapnyID: ComapnyID,
      Names: this.state.Names,
      Address: this.state.Address,
      Email: this.state.Email,
      MobileNo: this.state.Mobile,
      DOB: this.state.DOB,
      Gender: this.state.Gender,

      Race:this.state.Race,
      NextOfKin:this.state.NextOfKin,
      NextOfkinRelationship:this.state.NextOfkinRelationship,
      EmergencyContact:this.state.EmergencyContact,
      Ocupation:this.state.Ocupation,
      ResidentialAddress:this.state.ResidentialAddress,
      RefferedBy:this.state.RefferedBy 
    };

    if (this.state.isUpdate) {
      this.UpdateData("/api/Patient/" + this.state.ID, data);
    } else {
      this.postData("/api/Patient", data);
    }
  };
  handleEdit = Users => {
    
    const data = {
      Names: Users.Names,
      ID: Users.ID,
      Address: Users.Address,
      Email: Users.Email,
      Address: Users.Address,
       DOB: dateFormat(new Date(Users.DOB).toLocaleDateString(), "isoDate"),
      Gender: Users.Gender,
      Mobile: Users.Mobile,
      BranchRegistered: Users.BranchRegistered,
      CreatedAt: dateFormat(new Date(Users.CreatedAt).toLocaleDateString(), "isoDate"),
      CreatedBy: Users.CreatedBy,
      Race:Users.Race,
      NextOfKin:Users.NextOfKin,
      NextOfkinRelationship:Users.NextOfkinRelationship,
      EmergencyContact:Users.EmergencyContact,
      Ocupation:Users.Ocupation,
      ResidentialAddress:Users.ResidentialAddress,
      RefferedBy:Users.RefferedBy,
      openView: true,
      isUpdate: true
    };

    this.setState(data);
this.fetchPatientsAttendance(Users.ID)
   
  };
  CheckInPatient=event=> {
    event.preventDefault();
    let ComapnyID = localStorage.getItem("CompanyID");
    let BranchID = localStorage.getItem("BranchID");
    const data = {
      BranchID: BranchID,
      ComapnyID: ComapnyID,
      PatientID: this.state.ID,
      ActionID:this.state.ActionID,
      DepartmentID:this.state.DepartmentID,
      Officer:this.state.Officer,
      
      
    };
    fetch("/api/PatientAttendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
          
            swal("", "Record has been saved!", "success");
            this.fetchPatientsAttendance(this.state.ID)
          } else {
            
              swal("", data.message, "error");
          
          }
        })
      )
      .catch(err => {
        swal("", err.message, "error");
      });
  }
  handleDelete = k => {
    swal({
      text: "Are you sure that you want to delete this record?",
      icon: "warning",
      dangerMode: true,
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        return fetch(
          "/api/Patient/" +
            k +
            "/" +
            localStorage.getItem("CompanyID") +
            "/" +
            localStorage.getItem("BranchID"),
          {
            method: "Delete",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("xtoken")
            }
          }
        )
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("", "Record has been deleted!", "success");
                this.Resetsate();
              } else {
                swal("", data.message, "error");
              }
              this.fetchPatients();
            })
          )
          .catch(err => {
            swal("", err.message, "error");
          });
      }
    });
  };
 
  UpdateData(url = ``, data = {}) {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
            swal("", "Record has been updated!", "success");
            this.Resetsate();
            this.setState({ open: false });
            this.fetchPatients();
          } else {
            swal("", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("", err.message, "error");
      });
  }
  postData(url = ``, data = {}) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
          
            swal("", "Record has been saved!", "success");
            //this.Resetsate();
            this.fetchPatients();
          } else {
            
              swal("", data.message, "error");
          
          }
        })
      )
      .catch(err => {
        swal("", err.message, "error");
      });
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
        label: "Address",
        field: "Address",
        sort: "asc",
        width: 200
      },
      {
        label: "Email",
        field: "Email",
        sort: "asc",
        width: 200
      },
      {
        label: "Mobile",
        field: "Mobile",
        sort: "asc",
        width: 200
      },
       {
        label: "action",
        field: "action",
        sort: "asc",
        width: 200
      }
    ];
    let Rowdata1 = [];
    
    const Rows = [...this.state.Users];

    if (Rows.length > 0) {
      Rows.map((k, i) => {
        let Rowdata = {
          Names: k.Names,
          Address: k.Address,
          Email: k.Email,
          Mobile: k.Mobile,
         
          action: (
            <span>
            
              &nbsp;
              {this.validaterole("Patient Management", "Edit") ? (
                <a
                  className="text-blue"
                  style={{ color: "#007bff" }}
                  onClick={e => this.handleEdit(k, e)}
                >
                  View |
                </a>
              ) : (
                <i>-</i>
              )}
              &nbsp;
              {this.validaterole("Patient Management", "Remove") ? (
                <a
                  className="text-red"
                  style={{ color: "#f44542" }}
                  onClick={e => this.handleDelete(k.ID, e)}
                >
                  Delete
                </a>
              ) : (
                <i>-</i>
              )}
            </span>
          )
        };
        Rowdata1.push(Rowdata);
      });
    }
  
    let GenderCategories = [
      {
        value: "Male",
        label: "Male"
      },
      {
        value: "Female",
        label: "Female"
      }
    ];
    const PatientactionsOptions = [...this.state.Patientactions].map((k, i) => {
      return {
        value: k.ID,
        label: k.Name
      };
    }); 
    const DepartmentsonsOptions = [...this.state.Departments].map((k, i) => {
      return {
        value: k.DepartmentID,
        label: k.Department+" ("+k.FullNames+")"
      };
    });
    

    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading">
          <div className="col-lg-12">
            <br />
            <div className="row">
              <div className="col-sm-8">
                <b>Patients</b>
              </div>
              <div className="col-sm-4">
                <span className="float-right">
                  {this.validaterole("Patient Management", "AddNew") ? (
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
            visible={this.state.openCheckinModal}
            width="60%"
            height="270px"
            effect="fadeInUp"
          >
            <div style={{ "overflow-y": "scroll", height: "270px" }}>
              <a className="close" onClick={() => this.closeCheckinModal()}>
                &times;
              </a>

              <div className="row">
                <div className="col-sm-5"></div>
                <div className="col-sm-4 fontWeight-bold text-blue">
                  Patient Checkin
                </div>
              </div>
              <div className="container-fluid">
                <div className="col-sm-12">
                  <div className="ibox-content">
                    <form
                      className="form-horizontal"
                      onSubmit={this.CheckInPatient}
                    >
                      <div className=" row">
                        <div className="col-sm">
                          <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Time In
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="Names"
                              id="Name"
                              disabled
                              onChange={this.handleInputChange}
                              value={this.state.Timestamp}
                            />
                          </div>
                          </div>
                          <div className="col-sm">
                          <div className="form-group">
                          <label for="Address" className="fontWeight-bold">
                            Action{" "}
                          </label>
                          <Select
                            name="ActionID"
                            // value={PatientactionsOptions.filter(
                            //   option => option.label === this.state.Gender
                            // )}
                            onChange={this.handleSelectChange}
                            options={PatientactionsOptions}
                            required
                          />
                          </div>
                        </div>
                        
                      </div>

                 
                      <div className="row">
                        <div className="col-sm-6">
                        <div className="form-group">
                          <label for="Address" className="fontWeight-bold">
                           Send To
                          </label>
                          <Select
                            name="DepartmentID"
                            // value={PatientactionsOptions.filter(
                            //   option => option.label === this.state.Gender
                            // )}
                            onChange={this.handleSelectChange}
                            options={DepartmentsonsOptions}
                            required
                          />
                          </div>
                        
                        </div>
                        <div className="col-sm-4"></div>
                        <div className="col-sm-2">
                          <br/>
                          <button
                            className="btn btn-primary float-right"
                            type="submit"
                          >
                           Complete Checkin
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            visible={this.state.openView}
            width="60%"
            height="530px"
            effect="fadeInUp"
          >
            <div style={{ "overflow-y": "scroll", height: "530px" }}>
              <a className="close" onClick={() => this.closeViewModal()}>
                &times;
              </a>
              <div className="container-fluid">
                <div className="col-sm-12">
                  <br/>
                  <div >
                  <nav>
                      <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                          <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Patient Details</a>
                          <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Checkin</a>
                          </div>
                  </nav>
                  <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                         <table className="table table-sm">
                            <tr>
                            <td className="font-weight-bold"> Full Names:</td>
                            <td>{this.state.Names}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold"> Gender:</td>
                            <td>{this.state.Gender}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold"> Email:</td>
                            <td>{this.state.Email}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Address:</td>
                            <td>{this.state.Address}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Mobile:</td>
                            <td>{this.state.Mobile}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">DOB:</td>
                            <td>{this.state.DOB}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Branch Registered:</td>
                            <td>{this.state.BranchRegistered}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Registered On:</td>
                            <td>{this.state.CreatedAt}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Registered By:</td>
                            <td>{this.state.CreatedBy}</td>
                            </tr>
                            
                            <tr>
                            <td className="font-weight-bold">NextOfKin:</td>
                            <td>{this.state.NextOfKin}</td>
                            </tr>  <tr>
                            <td className="font-weight-bold">Next Of kin Relationship:</td>
                            <td>{this.state.NextOfkinRelationship}</td>
                            </tr>  <tr>
                            <td className="font-weight-bold">Emergency Contact:</td>
                            <td>{this.state.EmergencyContact}</td>
                            </tr>  <tr>
                            <td className="font-weight-bold">Ocupation:</td>
                            <td>{this.state.Ocupation}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Race:</td>
                            <td>{this.state.Race}</td>
                            </tr>
                            <tr>
                            <td className="font-weight-bold">Reffered By:</td>
                            <td>{this.state.RefferedBy}</td>
                            </tr>
                      </table>
                        <div className="row">
                      
                          <div className="col-sm-2">
                            <button
                              className="btn btn-primary"
                              type="button" onClick={this.openModal}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                              <br/>
                               <div className="row">
                                 <div className="col-sm-2">
                                   <button className="btn btn-primary" onClick={this.openCheckinModal}>Check In</button>
                                 </div>
                               </div>
                                <table class="table table-sm" cellspacing="0">
                                    <thead>
                                      
                                        <tr>
                                            <th>Branch</th>
                                            <th>Names</th>                                            
                                            <th>Checkin</th>
                                            <th>Action</th>
                                            
                                            <th>Checked By</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                         this.state.PatientsAttendance.map((k, i) => {
                                           return   <tr>
                                           <td>{k.Branch}</td>
                                           <td>{k.Names}</td>
                                           <td>{k.CreatedAt}</td>
                                           <td>{k.Action}</td>
                                           <td>{k.CreatedBy}</td>
                                       </tr>
                                         })
                                      }
                                        
                                       
                                    </tbody>
                                </table>
                            </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            visible={this.state.open}
            width="60%"
            height="530px"
            effect="fadeInUp"
          >
            <div style={{ "overflow-y": "scroll", height: "530px" }}>
              <a className="close" onClick={() => this.closeModal()}>
                &times;
              </a>

              <div className="row">
                <div className="col-sm-5"></div>
                <div className="col-sm-4 fontWeight-bold text-blue">
                  Patient{" "}
                </div>
              </div>
              <div className="container-fluid">
                <div className="col-sm-12">
                  <div className="ibox-content">
                    <form
                      className="form-horizontal"
                      onSubmit={this.handleSubmit}
                    >
                      <div className=" row">
                        <div className="col-sm">
                          <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Full Names
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="Names"
                              id="Name"
                              required
                              onChange={this.handleInputChange}
                              value={this.state.Names}
                            />
                          </div>
                          </div>
                          <div className="col-sm">
                          <div className="form-group">
                          <label for="Address" className="fontWeight-bold">
                            Gender{" "}
                          </label>
                          <Select
                            name="Gender"
                            value={GenderCategories.filter(
                              option => option.label === this.state.Gender
                            )}
                            onChange={this.handleSelectChange}
                            options={GenderCategories}
                            required
                          />
                          </div>
                        </div>
                        
                      </div>

                      <div className=" row">
                        <div className="col-sm">
                          <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="Email"
                              id="Email"
                              required
                              onChange={this.handleInputChange}
                              value={this.state.Email}
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="Address"
                              id="Address"
                              required
                              onChange={this.handleInputChange}
                              value={this.state.Address}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Mobile
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="Mobile"
                            id="Mobile"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.Mobile}
                          />
                        </div>
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                            DOB{" "}
                          </label>
                          <input
                            type="date"
                            name="DOB"
                            defaultValue={this.state.DOB}
                            required
                            className="form-control"
                            onChange={this.handleInputChange}
                            id="DOB"
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Next Of Kin
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="NextOfKin"
                            id="NextOfKin"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.NextOfKin}
                          />
                        </div>
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Next Of kin Relationship
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="NextOfkinRelationship"
                            id="NextOfkinRelationship"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.NextOfkinRelationship}
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          EmergencyContact
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="EmergencyContact"
                            id="EmergencyContact"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.EmergencyContact}
                          />
                        </div>
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Ocupation
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="Ocupation"
                            id="Ocupation"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.Ocupation}
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Residential Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="ResidentialAddress"
                            id="ResidentialAddress"
                            required
                            onChange={this.handleInputChange}
                            value={this.state.ResidentialAddress}
                          />
                        </div>
                        <div class="col-sm-6">
                          <label for="Address" className="fontWeight-bold">
                          Race
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="Race"
                            id="Race"
                            
                            onChange={this.handleInputChange}
                            value={this.state.Race}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                        <label for="Address" className="fontWeight-bold">
                        Reffered By
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="RefferedBy"
                            id="RefferedBy"
                            
                            onChange={this.handleInputChange}
                            value={this.state.RefferedBy}
                          />
                        </div>
                        <div className="col-sm-4"></div>
                        <div className="col-sm-2">
                          <br/>
                          <button
                            className="btn btn-primary float-right"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
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
export default Patient;
