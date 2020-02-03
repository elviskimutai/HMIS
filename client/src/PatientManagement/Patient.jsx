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

   
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.Resetsate = this.Resetsate.bind(this);
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
  Resetsate() {
    const data = {
      Names: "",
      Address: "",
      Email: "",
   
      Mobile: "",
   
      isUpdate: false,
    
      DOB: "",
      Gender: ""
    };
    this.setState(data);
  }
  openModal() {
    this.setState({ open: true });
    this.Resetsate();
  }

 
  closeModal() {
    this.setState({ open: false });
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
    if (actionMeta.name === "UserGroup") {
      this.setState({ UserGroupID: UserGroup.value });
      this.setState({ [actionMeta.name]: UserGroup.label });
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
      Gender: this.state.Gender
    };

    if (this.state.isUpdate) {
      this.UpdateData("/api/Patient/" + this.state.Address, data);
    } else {
      this.postData("/api/Patient", data);
    }
  };
  handleEdit = Users => {
    const data = {
      Names: Users.Names,
      Address: Users.Address,
      Email: Users.Email,
      Address: Users.Address,
       DOB: dateFormat(new Date(Users.DOB).toLocaleDateString(), "isoDate"),
      Gender: Users.Gender,
      Mobile: Users.Mobile,
      open: true,
      isUpdate: true
    };

    this.setState(data);

    // this.handleRolesOpoup(Users.Address);
  };
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
                  Edit |
                </a>
              ) : (
                <i>-</i>
              )}
              &nbsp;
              {this.validaterole("Patient Management", "Remove") ? (
                <a
                  className="text-red"
                  style={{ color: "#f44542" }}
                  onClick={e => this.handleDelete(k.Address, e)}
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
                     
                      <div className="row">
                        <div className="col-sm-10"></div>
                        <div className="col-sm-2">
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
