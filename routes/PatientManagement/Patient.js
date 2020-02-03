var express = require("express");
var Patient = express();
var mysql = require("mysql");
var config = require(".././SystemAdmin/DB");
var con = mysql.createPool(config);
const Joi = require("@hapi/joi");

var auth = require(".././SystemAdmin/auth");
Patient.get("/:CompanyID", auth.validateRole("Patient Management"), function(
  req,
  res
) {
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetPatients(?)";
      connection.query(sp, [req.params.CompanyID], function(
        error,
        results,
        fields
      ) {
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
Patient.get("/:ID/:CompanyID", auth.validateRole("Patient Management"), function(
  req,
  res
) {
  const ID = req.params.ID;
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SpGetOnePatient(?,?)";
      connection.query(sp, [ID,CompanyID], function(error, results, fields) {
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

Patient.post("/", auth.validateRole("Patient Management"), function(req, res) {
  const schema = Joi.object({
    ComapnyID: Joi.number().integer(),
    BranchID: Joi.number().integer(),
    MobileNo: Joi.string()
      .min(10)
      .required(),
    Address: Joi.string()
      .required(),  
    Email: Joi.string().email({ minDomainSegments: 2 }),
     DOB: Joi.date().required(),
    Gender: Joi.string().required(), 
    Names: Joi.string().required()
  });
  //   const result = Joi.validate(, schema);
  //   if (!result.error) {
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {  

        let data = [
            req.body.Names,
            req.body.MobileNo,
            req.body.Email,
            req.body.Address,
            req.body.DOB,
            res.locals.user,           
            req.body.ComapnyID,  
            req.body.BranchID,
            req.body.Gender
          
          
        ];
        con.getConnection(function(err, connection) {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } // not connected!
          else {
            let sp = "call SPSavepatient(?,?,?,?,?,?,?,?,?)";
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
Patient.put("/:ID", auth.validateRole("Patient Management"), function(req, res) {
    const schema = Joi.object({
        ComapnyID: Joi.number().integer(),
        BranchID: Joi.number().integer(),
        MobileNo: Joi.string()
          .min(10)
          .required(),
        Address: Joi.string()
          .required(),  
        Email: Joi.string().email({ minDomainSegments: 2 }),
         DOB: Joi.date().required(),
        Gender: Joi.string().required(), 
        Names: Joi.string().required()
      });
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {
      const ID = req.params.ID;
      let data = [
        ID,
        req.body.Names,
            req.body.MobileNo,
            req.body.Email,
            req.body.Address,
            req.body.DOB,
            res.locals.user,           
            req.body.ComapnyID,  
            req.body.BranchID,
            req.body.Gender
      ];
      con.getConnection(function(err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call SPUpdatePatient(?,?,?,?,?,?,?,?,?,?)";
          connection.query(sp, data, function(error, results, fields) {
            if (error) {
              res.json({
                success: false,
                message: error.message
              });
            } else {
              res.json({
                success: true,
                message: "updated"
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
Patient.delete(
  "/:ID/:ComapnyID/:BranchID",
  auth.validateRole("Patient Management"),
  function(req, res) {
    const ID = req.params.ID;
    let data = [ID, res.locals.user, req.params.ComapnyID, req.params.BranchID];
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call SPDeletePatient(?,?,?,?)";
        connection.query(sp, data, function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json({
              success: true,
              message: "deleted Successfully"
            });
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  }
);
module.exports = Patient;
