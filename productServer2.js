const path = require("path");
const fs = require("fs").promises;
const Product = require("./productClass");
const { success, failure } = require("./common");
const express = require("express")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products/all", async (req, res) => {
    // console.log(req);
    const jsonData = await Product.getAll();
    return res.status(200).send(success("All mangas' list:", jsonData));
});
app.get("/products/field", async (req, res) => {
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
    if (matchingItems.length > 0) {
        return res.status(200).send(success("All mangas' list:", matchingItems));
    } else {
        return res.status(404).send(success("Data not found"));
    }
});

app.put("/products/update", async (req, res) => {
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
    if (matchingItems.length == 0) {
        return res.status(404).send(success("Data not found"));
    }
    const message = [];
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
    if (message.length==0) {
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
    else {
        return res.status(404).send(success(message));
    }


});

app.delete("/products/delete", async (req, res) => {
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

});

app.post("/products/post", async (req, res) => {
    console.log(req.query);
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
        if (message.length == 0) {
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
        else {
            return res.status(404).send(success(message));

        }

    }

    
    else {
        return res.status(404).send(success("All fields have not been provided"));

    }

});
app.get("/products/price", async (req, res) => {
    const jsonData = await Product.getAll();
    jsonData.sort((a, b) => a.price - b.price);
    return res.status(200).send(success("Products sorted by price (ascending):", jsonData));
    
})

app.get("/products/discount", async (req, res) => {
    const jsonData = await Product.getAll();
    const productsWithDiscount = jsonData.filter(item => item.hasOwnProperty("discount"));

    // if (productsWithDiscount.length > 0) {
    //     return res.status(200).send(success("Products with discount:", productsWithDiscount));
    // } else {
    //     return res.status(404).send(success("No products with discount found"));
    // }
    if (productsWithDiscount.length > 0) {
        const productsWithDiscountedPrice = productsWithDiscount.map(item => {
            const discountedPrice = item.price * (1 - item.discount);
            return { ...item, discountedPrice };
        });

        return res.status(200).send(success("Products with discount and discounted prices:", productsWithDiscountedPrice));
    } else {
        return res.status(404).send(success("No products with discount found"));
    }
    
})

app.use((req, res) => {
    return res.status(404).send(success({ message: "URL Not found" }));
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})