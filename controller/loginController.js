const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../common");
const userModel = require("../model/user2")
const authModel = require("../model/auth")
const express = require("express")
const app = express();
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
class loginController {
    async signUp(req, res) {
        try {
            const validation = validationResult(req).array()
            if (validation.length > 0) {
                return res.status(200).send(success("Failed to validate the data", validation));
            }
            const { email, password, name, phone, address } = req.body;
            const existingUser = await authModel.findOne({ email: email });
            if (existingUser) {
                return res.status(200).send(success("Email is already registered"));
            }

            console.log("password", password)
            const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {

                return hash;

            })
            console.log(hashedPassword)
            const result = await userModel.create({
                
                    email: email,
                    name: name,
                    phone: phone,
                    address: address
               
            })
            console.log("Resulttt", result)
            if (result) {
                console.log("result._id", result._id)
                const result2 = await authModel.create({
                    email: email,
                    password: hashedPassword,
                    id: result._id,

                })
                if (!result2) {
                    return res.status(200).send(success("Failed to store user information", result2));
                }
                console.log("result", result)
                console.log("result2", result2)
                return res.status(200).send(success("Authentication succeeded", result));
            }
            else {
                return res.status(200).send(success("Authentication has not been succeeded"));
            }


        }
        catch (error) {
            console.log("The error is", error)
            return res.status(400).send(success("Internal server error"));
        }

    }
    async login(req, res) {
        try {

            const { email, password } = req.body;
            const auth = await authModel.findOne({ email: email });
            if (!auth) {

                return res.status(400).send(success("User is not registered"));

            }
            const checkedPassword = await bcrypt.compare(password, auth.password)
            if (checkedPassword) {
                const creden = await authModel.find({email:email}).populate("id");
                
                console.log("creden",creden);
                return res.status(400).send(success("Login successful",creden));
            }
            else {
                return res.status(400).send(success("Invalid Credentials"));
            }
        }
        catch(error){
            console.log("Login error",error)
            return res.status(400).send(success("Could not login"));
        }

    }
}

module.exports = new loginController();