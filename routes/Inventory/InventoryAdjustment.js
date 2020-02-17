var express = require("express");
var InventoryAdjustment = express();
var mysql = require("mysql");
var config = require(".././SystemAdmin/DB");
var con = mysql.createPool(config);
const Joi = require("@hapi/joi");
var auth = require(".././SystemAdmin/auth");
InventoryAdjustment.get("/:CompanyID", auth.validateRole("Inventory Receipt"), function(
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
        let sp = "call SPGetInventoryCount(?,?)";
        connection.query(sp, [ res.locals.user,  req.params.CompanyID], function(
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
  

InventoryAdjustment.post("/", auth.validateRole("Inventory Receipt"), function(req, res) {
    const schema = Joi.object({
      ComapnyID: Joi.number().integer(),
      BranchID: Joi.number().integer(),   
      Item: Joi.number()
        .required(),
        Description: Joi.string() .required(),
        Count: Joi.number()
        .required(),
        Action:Joi.string() .required()
    });
    
    try {
      const { error, value } = schema.validate(req.body);
  
      if (!error) {  
  
          let data = [
              req.body.BranchID,
              req.body.ComapnyID,             
              req.body.Item,             
              req.body.Description,             
              req.body.Count, 
              res.locals.user,               
              req.body.Action
             ];
          con.getConnection(function(err, connection) {
            if (err) {
              res.json({
                success: false,
                message: err.message
              });
            } // not connected!
            else {
              let sp = "call SPSaveItemCount(?,?,?,?,?,?,?)";
              connection.query(sp, data, function(error, results, fields) {
                if (error) {
                  res.json({
                    success: false,
                    message: error.message
                  });
                } else {
                  res.json({
                    success: true,
                    message: "saved",
                    results:results[0]
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
module.exports = InventoryAdjustment;
