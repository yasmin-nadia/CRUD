const path = require("path");
const fs = require("fs").promises;
const Product = require("../model/productClass");
const Buyer = require("../model/buyerClass");
const Admin = require("../model/adminClass");
const { success, failure } = require("../common");
const express = require("express")
const app = express();
const { validatorController } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
class productController {
    async create(req, res, next) {
        try {
            console.log("hiiii");
            console.log(validatorController(req));

            const validation = validatorController(req).array();
            console.log("helloo", validation.length);
            if (validation.length > 0) {
                return res.status(422).send({ message: "validation error", validation });
            }
            else {
                next();
            }

        }
        catch (error) {
            console.log("catch has worked")
            return res.status(422).send({ message: "catch has worked" });

        }
    }
    async getByField(req, res) {
        // console.log(req.query);
        const jsonData = await Product.getAll();
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
        if (matchingItems.length > 0) {
            return res.status(200).send(success("All mangas' list:", matchingItems));
        } else {
            return res.status(404).send(success("Data not found"));
        }
    }
    async delete(req, res) {
        const jsonData = await Product.getAll();
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
        if (matchingItems.length == 0) {
            return res.status(404).send(success("No data found for deletion"));
        }

        if (matchingItems.length > 0) {
            const jsonData = await Product.getAll();

            for (const updatedItem of matchingItems) {
                const index = jsonData.findIndex(item => item.id === updatedItem.id);
                jsonData.splice(index, 1);

            }
            await Product.updateAll(jsonData);
            const matchingIds = matchingItems.map(item => item.id);

            fs.appendFile("./print.log", `Deleted at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Changes made in ID: ${matchingIds} \n`);
            return res.status(200).send(success("Data successfully deleted", jsonData));

        }


    }
    async update(req, res) {
        // console.log("valodation length");
        // console.log(req.query);
        // const validation = validatorController(req).array();
        // console.log("Validation length", validation.length);

        // if (validation.length > 0) {
        //     return res.status(422).send({ message: "Validation error", validation });
        // }

        const jsonData = await Product.getAll();
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
        if(matchingItems.length==0){
            return res.status(404).send(success("Data not found"));
        }


        for (const item of matchingItems) {
            for (const [key, value] of Object.entries(req.body)) {
                item[key] = value;
                console.log("Updating matching items");
            }
        }
        for (const updatedItem of matchingItems) {
            const index = jsonData.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                jsonData[index] = updatedItem;
                console.log("Updating json Data");
            }
        }
        await Product.updateAll(jsonData);
        const matchingIds = matchingItems.map(item => item.id);

