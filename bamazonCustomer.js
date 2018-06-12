var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("Item ID ---- Item Name ---- Department ---- Price ---- Stock");
    console.log("-------------------------------------------------------------");

    for(var i = 0; i < res.length; i++)
    {
        console.log(res[i].item_id + " | " + 
                    res[i].product_name + " | " + 
                    res[i].department_name + " | " +
                    res[i].price + " | " +
                    res[i].stock_quantity);
        console.log("----------------------------------------------------")
    }
    
    connection.end();
  });
}
