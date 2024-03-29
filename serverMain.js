const express = require("express");
const app = express();
const { success, failure } = require("./common");
const productRouter = require("./route/productRouter");
const dotenv = require("dotenv");
const cors=require("cors");
const databaseConnection=require("./database");

dotenv.config()
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:"*"}))
app.use("/products", productRouter);
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status == 400 && "body" in err) {
        return res.status(400).send({ message: "You did not provide the right syntax" });
    }
    
}
);
databaseConnection(()=>{
    app.listen(8001, () => {
        console.log(process.env.TEST_DB);
        console.log("Server is running on port 8001");
    })
})


