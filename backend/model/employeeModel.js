const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    desigination: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    course: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
})

const admin=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pasword:{
        type:String,
        required:true
    }
})

const employee = mongoose.model("employee", employeeSchema)
module.exports = employee;