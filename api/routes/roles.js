const express = require('express');
const router = express.Router();

const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const role_privileges = require('../config/role_privileges');


router.get("/", async (req, res) => {
    try {
        let roles = await Roles.find({});
        res.json(Response.successResponse(roles));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/add", async (req, res) => {
    let body = req.body;
    try {

        if (!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Role name field must be filled")
        if (!body.permissions || Array.isArray(body.permissions || body.permissions.length === 0)) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Permissions field must be an array")
        }
        let role = new Roles({
            role_name: ReportBody.role_name,
            is_active: true,
            created_by: req.user?.id
        });
        await role.save();
        for (let i = 0; i < body.permissions.length; i++) {
            let priv = new RolePrivileges({
                role_id: role._id,
                permission: body.permissions[i],
                created_by: req.user?.id
            })
            await priv.save();
        }
        res.json(Response.successResponse(roles));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/update", async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Role id field must be filled")

        let updates = {}

        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.role_name = body.role_name

        if (!body.permissions && Array.isArray(body.permissions && body.permissions.length === 0)) {

            let rolePrivs = await RolePrivileges.find({ role_id: body._id });
            let removedPermissions = permissions.filter(x => !body.permission.includes(x.permission))
            let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permission).includes(x));
            if (removedPermissions.length > 0) {
                await RolePrivileges.remove({ _id: { $in: removedPermissions.map(x => x._id) } })
            }

            if(newPermissions.length>0){
                for (let i = 0; i < newPermissions.length; i++) {
                    let priv = new RolePrivileges({
                        role_id: body._id,
                        permission: newPermissions[i],
                        created_by: req.user?.id
                    })
                    await priv.save();
                }
            }
            
        }

        await Roles.updateOne({ _id: body._id }, updates)
        res.json(Response.successResponse(roles));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/delete", async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "Role id field must be filled")

        await Roles.remove({ _id: body._id })

        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        const errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.get("/role_privileges", async (req, res) => {
    res.json(role_privileges);
})
module.exports = router;