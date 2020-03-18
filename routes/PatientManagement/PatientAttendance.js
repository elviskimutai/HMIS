var express = require("express");
var PatientAttendance = express();
var mysql = require("mysql");
var config = require("./../SystemAdmin/DB");
var con = mysql.createPool(config);
const Joi = require("@hapi/joi");

var auth = require("./../SystemAdmin/auth");
PatientAttendance.get("/:ID/:BranchID/:CompanyID", auth.validateRole("Patient Attendance"), function(
  req,
  res
) {
  const ID = req.params.ID;
  const BranchID = req.params.BranchID;
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetOnePatientAttendance(?,?,?)";
      connection.query(sp, [ID,CompanyID,BranchID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
PatientAttendance.get("/:BranchID/:CompanyID", auth.validateRole("Patient Attendance"), function(
  req,
  res
) {
  const BranchID = req.params.BranchID;
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetPatientAttendance(?,?)";
      connection.query(sp, [CompanyID,BranchID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
PatientAttendance.get("/:ID/:BranchID/:CompanyID/:onepatient", auth.validateRole("Patient Attendance"), function(
  req,
  res
) {
  const ID = req.params.ID;
  const BranchID = req.params.BranchID;
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetOnePatientAttendance(?,?,?)";
      connection.query(sp, [ID,CompanyID,BranchID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
PatientAttendance.get("/:ID/:BranchID/:CompanyID/:onepatient/:PatientPerAction", auth.validateRole("Patient Attendance"), function(
  req,
  res
) {
  const BranchID = req.params.BranchID;
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetPatientsAttendancePerAction(?,?)";
      connection.query(sp, [CompanyID,BranchID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
PatientAttendance.post("/", auth.validateRole("Patient Attendance"), function(req, res) {
  const schema = Joi.object({
    ComapnyID: Joi.number().integer(),
    BranchID: Joi.number().integer(),
    PatientID: Joi.number().integer(),
    ActionID: Joi.number().integer(),
    DepartmentID: Joi.number().integer(),
    Officer:Joi.string()
  });
  //   const result = Joi.validate(, schema);
  //   if (!result.error) {
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {  

        let data = [
            req.body.PatientID,
            res.locals.user,
            req.body.ComapnyID,  
            req.body.BranchID,
            req.body.ActionID,
            req.body.DepartmentID,
            req.body.Officer
            
          
        ];
        con.getConnection(function(err, connection) {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } // not connected!
          else {
            let sp = "call SPSavepatientsattendance(?,?,?,?,?,?,?)";
            connection.query(sp, data, function(error, results, fields) {
              if (error) {
                res.json({
                  success: false,
                  message: error.message
                });
              } else {
                res.json({
                  success: true,
                  message: "saved"
                });
              }
              connection.release();
              // Don't use the connection here, it has been returned to the pool.
            });
          }
        });
    
    } else {
      res.json({
        success: false,
        message: error.details[0].message
      });
    }
  } catch (err) {
    //console.log(err);
    res.json({
      success: false,
      message: err
    });
  }
});

module.exports = PatientAttendance;
