var express = require("express");
var Departmentaccess = express();
var mysql = require("mysql");
var config = require("./../SystemAdmin/DB");
var con = mysql.createPool(config);

const Joi = require("@hapi/joi");

var auth = require("./../SystemAdmin/auth");
Departmentaccess.get("/:CompanyID", auth.validateRole("Department Access"), function(
  req,
  res
) {
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetDepartmentAccess(?)";
      connection.query(sp, [CompanyID], function(error, results, fields) {
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
Departmentaccess.get("/:CompanyID/:UserName", function(req, res) {
  const CompanyID = req.params.CompanyID;
  const UserName = req.params.UserName;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetUserDepartmentaccess(?,?)";
      connection.query(sp, [CompanyID, UserName], function(
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
Departmentaccess.post("/", auth.validateRole("Department Access"), function(req, res) {
  const schema = Joi.object({
    CompanyID: Joi.number().integer(),
    BranchID: Joi.number().integer(),
    DepartmentID: Joi.number().integer(),
    UserName: Joi.string().required()
  });
  //   const result = Joi.validate(, schema);
  //   if (!result.error) {
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {
      //console.log(res.locals);
      let data = [
        req.body.CompanyID,
        req.body.DepartmentID,
        req.body.UserName,
        res.locals.user,
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
          let sp = "call SPSaveDepartmentaccess(?,?,?,?,?)";
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

Departmentaccess.delete(
  "/:ID/:CompanyID/:UserName",
  auth.validateRole("Department Access"),
  function(req, res) {
    const DepartmentID = req.params.ID;
    const CompanyID = req.params.CompanyID;
    const UserName = req.params.UserName;
    let data = [CompanyID, DepartmentID, UserName, res.locals.user];
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call SpDeleteDepartmentAccess(?,?,?,?)";
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
module.exports = Departmentaccess;
