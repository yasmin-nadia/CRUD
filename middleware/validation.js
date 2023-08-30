
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
    if (req.body.hasOwnProperty("name") && (matchingItems.length > 1)) {
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
const createValidationStock = async (req, res, next) => {
    const message = [];

    const allowedKeys = ["buyer_id", "amount"];
    const bodyKeys = Object.keys(req.body);

    if (!bodyKeys.every(key => allowedKeys.includes(key))) {
        message.push("Please provide only 'buyer_id' and 'amount' in the request body");
    }


    if (!isNaN(req.body.amount)) {
        const amount = parseInt(req.body.amount);
        if (!Number.isInteger(amount)) {
            message.push("'amount' has to be an integer");
        }
        else if(amount<=0){
            
            message.push("'amount' has to be greater than 0");
        }
    } else {
        message.push("'amount' has to be in number format");
    }

    if (!isNaN(req.body.buyer_id)) {
        const buyerId = parseInt(req.body.buyer_id);
        if (!Number.isInteger(buyerId)) {
            message.push("'buyer_id' has to be an integer");
        }
    } else {
        message.push("'buyer_id' has to be in number format");
    }

    if (message.length > 0) {
        return res.status(400).send({ message: message.join(", ") });
    } else {
        next();
    }
}
const createValidationAddStock = async (req, res, next) => {
    const message = [];

    const allowedKeys = ["admin_id", "amount"];
    const bodyKeys = Object.keys(req.body);

    if (!bodyKeys.every(key => allowedKeys.includes(key))) {
        message.push("Please provide only 'admin_id' and 'amount' in the request body");
    }


    if (!isNaN(req.body.amount)) {
        const amount = parseInt(req.body.amount);
        if (!Number.isInteger(amount)) {
            message.push("'amount' has to be an integer");
        }
    } else {
        message.push("'amount' has to be in number format");
    }

    if (!isNaN(req.body.admin_id)) {
        const buyerId = parseInt(req.body.admin_id);
        if (!Number.isInteger(buyerId)) {
            message.push("'admin_id' has to be an integer");
        }
    } else {
        message.push("'admin_id' has to be in number format");
    }

    if (message.length > 0) {
        return res.status(400).send({ message: message.join(", ") });
    } else {
        next();
    }
}
const createValidationRating = async (req, res, next) => {
    const message = [];

    const allowedKeys = ["buyer_id", "rate"];
    const bodyKeys = Object.keys(req.body);

    if (!bodyKeys.every(key => allowedKeys.includes(key))) {
        message.push("Please provide only 'buyer_id' and 'rating' in the request body");
    }


    if (!isNaN(req.body.rate)) {
        const rate = parseInt(req.body.rate);
        if (!Number.isInteger(rate)) {
            message.push("'rate' has to be an integer");
        }
    } else {
        message.push("'rate' has to be in number format");
    }

    if (!isNaN(req.body.buyer_id)) {
        const buyerId = parseInt(req.body.buyer_id);
        if (!Number.isInteger(buyerId)) {
            message.push("'buyer_id' has to be an integer");
        }
        else if (req.body.rate < 0 || req.body.rate> 5) {
            message.push("'rate' has to be between 0 and 5");
        }
    } else {
        message.push("'buyer_id' has to be in number format");
    }

    if (message.length > 0) {
        return res.status(400).send({ message: message.join(", ") });
    } else {
        next();
    }
}

const createValidationDiscount= async (req, res, next) => {
    const message = [];

    const allowedKeys = ["admin_id", "discount"];
    const bodyKeys = Object.keys(req.body);

    if (!bodyKeys.every(key => allowedKeys.includes(key))) {
        message.push("Please provide only 'admin_id' and 'discount' in the request body");
    }


    if (!isNaN(req.body.discount)) {
        const rate = parseInt(req.body.discount);
        if (!Number.isInteger(rate)) {
            message.push("'discount' has to be an integer");
        }
    } else {
        message.push("'discount' has to be in number format");
    }

    if (!isNaN(req.body.admin_id)) {
        const buyerId = parseInt(req.body.admin_id);
        if (!Number.isInteger(buyerId)) {
            message.push("'admin_id' has to be an integer");
        }
        else if (req.body.discount < 0 || req.body.discount> 1) {
            message.push("'discount' has to be between 0 and 1");
        }
    } else {
        message.push("'admin_id' has to be in number format");
    }

    if (message.length > 0) {
        return res.status(400).send({ message: message.join(", ") });
    } else {
        next();
    }
}


module.exports = { createValidation, createValidationUpdate, createValidationStock, createValidationRating ,createValidationAddStock,createValidationDiscount};