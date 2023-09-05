const fs = require("fs").promises;
const Product = require("../model/productClass");
const { success, failure } = require("../common");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const castCreateValidation = async (req, res, next) => {
    const message = [];
    if (!(req.body.hasOwnProperty("name") && req.body.hasOwnProperty("notable_films") &&
        req.body.hasOwnProperty("awards"))){
            message.push("You did not give all the required fields")
        }
    if(req.body.hasOwnProperty("name")){
        const namePattern = /^[A-Za-z ]+$/;
        if (!namePattern.test(req.body.name)) {
            message.push("Invalid characters in the name field");
        }
        
    }
       
        if (message.length > 0) {
            return res.status(404).send(success(message));
        }
        else {
            next();
        }
    
}
// const castUpdateValidation = async (req, res, next) => {
//     const message = [];
//     if (!(req.body.hasOwnProperty("name") || req.body.hasOwnProperty("notable_films") ||
//         req.body.hasOwnProperty("awards"))){
//             message.push("You kept the body empty")
//         }
//     if(req.body.hasOwnProperty("name")){
//         const namePattern = /^[A-Za-z ]+$/;
//         if (!namePattern.test(req.body.name)) {
//             message.push("Invalid characters in the name field");
//         }
        
//     }
       
//         if (message.length > 0) {
//             return res.status(404).send(success(message));
//         }
//         else {
//             next();
//         }
    
// }


module.exports=castCreateValidation;
