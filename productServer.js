const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const Product = require("./model/productClass");
const { success, failure } = require("./common");
const server = http.createServer(async function (req, res) {

    if (req.url === "/products/all" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });

        const jsonData = await Product.getAll();
        res.end(success("All mangas' list:", jsonData));

    }
     else if (req.method === "GET" && req.url.split("?")[0]=="/products/field") {
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

    else if (req.url.split("?")[0] === "/products/update" && req.method === "PUT" ) {
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
                    // const jsonData = JSON.parse(data);
                    body_obj = JSON.parse(body);
                    if (Object.keys(body_obj).length === 0) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "No value has been given to update" }));
                        return;
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
                        res.writeHead(500, { "Content-Type": "application/json" });
                        console.log("Name not given");
                        // res.write(JSON.stringify({ message: "Name field has not been provided" }));
                        res.end(failure("Name field has not been provided"));

                    }

                    try {
                        // await fs.writeFile(path.join(__dirname, "product.json"), JSON.stringify(jsonData));
                        await Product.updateAll(jsonData);
                        // console.log("try is working")

                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Successfully added", data: jsonData }));
                        fs.appendFileSync("./print.log", `Updated at ${(new Date().getHours()) }:${new Date().getMinutes()}:${new Date().getSeconds()} PM \n`);
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
                res.end(success("Updated", jsonData));
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
    else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        // res.end("URL is incorrect");
        res.end(failure("URL is incorrect"));
    }




});


server.listen(8000, () => {
    console.log("Server is running on 8000...");
});