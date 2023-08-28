const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const Product = require("./productClass");
const { success, failure } = require("./common");
const server = http.createServer(async function (req, res) {

    if (req.url === "/products/all" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });

        const jsonData = await Product.getAll();
        res.end(success("All mangas' list:", jsonData));

    }
    else if (req.method === "GET" && req.url.split("?")[0] == "/products/field") {
        const getQueryParams = () => {
            const params = new URLSearchParams(req.url.split("?")[1]);
            // console.log(params)
            const queryParams = {};
            for (const [param, value] of params.entries()) {
                queryParams[param] = value;
            }
            return queryParams;
        }
        try {
            const queryParams = getQueryParams();
            console.log(queryParams);
            res.writeHead(200, { "Content-Type": "application/json" });
            // const data = await fs.readFile(path.join(__dirname, "product.json"), "utf-8");
            const jsonData = await Product.getAll();
            // jsonData = JSON.parse(data);
            console.log(jsonData);
            let result;
            console.log(queryParams);
            const matchingItems = jsonData.filter(item => {
                for (const [param, value] of Object.entries(queryParams)) {
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
            console.log("hello", matchingItems);

            if (matchingItems.length > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                // res.end(JSON.stringify(matchingItems));
                res.end(success("Found", matchingItems));
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                // res.end("Data not found");
                res.end(failure("Data not found"));
            }
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end(failure("Can't be parsed"));
            // res.end("Can't be parsed");
        }



    }
    else if (req.method === "GET" && req.url.split("?")[0] == "/products/stock") {
        const getQueryParams = () => {
            const params = new URLSearchParams(req.url.split("?")[1]);
            // console.log(params)
            const queryParams = {};
            for (const [param, value] of params.entries()) {
                queryParams[param] = value;
            }
            return queryParams;
        }
        try {
            const queryParams = getQueryParams();
            console.log(queryParams);
            res.writeHead(200, { "Content-Type": "application/json" });
            // const data = await fs.readFile(path.join(__dirname, "product.json"), "utf-8");
            const jsonData = await Product.getAll();
            // jsonData = JSON.parse(data);
            console.log(jsonData);
            let result;
            console.log(queryParams);
            const matchingItems = jsonData.filter(item => {
                if (item['stock'] >= parseFloat(queryParams.stock)) {
                    return true;
                }
                else {
                    return false;
                }


            });
            console.log("hello", matchingItems);

            if (matchingItems.length > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                // res.end(JSON.stringify(matchingItems));
                res.end(success("Available datas in stock", matchingItems));
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                // res.end("Data not found");
                res.end(failure("Data not found"));
            }
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end(failure("Can't be parsed"));
            // res.end("Can't be parsed");
        }



    }

    else if (req.url.split("?")[0] === "/products/update" && req.method === "PUT") {
        const getQueryParams = () => {
            const params = new URLSearchParams(req.url.split("?")[1]);
            // console.log(params)
            const queryParams = {};
            for (const [param, value] of params.entries()) {
                queryParams[param] = value;
            }
            return queryParams;
        }
        try {

            const queryParams = getQueryParams();

            console.log(queryParams);
            res.writeHead(200, { "Content-Type": "application/json" });
            const data = await fs.readFile(path.join(__dirname, "product.json"), "utf-8");
            // jsonData = JSON.parse(data);
            // console.log(jsonData);
            const jsonData = await Product.getAll();
            let result;
            console.log(queryParams);
            const matchingItems = jsonData.filter(item => {
                for (const [param, value] of Object.entries(queryParams)) {
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
            console.log("hello", matchingItems);

            if (matchingItems.length > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                // do the update
                body = "";
                req.on("data", (buffer) => {
                    body += buffer;
                });
                req.on("end", async () => {
                    console.log("Helloooooooooo", body);

                    const jsonData = JSON.parse(data);
                    body_obj = JSON.parse(body);
                    // if (Object.keys(body_obj).length === 0) {
                    if (body_obj.stock <= 0 || body_obj.price <= 0) {
                        console.log("Stock and/or price must be greater than 0");
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(failure("Stock and/or price must be greater than 0"));
                        return;
                    }
                    if (body === "") {
                        // if (body === null) {
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        console.log("Hiiii", body_obj);
                        // res.end(JSON.stringify({ message: "No value has been given to update" }));
                        res.end(failure("No value has been given to update"));
                        return;
                    }
                    if (body_obj.hasOwnProperty("author")) {
                        const namePattern = /^[A-Za-z ]+$/;
                        if (!namePattern.test(body_obj.author)) {
                            res.writeHead(400, { "Content-Type": "application/json" });
                            res.end(failure("Invalid characters in the author field"));

                            return;

                        }
                    }
                    if (body_obj.hasOwnProperty("name")) {
                        for (const item of matchingItems) {
                            for (const [key, value] of Object.entries(body_obj)) {
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
                        console.log(body_obj)
                        console.log(jsonData)
                    }
                    else {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        console.log("Name not given");
                        // res.write(JSON.stringify({ message: "Name field has not been provided" }));
                        res.end(failure("Name field has not been provided"));

                    }

                    try {
                        // await fs.writeFile(path.join(__dirname, "product.json"), JSON.stringify(jsonData));
                        await Product.updateAll(jsonData);
                        // console.log("try is working")

                        res.writeHead(200, { "Content-Type": "application/json" });
                        // res.end(JSON.stringify({ message: "Successfully updated", data: jsonData }));
                        res.end(success("Data Successfully updated", jsonData));
                        const matchingIds = matchingItems.map(item => item.id);

                        fs.appendFile("./print.log", `Updated at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Changes made in ID: ${matchingIds} \n`);
                    }



                    catch (err) {
                        // console.log("catch is working")
                        console.error("Error parsing JSON:", err);
                        console.error("Additional information:", err.stack);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        // res.end(JSON.stringify({ message: "File not found" }));
                        res.end(failure("File not found"));
                    }



                });
                // res.end(JSON.stringify(jsonData));
                // res.end(success("Updated", jsonData));
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                // res.end("Data not found");
                res.end(failure("Data not found"));

            }
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Can't be parsed");
        }


    }
    else if (req.url.split("?")[0] === "/products/delete" && req.method === "DELETE") {
        const getQueryParams = () => {
            const params = new URLSearchParams(req.url.split("?")[1]);
            // console.log(params)
            const queryParams = {};
            for (const [param, value] of params.entries()) {
                queryParams[param] = value;
            }
            return queryParams;
        }

        try {
            const queryParams = getQueryParams();
            console.log(queryParams);
            res.writeHead(200, { "Content-Type": "application/json" });
            const data = await fs.readFile(path.join(__dirname, "product.json"), "utf-8");
            const jsonData = await Product.getAll();
            let result;
            console.log(queryParams);
            const matchingItems = jsonData.filter(item => {
                for (const [param, value] of Object.entries(queryParams)) {
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
            // console.log("hello", matchingItems);

            if (matchingItems.length > 0) {
                // console.log("This is working");
                res.writeHead(200, { "Content-Type": "application/json" });

                // console.log("This is working tooo");
                const jsonData = JSON.parse(data);

                for (const updatedItem of matchingItems) {
                    console.log("whatttt", updatedItem)
                    const index = jsonData.findIndex(item => item.id === updatedItem.id);
                    console.log("Index: ", index)

                    jsonData.splice(index, 1);
                    console.log("Deleting json Data");

                }

                // console.log(jsonData, "heuyyyyyyyy")



                // await fs.writeFile(path.join(__dirname, "product.json"), JSON.stringify(jsonData));
                await Product.updateAll(jsonData);
                // console.log("try is working")

                res.writeHead(200, { "Content-Type": "application/json" });
                // res.end(JSON.stringify({ message: "Successfully updated", data: jsonData }));
                res.end(success("Data Successfully Deleted", jsonData));
                const matchingIds = matchingItems.map(item => item.id);

                fs.appendFile("./print.log", `Deleted at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM, Changes made in ID: ${matchingIds} \n`);
            }



            else {
                // console.log("catch is working")
                // console.error("Error parsing JSON:", err);
                // console.error("Additional information:", err.stack);
                res.writeHead(400, { "Content-Type": "application/json" });
                // res.end(JSON.stringify({ message: "File not found" }));
                res.end(failure("No such data exists"));
            }




            // res.end(JSON.stringify(jsonData));
            // res.end(success("Updated", jsonData));


        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Can't be parsed");
        }


    }
    else if (req.url === "/products/post" && req.method === "POST") {
        res.writeHead(200, { "Content-Type": "application/json" });

        const jsonData = await Product.getAll();

        body = "";
        req.on("data", (buffer) => {
            console.log("Body got")
            body += buffer;
        });
        req.on("end", async () => {

            body_obj = JSON.parse(body);
            if (body_obj.hasOwnProperty("name") && body_obj.hasOwnProperty("stock") &&
                body_obj.hasOwnProperty("price") &&
                body_obj.hasOwnProperty("author")
            ) {
                const namePattern = /^[A-Za-z ]+$/;
                if (!namePattern.test(body_obj.author)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(failure("Invalid characters in the author field"));

                    return;

                }
                if (body_obj.stock <= 0 || body_obj.price <= 0) {
                    console.log("Stock and/or price must be greater than 0");
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end(failure("Stock and/or price must be greater than 0"));
                    return;
                }
                if (jsonData.length > 0) {
                    const lastItem = jsonData[jsonData.length - 1];
                    const newId = lastItem.id + 1;
                    body_obj.id = newId;
                } else {
                    body_obj.id = 1;
                }
                jsonData.push(body_obj);
            }
            else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "All field have not been provided" }));
                return res.end();

            }

            try {
                await Product.updateAll(jsonData);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Successfully added", data: jsonData }));
                fs.appendFile("./print.log", `Added at ${(new Date().getHours())}:${new Date().getMinutes()}:${new Date().getSeconds()} PM \n`);
            }



            catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "File not found" }));
            }


        });

    }








    else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        // res.end("URL is incorrect");
        res.end(failure("URL is incorrect"));
    }




});


server.listen(8000, () => {
    console.log("Server is running on 8000...");
});