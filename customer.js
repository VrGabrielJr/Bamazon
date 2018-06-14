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
  main();
});

function main() {
  display();
  prompt();
}
  
function display() {
  //Collects all Row Data for display
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

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
  })
};
  
function prompt() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

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
    ])
    .then(function(inqRes) {
      var id = inqRes.id;
      var units = inqRes.units;
      
      connection.query("SELECT * FROM products WHERE ?", 
        {
          item_id: id
        },
        function(err, res) {
          if (err) throw err;

          var resInfo = res[0];
          var resUnits = resInfo.stock_quantity;
          
          if (units < resUnits) {
            var updateUnits = units;
            var updateId = id;
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: resUnits - updateUnits
                },
                {
                  item_id: updateId
                }
              ],
              function(err, res) {
                console.log("Processing Your Order Now!");
                console.log("Total Price = " + (updateUnits * resInfo.price));
                console.log("Thank you come again!");
              }
            )
          }
          else {
            console.log("\nInsufficent quantity!\n");
          }
        }
      )
    }
  )}
)}