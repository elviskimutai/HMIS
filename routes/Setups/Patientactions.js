var express = require("express");
var Patientactions = express();
var mysql = require("mysql");
var config = require("./../SystemAdmin/DB");
var con = mysql.createPool(config);

const Joi = require("@hapi/joi");

var auth = require("./../SystemAdmin/auth");
Patientactions.get("/:CompanyID",  function(req, res) {
  const CompanyID = req.params.CompanyID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPGetAllPatientactions(?)";
      connection.query(sp, [CompanyID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            Another: "Bnooo",
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
Patientactions.get("/:ID/:CompanyID",  function(
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
      let sp = "call SPGetOnePatientactions(?,?)";
      connection.query(sp, [ID, CompanyID], function(error, results, fields) {
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

Patientactions.post("/", auth.validateRole("Patient Actions"), function(req, res) {
  const schema = Joi.object({
    CompanyID: Joi.number().integer(),
    Name: Joi.string().required()
  });
  //   const result = Joi.validate(, schema);
  //   if (!result.error) {
  try {
    const { error, value } = schema.validate(req.body);

    if (!error) {
      //console.log(res.locals);
      let data = [req.body.CompanyID, req.body.Name, res.locals.user];
      con.getConnection(function(err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call SPSavePatientactions(?,?,?)";
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
Patientactions.put("/:ID", auth.validateRole("Patient Actions"), function(req, res) {
  const schema = Joi.object().keys({
    CompanyID: Joi.number().integer(),
    Name: Joi.string().required()
  });
  try {
    const { error, value } = schema.validate(req.body);
    if (!error) {
      const ID = req.params.ID;
      let data = [req.body.CompanyID, ID, req.body.Name, res.locals.user];
      con.getConnection(function(err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call SPUpdatePatientaction(?,?,?,?)";
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
Patientactions.delete("/:ID/:CompanyID", auth.validateRole("Patient Actions"), function(
  req,
  res
) {
  const ID = req.params.ID;
  const CompanyID = req.params.CompanyID;
  let data = [CompanyID, ID, res.locals.user];
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call SPDeletepatientaction(?,?,?)";
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
});
module.exports = Patientactions;
