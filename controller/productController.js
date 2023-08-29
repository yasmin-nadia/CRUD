const path = require("path");
const fs = require("fs").promises;
const Product = require("../model/productClass");
const { success, failure } = require("../common");
const express = require("express")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
class productController {
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
        console.log(req.query);
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
}
module.exports = new productController();