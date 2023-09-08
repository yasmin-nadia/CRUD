const jsonwebtoken = require("jsonwebtoken")
const { success, failure } = require("../common");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");

const validateObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);

const isValidManga = (manga) => {
    return (
        manga.hasOwnProperty("id") &&
        validateObjectId(manga.id) &&
        manga.hasOwnProperty("quantity") &&
        Number.isInteger(manga.quantity) &&
        manga.quantity > 0
    );
};

const cartValidator = (req, res, next) => {
    try {
        const { user, mangas } = req.body;
        const message = [];

      
        if (!validateObjectId(user.id)) {
            message.push("Invalid user ID");
        }


        if (!Array.isArray(mangas) || mangas.length === 0) {
            message.push("Mangas should be a non-empty array");
        } else {
            for (const manga of mangas) {
                if (!isValidManga(manga)) {
                    message.push("Invalid manga object");
                    break;
                }
            }
        }

        if (message.length > 0) {
            return res.status(400).send(failure(message.join(", ")));
        } else {
            next();
        }
    }
    catch (error) {
        console.log("Error while validating", error)
        return res.status(400).send(failure("Internal sever error"));
    }

};
const checkoutValidator = (req, res, next) => {
    const { user } = req.body;
    const message = [];

    try {
        // Check if user.id is a valid MongoDB ObjectId
        if (!validateObjectId(user.id)) {
            message.push("Invalid user ID");
        }
        if (message.length > 0) {
            return res.status(400).send(failure(message.join(", ")));
        } else {
            next();
        }
    }

    catch (error) {
        console.log("Error while validating", error)
        return res.status(400).send(failure("Internal sever error"));
    }

}

module.exports = { cartValidator,checkoutValidator };
