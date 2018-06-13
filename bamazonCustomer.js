var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');
var validator = require('validator');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startDisplay();
});

function startDisplay() {
  //Collects all Row Data for display
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    //New object of Table to create Table w/ header
    var table = new Table({
      head: ["ID", "DEPARTMENT", "ITEM NAME", "PRICE", "QUANTITY"],
      colWidths: [5, 15, 30, 10, 10] 
    });

    // Pushes Data from Query Response to array
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].department_name, res[i].product_name, res[i].price, res[i].stock_quantity]
      );
    }
    // Display table with appropriate data
    console.log(table.toString());

    //Ask User input for Item ID and Quantity
    inquirer.prompt([
      {
        type: "input",
        message: "Enter the ID of the product they would like to buy",
        name: 'id',
        validate: function(id) {
          if (parseInt(id) != 0 && parseInt(id) <= res.length) {
            return true;
          }
          else {
            console.log("\n\nInvalid Input. Please double check your Item's ID and try again.\n");
            return false;
          }
        }
      },
      {
        type: "input",
        message: "\nHow many units of the product they would like to buy?",
        name: "units",
        validate: function(units) {
          var val = validator.isNumeric(units);

          if (val) {
            return true;
          }
          else {
            console.log("\n\nInvalid Input. Please double check your Item's ID and try again.\n");
            return false;
          }
        }// End validate function
      }
    ]) // End Inquirer
    .then(function(inqres) {
        var id = inqres.id;
        var quan = inqres.units;

        connection.query("SELECT * FROM products", function(err, res){
          if (err) throw err;

          if (quan <= res[id-1].stock_quantity) {
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: res[id-1].stock_quantity - quan
                },
                {
                  item_id: id-1
                }
              ],
              function(err, res) {
                startDisplay();
              }
            )
          }
          else {
            console.log("Insufficient Quantity");
            startDisplay();
          }
        })
    })
  }
)};
