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
const jsonwebtoken = require("jsonwebtoken")
const moment = require('moment');

class loginController {
    async signUp(req, res) {
        try {
            const validation = validationResult(req).array()
            if (validation.length > 0) {
                return res.status(200).send(success("Failed to validate the data", validation));
            }
            const { email, password, name, phone, address, role } = req.body;
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
                    role: role

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

            const { email, password, role } = req.body;
            const auth = await authModel.findOne({ email: email });
            if (!auth) {

                return res.status(400).send(success("User is not registered"));

            }
            if (auth.blocked) {
                const now = moment();
                const lastUnsuccessfulLoginTime = moment(auth.loginAttempts[auth.loginAttempts.length - 1].timestamp);


                if (now.diff(lastUnsuccessfulLoginTime, 'minutes') >= 1) {
                    auth.blocked = false; 
                    auth.loginAttempts = []; 
                    await auth.save();
                } else {
                    return res.status(403).send(success("User is blocked."));
                }
            }
            const checkedPassword = await bcrypt.compare(password, auth.password)
            if (checkedPassword) {

                if (auth.role === role) {
                    const creden = await authModel.findOne({ email: email }).populate("id");
                    // console.log("creden", creden);
                    // return res.status(200).send(success("Login successful", creden));
                    const responseAuth = creden.toObject();
                    delete responseAuth.password;
                    const jwt = jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY, { expiresIn: "1h" });
                    responseAuth.token = jwt;
                    return res.status(200).send(success("Successfully logged in", responseAuth));
                } else {
                    return res.status(400).send(success("Invalid Role"));
                }
            }
            else {
                const now = moment();
                const lastHour = moment().subtract(1, 'hours');
                console.log("lastHour", lastHour, "now", now)
                const recentLoginAttempts = auth.loginAttempts.filter((attempt) => moment(attempt.timestamp).isAfter(lastHour));

                if (recentLoginAttempts.length >= 5) {
                    auth.blocked = true;
                    await auth.save();
                    fs.appendFile("./print.log", `User blocked for logging in with incorrect credentials at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM for ${recentLoginAttempts.length} times \n`);

                    return res.status(403).send(success("User is blocked due to too many unsuccessful login attempts."));
                }

                auth.loginAttempts = recentLoginAttempts;
                auth.loginAttempts.push({ timestamp: now });
                await auth.save();
                fs.appendFile("./print.log", `Logged with incorrect credentials at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM for ${auth.loginAttempts.length } times \n`);
                return res.status(400).send(success("Incorrect credentials"));
            }



        }
        catch (error) {
            console.log("Login error", error)
            return res.status(400).send(success("Could not login"));
        }

    }
}

module.exports = new loginController();