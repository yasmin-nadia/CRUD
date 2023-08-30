const express=require("express");
const routes=express();
const productController = require("../controller/productController");
const {createValidation,createValidationUpdate,createValidationStock,createValidationRating,createValidationAddStock,createValidationDiscount} =require("../middleware/validation");

routes.get("/all", productController.getAll);
routes.get("/field", productController.getByField);
routes.delete("/delete", productController.delete);
// routes.put("/update", validatorRules.create, productController.create, productController.update);
routes.put("/update", createValidationUpdate, productController.update);
routes.post("/post", createValidation, productController.post);
routes.get("/discount",productController.calculateDiscount);
routes.get("/price",productController.price);
routes.get("/buy",createValidationStock,productController.buy);
routes.put("/addstock",createValidationAddStock,productController.addStock);
routes.put("/rate",createValidationRating,productController.rating);
routes.put("/adddiscount",createValidationDiscount,productController.addDiscount);
routes.use(productController.notFound);
module.exports=routes;