        fs.appendFile("./print.log", `Updated at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Changes made in ID: ${matchingIds} \n`);
        return res.status(200).send(success("Data successfully updated", jsonData));



    }




    async post(req, res) {

        const jsonData = await Product.getAll();

        if (jsonData.length > 0) {
            const lastItem = jsonData[jsonData.length - 1];
            const newId = lastItem.id + 1;
            req.body.id = newId;
        } else {
            req.body.id = 1;
        }

        jsonData.push(req.body);
        await Product.updateAll(jsonData);
        fs.appendFile("./print.log", `Added at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM \n`);
        return res.status(404).send(success("Data successfully added", jsonData));


    }
    async getAll(req, res) {
        const jsonData = await Product.getAll();
        return res.status(200).send(success("All mangas' list:", jsonData));
    }
    async notFound(req, res) {
        return res.status(404).send(success({ message: "URL Not found" }));
    }
    async calculateDiscount(req, res) {
        const jsonData = await Product.getAll();
        const productsWithDiscount = jsonData.filter(item => item.hasOwnProperty("discount"));
        if (productsWithDiscount.length > 0) {
            const productsWithDiscountedPrice = productsWithDiscount.map(item => {
                const discountedPrice = item.price * (1 - item.discount);
                return { ...item, discountedPrice };
            });

            return res.status(200).send(success("Products with discount and discounted prices:", productsWithDiscountedPrice));
        } else {
            return res.status(404).send(success("No products with discount found"));
        }
    }
    async price(req, res) {
        const jsonData = await Product.getAll();
        jsonData.sort((a, b) => a.price - b.price);
        return res.status(200).send(success("Products sorted by price (ascending):", jsonData));
    }
    async buy(req, res) {
        console.log("Hiii")
        const jsonData = await Product.getAll();
        const jsonData2 = await Buyer.getAll();
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
        const matchingItems2 = jsonData2.filter(item => {
            if (item.id === req.body.buyer_id) {
                return true; 
            }
            return false; 
        });
        if(matchingItems.length==0){
            return res.status(404).send(success("Data not found"));
        }
        if(matchingItems2.length==0){
            return res.status(404).send(success("Buyer not found"));
        }
        console.log("nadia",matchingItems);
        console.log("yasmin",matchingItems2);

        console.log(jsonData2);
        const itemIndex = jsonData.findIndex(item => item.id === matchingItems[0].id);
        const itemIndex2 = jsonData2.findIndex(item => item.id === matchingItems2[0].id);
        console.log("itemIndex2",itemIndex2)
        if (itemIndex === -1) {
            console.log("Hii")
            return res.status(404).send(success("Product not found"));
        }
        if (itemIndex2 === -1) {
            console.log("Hii")
            return res.status(404).send(success("Buyer not found"));
        }

        const selectedItem = jsonData[itemIndex];
        const selectedItem2 = jsonData2[itemIndex2];

        if (selectedItem.stock === 0) {
            return res.status(400).send(failure("Out of stock"));
        }

        if (selectedItem.stock < req.body.amount) {
            return res.status(400).send(failure("Insufficient stock"));
        }

        selectedItem.stock -= req.body.amount;
        selectedItem2.mangas.push(selectedItem.id);
        await Product.updateAll(jsonData);
        await Buyer.updateAll(jsonData2);

        fs.appendFile("./print.log", `Purchase at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Product ID:${matchingItems[0].id} Quantity: ${req.body.amount} \n`);
        return res.status(200).send(success(`Purchase successful. ${req.body.amount} items of Product ID ${matchingItems[0].id} have been bought by ${matchingItems2[0].name}.`));

    }


    async addStock(req,res) {
        const jsonData = await Product.getAll();
        const jsonData2 = await Admin.getAll();
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
        const matchingItems2 = jsonData2.filter(item => {
            if (item.id === req.body.admin_id) {
                return true; 
            }
            return false; 
        });
        if(matchingItems.length==0){
            return res.status(404).send(success("Manga not found"));
        }
        if(matchingItems2.length==0){
            return res.status(404).send(success("Admin not found"));
        }
        const itemIndex = jsonData.findIndex(item => item.id === matchingItems[0].id);
        const itemIndex2 = jsonData2.findIndex(item => item.id === matchingItems2[0].id);

        if (itemIndex === -1) {
            console.log("Hii")
            return res.status(404).send(success("Manga not found"));
        }
        if (itemIndex2 === -1) {
            console.log("Hii")
            return res.status(404).send(success("Admin not found"));
        }

        const selectedItem = jsonData[itemIndex];
        selectedItem.stock+=req.body.amount;
        await Product.updateAll(jsonData);

        fs.appendFile("./print.log", `Stock added at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Product ID:${matchingItems[0].id} Quantity: ${req.body.amount} \n`);
        return res.status(200).send(success(`Stock addition successful. ${req.body.amount} items of Product ID ${matchingItems[0].id} have been added by ${matchingItems2[0].name}.`));

    }
    async rating(req,res){
        const jsonData = await Product.getAll();
        const jsonData2 = await Buyer.getAll();
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
        if(matchingItems.length==0){
            return res.status(404).send(success("Manga not found"));
        }
        
        const matchingItems2 = jsonData2.filter(item => {
            if (item.id === req.body.buyer_id) {
                return true; 
            }
            return false; 
        });
        if(matchingItems2.length==0){
            return res.status(404).send(success("Buyer not found"));
        }
        const itemIndex = jsonData.findIndex(item => item.id === matchingItems[0].id);
        const itemIndex2 = jsonData2.findIndex(item => item.id === matchingItems2[0].id);
       

        if (itemIndex === -1) {
            console.log("Hii")
            return res.status(404).send(success("Manga not found"));
        }
        if (itemIndex2 === -1) {
            console.log("Hii")
            return res.status(404).send(success("Buyer not found"));
        }

        const selectedItem = jsonData[itemIndex];
        const selectedItem2 = jsonData2[itemIndex2];
        if (!selectedItem.rate){
            selectedItem.rate=req.body.rate;
        }
        else{
            selectedItem.rate=(selectedItem.rate+req.body.rate)/2;
        }
        await Product.updateAll(jsonData);

        fs.appendFile("./print.log", `Rating updated at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Product ID:${matchingItems[0].id} Quantity: ${req.body.rate} \n`);
        return res.status(200).send(success(`Rating updation successful. ${matchingItems2[0].name} rated Product ID ${matchingItems[0].id} as ${req.body.rate} . New rating is ${selectedItem.rate} now`));

    }
    async addDiscount(req,res){
        const jsonData = await Product.getAll();
        const jsonData2 = await Admin.getAll();
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
        const matchingItems2 = jsonData2.filter(item => {
            if (item.id === req.body.admin_id) {
                return true; 
            }
            return false; 
        });
        if(matchingItems.length==0){
            return res.status(404).send(success("Manga not found"));
        }
        if(matchingItems2.length==0){
            return res.status(404).send(success("Admin not found"));
        }
        const itemIndex = jsonData.findIndex(item => item.id === matchingItems[0].id);
        const itemIndex2 = jsonData2.findIndex(item => item.id === matchingItems2[0].id);

        if (itemIndex === -1) {
            console.log("Hii")
            return res.status(404).send(success("Manga not found"));
        }
        if (itemIndex2 === -1) {
            console.log("Hii")
            return res.status(404).send(success("Admin not found"));
        }

        const selectedItem = jsonData[itemIndex];
        selectedItem.discount = req.body.discount;
        jsonData[itemIndex] = selectedItem;
        await Product.updateAll(jsonData);
        console.log("Selected Item",selectedItem)

        return res.status(200).send(success(`Discount updated successfully ${selectedItem.discount} by ${matchingItems2[0].name} `));
    
    }
    catch(error) {
        console.error(error);
        return res.status(500).send(failure("Internal server error"));
    }

}
module.exports = new productController();