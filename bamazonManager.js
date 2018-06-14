var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');
var validator = require('validator');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: 'bamazon'
})

// Prompts User or Menu Option
function prompt() {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "Select one of the following menu options",
                choices: ["View Products for Sale",
                        "View Low Inventory",
                        "Add to Inventory",
                        "Add New Product",
                        "Exit"],
                name: "input"
            }
        ]
    ) // end inquirer function
    .then(function(res) {
        switch (res.input) {
            case "View Products for Sale":
                display();
                break;
            
            case "View Low Inventory":
                lowInventory();
                break;
            
            case "Add to Inventory":
                addInv();
                break;
            
            case "Add New Product":
                addPro();
            
            default:
                console.log("You have now Exited the program");
                connection.end();
        }
    }) // .then function end
} // end Prompt function

function display() {
    //Collects all Row Data for display
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "DEPARTMENT", "ITEM NAME", "PRICE", "QUANTITY"],
            colWidths: [5, 15, 30, 10, 10] 
        });

        console.log("------------------------------------------------------------------------------------")
        console.log("---------------------------------ITEMS FOR SALE-------------------------------------")
        console.log("------------------------------------------------------------------------------------")

        // Pushes Data from Query Response to array
        for (var i = 0; i < res.length; i++) {
            table.push(
            [res[i].item_id, res[i].department_name, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        }
        // Display table with appropriate data
        console.log(table.toString());
        prompt();
    })
}

function lowInventory() {

    
}

function addInv() {

}

function addPro() {

}

prompt();