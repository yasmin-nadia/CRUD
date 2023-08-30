const {body}=require("express-validator");
// const {validationResult}=require("express-validator");
const validator={
    create:[
        body("stock").exists().
        custom(value=>{
            if(value<0){
                console.log("Stock must be greater than 0")
                throw new Error("Stock must be greater than 0");
            }
            return true;
        })
    ]
}
// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
// }
module.exports=validator;