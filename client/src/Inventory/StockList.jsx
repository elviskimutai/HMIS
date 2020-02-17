import React, { Component } from "react";
import swal from "sweetalert";
import Table from "./../SystemAdmin/Table";
import TableWrapper from "./../SystemAdmin/TableWrapper";
var _ = require("lodash");
class StockList extends Component {
  constructor() {
    super();
    this.state = {
      InventoryReceipt: [],    
      privilages: [],
      Items:[],
     
    };
   
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
  
    

 
    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading">
          <div className="col-lg-12">
            <br />
            <div className="row">
              <div className="col-sm-8">
                <b>Inventory Count</b>
              </div>
              <div className="col-sm-4">
                <span className="float-right">
                  {this.validaterole("Inventory Receipt", "AddNew") ? (
                    <button
                      type="button"
                      onClick={this.openModal}
                      className="btn btn-primary fa fa-plus"
                    >
                      &nbsp;Excel
                    </button>
                  ) : null}
               
                </span>
              </div>
            </div>
          </div>

          </div>

        <TableWrapper>
          <Table Rows={Rowdata1} columns={ColumnData} />
        </TableWrapper>
      </div>
    );
  }
}
export default StockList;
