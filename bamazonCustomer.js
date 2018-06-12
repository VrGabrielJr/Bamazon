var mysql = require("mysql");
var inquirer = require('inquirer');

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
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    console.log("-------------------------------------------------------------");
    console.log("-----------------------ITEMS FOR SALE------------------------");
    console.log("-------------------------------------------------------------");
    for(var i = 0; i < res.length; i++)
    {
        console.log("ITEM ID: " + res[i].item_id + " | " + 
                    "ITEM NAME: " + res[i].product_name + " | " + 
                    "DEPARTMENT: " + res[i].department_name + " | " +
                    "PRICE: " + res[i].price + " | " +
                    "QUANTITY: " + res[i].stock_quantity);
        console.log("----------------------------------------------------")
    }

    inquirer.prompt([

        {
          type: "input",
          name: "id",
          message: "What is the ID of the product they would like to buy?",
        },
        {
          type: "input",
          name: "units",
          message: "How many units of the product they would like to buy?",
        }
    ]);
    
    connection.end();
  });
}
