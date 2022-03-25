
const employee = require("../model/employeeModel")
const admins = require("../model/adminModel")
module.exports = {

    doSignin: (name, password) => {
        console.log(name);
        console.log(password);
        return new Promise(async (resolve, reject) => {
            let admin = await admins.findOne({
                name: name,
                password: password
            })
            console.log(admin);
            if (admin) {
                resolve({ status: true, data: admin })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    addEmployee: (empData) => {
        console.log("controller");
        return new Promise(async (resolve, reject) => {
            let data = await employee.create({
                desigination: empData.desigination, contact: empData.contact, email: empData.email, name: empData.name, image: empData.imageOne, gender: empData.gender, course: empData.course
            })
            console.log(data);
            resolve(data)
        })
    },
    getEmployee: () => {
        return new Promise(async (resolve, reject) => {
            let data = await employee.find({})
            if (data) {
                resolve({ status: true, empData: data })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    deleteEmployee: (empID) => {
        console.log(empID);
        return new Promise(async (resolve, reject) => {
            let data = await employee.deleteOne({
                _id: empID
            })
            resolve(data)
        })
    },
    getEmpDetails: (empId) => {
        return new Promise(async (resolve, reject) => {
            let data = await employee.findOne({
                _id: empId,
            })
            resolve(data)
        })
    },
    editData: (empData) => {
        console.log("empData");
        return new Promise(async (resolve, reject) => {
            let data = await employee.findByIdAndUpdate(empData._id, {
                desigination: empData.desigination, contact: empData.contact, email: empData.email, name: empData.name, image: empData.imageOne, gender: empData.gender, course: empData.course
            })
            console.log(data);
            resolve(data)
        })
    },
    searchEmployee: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            let response = await employee.find({
                name: { $regex: '^' + data + '.*', $options: 'i' }
            })
            console.log(response);
            resolve(response)
        })
    }
}