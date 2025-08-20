const mongoose = require("mongoose");
const rolePrivileges = require("./RolePrivileges");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
    is_active: {type: Boolean, default: true},
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class roles extends mongoose.Model {

     async remove(query) {

        if (query._id) {
            await RolePrivileges.remove({role_id: query._id});
        }

        await super.remove(query);
    }

}

schema.loadClass(roles);
module.exports = mongoose.model("roles", schema);