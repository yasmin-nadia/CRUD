const express=require("express");
const routes=express();

const productController = require("../controller/productController");
const castController = require("../controller/castController");
const {createValidation,createValidationUpdate,createValidationStock,createValidationRating,createValidationAddStock,createValidationDiscount} =require("../middleware/validation");
const validator=require("../middleware/validation2");
const castCreateValidation=require("../middleware/castValidation");
// routes.get("/all", castController.getAll);
// routes.post("/create", castCreateValidation, castController.create);
// routes.get("/getbyid", castController.getById);
// routes.get("/getbyimdb", castController.getByImdb);
// routes.delete("/deletebyid", castController.deleteById);
// routes.put("/updatebyid", castController.updateMovie);
routes.post("/createtransaction",castController.createTransaction);
routes.get("/getalltransactions",castController.getAllTransactions);
routes.get("/getallmangas",castController.getAllMangas);
routes.get("/getmangaprice",castController.transactionPrice);
routes.put("/addtransaction",castController.addTransaction);



// routes.get("/all", productController.getAll);
// routes.get("/field", productController.getByField);
// routes.delete("/delete", productController.delete);
// routes.put("/update", validator.create, productController.create, productController.update);
// routes.put("/update", createValidationUpdate, productController.update);
// routes.post("/post", createValidation, productController.post);
// routes.get("/discount",productController.calculateDiscount);
// routes.get("/price",productController.price);
// routes.get("/buy",createValidationStock,productController.buy);
// routes.put("/addstock",createValidationAddStock,productController.addStock);
// routes.put("/rate",createValidationRating,productController.rating);
// routes.put("/adddiscount",createValidationDiscount,productController.addDiscount);
// routes.use(productController.notFound);
routes.use(castController.notFound);
module.exports=routes;