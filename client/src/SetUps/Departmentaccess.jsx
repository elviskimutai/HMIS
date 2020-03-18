import React, { Component } from "react";
import swal from "sweetalert";
import Table from "./../SystemAdmin/Table";
import TableWrapper from "./../SystemAdmin/TableWrapper";
import Modal from "react-awesome-modal";
import Select from "react-select";
var _ = require("lodash");
class Departmentaccess extends Component {
  constructor() {
    super();
    this.state = {
      Departmentaccess: [],
      Departments:[],
      Users: [],
      Branches: [],
      privilages: [],
      UserName: "",
      Description: "",
      DepartmentID: "",
      open: false,
      isUpdate: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.Resetsate = this.Resetsate.bind(this);
  }
  fetchBranches = () => {
    fetch("/api/Branches/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Branches => {
        if (Branches.length > 0) {
          this.setState({ Branches: Branches });
        } else {
          //swal("", "Branches.message", "error");
          swal("", Branches.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchUsers = () => {
    fetch("/api/users/" + localStorage.getItem("CompanyID"), {
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

  openModal() {
    this.setState({ open: true });
    this.Resetsate();
  }

  closeModal() {
    this.setState({ open: false });
  }
  handleInputChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };
  Resetsate() {
    const data = {
      Name: "",

      DepartmentID: "",
      isUpdate: false
    };
    this.setState(data);
  }

  fetchDepartmentaccess = () => {
    fetch("/api/Departmentaccess/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Departmentaccess => {
        if (Departmentaccess.length > 0) {
          this.setState({ Departmentaccess: Departmentaccess });
        } else {
          //swal("", "Departmentaccess.message", "error");
          swal("", Departmentaccess.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchDepartments = () => {
    fetch("/api/Departments/" + localStorage.getItem("CompanyID")+"/"+localStorage.getItem("BranchID"), {
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
              this.fetchDepartmentaccess();
              this.fetchUsers();
              this.fetchBranches();
              this.fetchDepartments();
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
    let CompanyID = localStorage.getItem("CompanyID");
    let BranchID=localStorage.getItem("BranchID");
    const data = {
      CompanyID: CompanyID,
      DepartmentID: this.state.DepartmentID,
      UserName: this.state.UserName,
      BranchID:BranchID
    };

    this.postData("/api/Departmentaccess", data);
  };
  handleEdit = Name => {
    const data = {
      UserName: Name.UserName,
      DepartmentID: Name.DepartmentID,
      open: true
    };

    this.setState(data);
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
          "/api/Departmentaccess/" +
            k.DepartmentID +
            "/" +
            localStorage.getItem("CompanyID") +
            "/" +
            k.UserName,
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
              this.fetchDepartmentaccess();
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
          this.fetchDepartmentaccess();

          if (data.success) {
            swal("", "Record has been updated!", "success");
            this.setState({ open: false });
            this.Resetsate();
          } else {
            swal("", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("", err.message, "error");
      });
  }
  handleSelectChange = (UserGroup, actionMeta) => {
    this.setState({ [actionMeta.name]: UserGroup.value });
  };
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
          this.fetchDepartmentaccess();

          if (data.success) {
            swal("", "Record has been saved!", "success");
            this.setState({ open: false });
            this.Resetsate();
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
        label: "DepartmentName",
        field: "DepartmentName",
        sort: "asc",
        width: 200
      },
      {
        label: "UserName",
        field: "UserName",
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

    const rows = [...this.state.Departmentaccess];

    if (rows.length > 0) {
      rows.forEach(k => {
        const Rowdata = {
          DepartmentName: k.DepartmentName,
          UserName: k.UserName,

          action: (
            <span>
              &nbsp;
              {this.validaterole("Department Access", "Remove") ? (
                <a
                  style={{ color: "#f44542" }}
                  onClick={e => this.handleDelete(k, e)}
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

    const UsersOptions = [...this.state.Users].map((k, i) => {
      return {
        value: k.UserName,
        label: k.FullNames
      };
    });
    const DepartmentsonsOptions = [...this.state.Departments].map((k, i) => {
        return {
          value: k.ID,
          label: k.Name
        };
      });
    return (
      <div>
        <div>
          <div className="row wrapper border-bottom white-bg page-heading">
            <div className="col-lg-12">
              <br />
              <div className="row">
                <div className="col-sm-9">
                  <h2>Department Access</h2>
                </div>
                <div className="col-sm-3">
                  <span className="float-right">
                    {this.validaterole("Department Access", "AddNew") ? (
                      <button
                        type="button"
                        onClick={this.openModal}
                        className="btn btn-primary  fa fa-plus"
                      >
                        New
                      </button>
                    ) : null}
                    &nbsp;
                    {this.validaterole("Department Access", "Export") ? (
                      <button
                        onClick={this.exportpdf}
                        type="button"
                        className="btn btn-primary  fa fa-file-pdf-o fa-2x"
                      >
                        &nbsp;PDF
                      </button>
                    ) : null}
                    &nbsp;
                  </span>
                </div>
              </div>
            </div>
            <Modal
              visible={this.state.open}
              width="65%"
              height="250px"
              effect="fadeInUp"
            >
              <div>
                <a className="close text-red" onClick={this.closeModal}>
                  &times;
                </a>
                <div className="row">
                  <div className="col-sm-5"></div>
                  <div className="col-sm-4 font-weight-bold">
                    Security Groups{" "}
                  </div>
                </div>

                <div>
                  <div className="container-fluid">
                    <div className="col-sm-12">
                      <div className="ibox-content">
                        <form onSubmit={this.handleSubmit}>
                          <div className=" row">
                            <div className="col-sm">
                              <div className="form-group">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="font-weight-bold"
                                >
                                  UserName
                                </label>
                                <Select
                                  name="UserName"
                                  value={UsersOptions.filter(
                                    option =>
                                      option.value === this.state.UserName
                                  )}
                                  onChange={this.handleSelectChange}
                                  options={UsersOptions}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-sm">
                              <div className="form-group">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="font-weight-bold"
                                >
                                  Branch
                                </label>
                                <Select
                                  name="DepartmentID"
                                  value={DepartmentsonsOptions.filter(
                                    option =>
                                      option.value === this.state.DepartmentID
                                  )}
                                  onChange={this.handleSelectChange}
                                  options={DepartmentsonsOptions}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-12 ">
                            <div className=" row">
                              <div className="col-sm-2" />
                              <div className="col-sm-8" />
                              <div className="col-sm-1"></div>
                              <div className="col-sm-1">
                                <button
                                  type="submit"
                                  className="btn btn-primary float-left"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <TableWrapper>
          <Table Rows={Rowdata1} columns={ColumnData} />
        </TableWrapper>
      </div>
    );
  }
}

export default Departmentaccess;
