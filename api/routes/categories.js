var express = require('express');
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const { HTTP_CODES } = require("../config/Enum");
const { updateSearchIndex } = require('../db/models/AuditLogs');

/* GET categories listing. */
router.get('/', async (req, res, next) => {
    try {
        let categories = await Categories.find({});
        res.json(Response.successResponse(HTTP_CODES.OK, categories));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/add", async (req, res) => {
    const body = req.body;
    try {
        if (!body.name) {
            throw new CustomError(
                HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Name field must be filled"
            );
        }
        
        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: body.created_by || "system"
        });
        
        await category.save();
        res.json(Response.successResponse(HTTP_CODES.CREATED, { success: true }));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update",async(req,res)=>{
    let body=req.body;
    try {
        if(!body._id){
          throw new CustomError(
            HTTP_CODES.BAD_REQUEST,
            "Validation Error!",
            "ID field must be filled"
          )  
        }
        let updates={};
       if(body.name) updates.name=body.name;
       if(typeof body.is_active==="booelan") updates.is_active=body.is_active; 

       await Categories.updateOne({_id:body._id},updates)
       res.json(Response.successResponse(({success:true})))
    } catch (error) {
        let errorResponse=Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.delete("/delete",async(req,res)=>{
   let body=req.body;
    try {
       if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","ID field must be filled")
        await Categories.remove({_id:body._id})
    res.json(Response.successResponse({success:true}))
    } catch (error) {
        let errorResponse=Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
})

module.exports = router;