var inquirer = require("inquirer");
var mysql = require("mysql");
var mySqlCommand = "Select genre from songs where genre = 'Classic Rock'"

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: 'playlistDB'
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
                        "Add New Product"],
                name: "input"
            }
        ]
    ) // end inquirer function
    .then(function(res) {
        switch (res.input) {
            case "View Products for Sale":
                sale();
                break;
            
            case "View Low Inventory":
                lowInventory();
                break;
            
            case "Add to Inventory":
                addInv();
                break;
            
            default:
                addPro();
        }
    }) // .then function end
} // end Prompt function

function sale() {

}

function lowInventory() {

}

function addInv() {

}

function addPro() {
    
}

prompt();