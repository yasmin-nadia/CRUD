const express=require("express");
const routes=express();
const productController = require("../controller/productController");
const {createValidationUpdate,createValidation}=require("../middleware/validation");

routes.get("/all", productController.getAll);
routes.get("/field", productController.getByField);
routes.delete("/delete", productController.delete);
routes.put("/update", createValidationUpdate, productController.update);
routes.post("/post", createValidation, productController.post);
routes.get("/discount",productController.calculateDiscount);
routes.get("/price",productController.price);
routes.use(productController.notFound);
module.exports=routes;