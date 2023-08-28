const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");
const server = http.createServer(function (req, res) {
    if (req.url === "/products/all" && req.method === "POST") {
            res.writeHead(200, { "Content-Type": "application/json" });
            fs.readFile(path.join(__dirname, "product.json"), (err, data) => {
                if (!err) {
                    body = "";
                    req.on("data", (buffer) => {
                        body += buffer;
                    });
                    req.on("end", async() => {
                        const jsonData = JSON.parse(data);
                        body_obj = JSON.parse(body);
                        if (body_obj.hasOwnProperty("name")) {
                            if (jsonData.length > 0) {
                                const lastItem = jsonData[jsonData.length - 1];
                                const newId = lastItem.id + 1;
                                body_obj.id = newId;
                            } else {
                                body_obj.id = 1;
                            }
                            jsonData.push(body_obj);
                        }
                        else{
                            res.writeHead(400, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ message: "Name field has not been provided" }));
                            return res.end();

                        }
                        
                        try {
                            await fs.promises.writeFile(path.join(__dirname, "product.json"), JSON.stringify(jsonData));
                           
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "Successfully added", data: jsonData }));
                            fs.appendFileSync("./print.log",`Updated at ${(new Date().getHours())-12}:${new Date().getMinutes()}:${new Date().getSeconds()} PM \n`);
                        }



                           catch (err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "File not found" }));
                          }


                    });

                }
                
            });
        }

        else{
            res.writeHead(500, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "Wrong URL" }));
            return res.end();


        }

        // req.on("end",()=>{
        // console.log(JSON.parse(body).title);

});
server.listen(8000, () => {
    console.log("Server is running on 8000...");
});



