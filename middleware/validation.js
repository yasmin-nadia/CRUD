
const fs = require("fs").promises;
const Product = require("../model/productClass");
const { success, failure } = require("../common");
const express = require("express")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const createValidation = async (req, res, next) => {
    const message = [];
    const jsonData = await Product.getAll();
    if (req.body.hasOwnProperty("name") && req.body.hasOwnProperty("stock") &&
        req.body.hasOwnProperty("price") &&
        req.body.hasOwnProperty("author")
    ) {
        const namePattern = /^[A-Za-z ]+$/;
        if (!namePattern.test(req.body.author)) {
            message.push("Invalid characters in the author field");
        }
        if (req.body.stock <= 0 || req.body.price <= 0) {
            message.push("Stock and price must be greater than 0");
        }
        const nameExists = jsonData.some(item => item.name === req.body.name);

        if (nameExists) {
            message.push("Given name already exists");
        }
        if (message.length > 0) {
            return res.status(404).send(success(message));
        }
        else {
            next();
        }
    }
    else {

        return res.status(404).send(success("All fields have not been provided"));



    }
};
const createValidationUpdate = async (req, res, next) => {
    console.log(req.query);
    const jsonData = await Product.getAll();
    const message = [];
    const matchingItems = jsonData.filter(item => {
        for (const [param, value] of Object.entries(req.query)) {
            if (typeof item[param] === 'number') {
                if (item[param] !== parseFloat(value)) {
                    return false;
                }
            } else if (item[param] !== value) {
                return false;
            }
        }
        return true;
    });
    if (req.body.hasOwnProperty("name")&&(matchingItems.length>1)){
        message.push("You cannot update multiple data with the same name");

    }
    const namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(req.body.author)) {
        message.push("Invalid characters in the author field");
    }
    if (req.body.stock <= 0 || req.body.price <= 0) {
        message.push("Stock and price must be greater than 0");
    }
    const nameExists = jsonData.some(item => item.name === req.body.name);

    if (nameExists) {
        message.push("Given name already exists");
    }
    if (message.length > 0) {
        return res.status(404).send(success(message));
    }
    else {
        next();
    }
}

module.exports = {createValidation,createValidationUpdate};