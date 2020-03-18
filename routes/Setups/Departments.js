var express = require("express");
var Departments = express();
var mysql = require("mysql");
var config = require("../SystemAdmin/DB");
var con = mysql.createPool(config);
const Joi = require("@hapi/joi");

var auth = require("../SystemAdmin/auth");
Departments.get("/:CompanyID/:BranchID", auth.validateRole("Departments"), function(
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
      let sp = "call SPGetAllDepartments(?,?)";
      connection.query(sp, [req.params.CompanyID,req.params.BranchID], function(
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
Departments.get("/:CompanyID/:BranchID/:DepartmentalLogins", auth.validateRole("Departments"), function(
  req,
  res
) {
  const CompanyID = req.params.CompanyID;
  const BranchID = req.params.BranchID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetDepartmentalLogins(?,?)";
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

Departments.post("/", auth.validateRole("Departments"), function(req, res) {
  const schema = Joi.object({
    ComapnyID: Joi.number().integer(),
    BranchID: Joi.number().integer(),
   
      Description: Joi.string()
      .required()
  });
  //   const result = Joi.validate(, schema);
  //   if (!result.error) {
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {  

        let data = [
            req.body.Description,
           
            res.locals.user,           
            req.body.ComapnyID,  
            req.body.BranchID         
          
        ];
        con.getConnection(function(err, connection) {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } // not connected!
          else {
            let sp = "call SPSaveDepartment(?,?,?,?)";
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
Departments.put("/:ID", auth.validateRole("Departments"), function(req, res) {
    const schema = Joi.object({
        ComapnyID: Joi.number().integer(),
        BranchID: Joi.number().integer(),
       
          Description: Joi.string()
          .required()
      });
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {
      const ID = req.params.ID;
      let data = [
        ID,
        req.body.Description,
            res.locals.user,           
            req.body.ComapnyID,  
            req.body.BranchID
      ];
      con.getConnection(function(err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call SPUpdateDepartment(?,?,?,?,?)";
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
Departments.delete(
  "/:ID/:ComapnyID/:BranchID",
  auth.validateRole("Departments"),
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
        let sp = "call SPDeleteDepartment(?,?,?,?)";
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
module.exports = Departments;
