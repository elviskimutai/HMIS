import React, { Component } from "react";
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dateFormat = require("dateformat");
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      Branches: [],
      privilages: [],
      Patients:[],
      todaypatients:[],
      TodaysPatientAttendance:[],
      PatientAttendancePerAction:[]
      
    
    };
    this.chartReference = React.createRef();

   
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
        
        }
      })
      .catch(err => {
      
      });
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
        
            let todaypatients=Users.filter(
                              option => dateFormat(option.CreatedAt, "mediumDate") ==dateFormat(Date(), "mediumDate")
                            )
                           
          this.setState({ Patients: Users,todaypatients:todaypatients });
        } else {
        
        }
      })
      .catch(err => {
       
      });
  };
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
          
            let todaypatients=Users.filter(
                              option => dateFormat(option.PatientDate, "mediumDate") ==dateFormat(Date(), "mediumDate")
                            )
          this.setState({ TodaysPatientAttendance: todaypatients });
        } else {
        
        }
      })
      .catch(err => {
        
      });
  };
  fetchPatientAttendancesPercategory = () => {
    fetch("/api/PatientAttendance/1/" +localStorage.getItem("BranchID")+"/" + localStorage.getItem("CompanyID")+"/One/two", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("xtoken")
      }
    })
      .then(res => res.json())
      .then(Users => {
        if (Users.length > 0) {
            
          this.setState({ PatientAttendancePerAction: Users });
        } else {
          
        }
      })
      .catch(err => {
       
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
              this.fetchPatientAttendancesPercategory();
              this.fetchPatients();
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
 
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Patients Attendance per Actions"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints:this.state.PatientAttendancePerAction
        }]
    }
    return (
        <div className="container-fluid">
            <br/>
      <div class="row">
          <div class="col-lg-4 col-6">          
            <div class="small-box bg-info">
              <div class="inner">
                <h3>{this.state.Patients.length}</h3>
                <p>Total patient(s)</p>
              </div>
              <div class="icon">
                <i class="ion ion-bag"></i>
              </div>
              <a href="#/Patient" className="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
         
          <div className="col-lg-4 col-6">
            
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{this.state.todaypatients.length}</h3>

                <p>Today's Patients(New)</p>
              </div>
              <div class="icon">
                <i class="ion ion-bag"></i>
              </div>
              <a href="#" className="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
         
          <div className="col-lg-4 col-6">
          
            <div className="small-box bg-warning">
              <div className="inner">
             <h3>{this.state.TodaysPatientAttendance.length}</h3>

                <p>Patients seen Today</p>
              </div>
              <div className="icon">
                <i className="ion ion-person-add"></i>
              </div>
              <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
         
        </div>
        <br/>
        <div class="row">
          <div class="col-lg-6 col-6">          
            <div class="small-box bg-info">
            <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
             </div>
          </div>
         
          <div className="col-lg-6 col-6">
            
          <div class="small-box bg-info">
            <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
             </div>
          </div>
         
        
         
        </div>
      </div>
    );
  }
}

export default Dashboard;
