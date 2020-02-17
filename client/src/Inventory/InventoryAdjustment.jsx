import React, { Component } from "react";
import Select from "react-select";
import swal from "sweetalert";
import Table from "./../SystemAdmin/Table";
import TableWrapper from "./../SystemAdmin/TableWrapper";
import Modal from "react-awesome-modal";
var _ = require("lodash");
class InventoryAdjustment extends Component {
  constructor() {
    super();
    this.state = {
      InventoryReceipt: [],    
      privilages: [],
      Items:[],
      Description: "",
      Quantity: "",
      Item:"",
      ID:"",
      Subract:"",
      open: false,  
      isUpdate: false   
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


  Resetsate() {
    const data = {
      Description: "",
      Amount: ""
    };
    this.setState(data);
  }
  openModal() {
    const data = {
      Description: "",
      ID: "",
      open: true,
      isUpdate: false
    };

    this.setState(data);
   
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
  
  fetchInventoryReceipts = () => {
    fetch("/api/InventoryAdjustment/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(InventoryReceipt => {
        if (InventoryReceipt.length > 0) {
          this.setState({ InventoryReceipt: InventoryReceipt });
        } else {
          swal("", InventoryReceipt.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchItems = () => {
    fetch("/api/Items/" + localStorage.getItem("CompanyID"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Items => {
        if (Items.length > 0) {
          this.setState({ Items: Items });
        } else {
          swal("", Items.message, "error");
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
              this.fetchInventoryReceipts();
              this.fetchItems();
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
      Item:this.state.Item,
      Description: this.state.Description,
      Count: this.state.Quantity,
      Action:this.state.Action
     
    };

    
      this.postData("/api/InventoryAdjustment", data);
   
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
          if (data.success) {
          
            swal("", data.results[0].msg, "success");
            //this.Resetsate();
            this.fetchInventoryReceipts();
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
            label: "Item",
            field: "ItemName",
            sort: "asc",
            width: 200
          }
          ,
      {
        label: "ItemCategory",
        field: "ItemCategory",
        sort: "asc",
        width: 200
      },
      {
        label: "Branch",
        field: "BranchName",
        sort: "asc",
        width: 200
      },
      {
        label: "Count",
        field: "Count",
        sort: "asc",
        width: 200
      }
    ];
    let Rowdata1 = [];
    
    const Rows = [...this.state.InventoryReceipt];

    if (Rows.length > 0) {
      Rows.map((k, i) => {
        let Rowdata = {
            ItemName:k.ItemName,
            ItemCategory:k.ItemCategory,
            BranchName:k.BranchName,
            Count:k.Count
        };
        Rowdata1.push(Rowdata);
      });
    }
  
    

    const ItemsOptions = [...this.state.Items].map((k, i) => {
        return {
          value: k.ItemID,
          label: k.ItemName
        };
      }); 
const ActionOptions=[
        {
        value: "Add",
        label: "Add"
        },
        {
        value: "Subract",
        label: "Subract"
        }
]
    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading">
          <div className="col-lg-12">
            <br />
            <div className="row">
              <div className="col-sm-8">
                <b>Inventory Adjustment</b>
              </div>
              <div className="col-sm-4">
                <span className="float-right">
                  {this.validaterole("Inventory Receipt", "AddNew") ? (
                    <button
                      type="button"
                      onClick={this.openModal}
                      className="btn btn-primary fa fa-plus"
                    >
                      &nbsp;Adjust
                    </button>
                  ) : null}
               
                </span>
              </div>
            </div>
          </div>

          <Modal
            visible={this.state.open}
            width="60%"
            height="290px"
            effect="fadeInUp"
          >
            <div style={{ "overflow-y": "scroll", height: "290px" }}>
              <a className="close" onClick={() => this.closeModal()}>
                &times;
              </a>

              <div className="row">
                <div className="col-sm-5"></div>
                <div className="col-sm-4 fontWeight-bold text-blue">
                  Inventory Receipt{" "}
                </div>
              </div>
              <div className="container-fluid">
                <div className="col-sm-12">
                  <div className="ibox-content">
                    <form
                      className="form-horizontal"
                      onSubmit={this.handleSubmit}
                    >
                        <div className="row">
                            <div className="col-sm">
                            <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Item
                            </label>
                          
                            <Select
                                  name="Item"
                                  value={ItemsOptions.filter(
                                    option =>
                                      option.value === this.state.Item
                                  )}
                                  onChange={this.handleSelectChange}
                                  options={ItemsOptions}
                                  required
                                />
                                </div>
                            </div>
                            <div className="col-sm">
                            <div className="form-group">
                          <label for="Quantity" className="fontWeight-bold">
                         Quantity
                          </label>
                          <input
                              type="number"
                              min='1'
                              className="form-control"
                              name="Quantity"
                              id="Quantity"
                              required
                              onChange={this.handleInputChange}
                              value={this.state.Quantity}
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
                              Action
                            </label>
                          
                            <Select
                                  name="Action"
                                  value={ActionOptions.filter(
                                    option =>
                                      option.value === this.state.Action
                                  )}
                                  onChange={this.handleSelectChange}
                                  options={ActionOptions}
                                  required
                                />
                                </div>
                            </div>
                        <div className="col-sm">
                          <div className="form-group">
                            <label
                              htmlFor="Datereceived"
                              className="fontWeight-bold"
                            >
                              Description
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="Description"
                             required
                              onChange={this.handleInputChange}
                              value={this.state.Description}
                            />
                          </div>
                          </div>
                                                  
                      </div>
                      <div className="row">
                        <div className="col-sm-10"></div>
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
export default InventoryAdjustment;
