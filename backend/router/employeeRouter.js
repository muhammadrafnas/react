const express = require("express")
const router = express.Router()
const { cloudinary } = require('../utils/cloudinary')
const employeeControler = require("../controler/employeeControler")

//employee login
router.post("/login", async (req, res) => {
    console.log(req.body);
    let response = await employeeControler.doSignin(req.body.admin.name, req.body.admin.password)
    console.log(response);
    if (response.status) {
        res.status(200).json(response.data)
    }
    else {
        res.status(404).json(response.data)
    }
})


router.post("/addEmployee", async (req, res) => {
    console.log("api called.......");
    let values = req.body.empDetails
    try {
        let fileStr = values.imageOne;
        const uploadedResponse = await cloudinary.uploader.
            upload(fileStr)
        console.log(uploadedResponse);
        values.imageOne = uploadedResponse.secure_url
    }
    catch (error) {
        console.error(error);
    }
    let response = await employeeControler.addEmployee(values)
    res.json(response)
})
//get all employee details
router.get("/getEmployee", async (req, res) => {
    let employeeData = await employeeControler.getEmployee()
    if (employeeData.status) {
        res.status(200).json(employeeData.empData)
    }
    else {
        res.status(404).send({
            message: "No employees"
        })
    }
})
//get employee details
router.get("/getEditData/:id", async (req, res) => {
    let empData = await employeeControler.getEmpDetails(req.params.id)
    res.status(200).json(empData)
})


//employee delete
router.delete("/empDelete/:id", async (req, res) => {
    let response = await employeeControler.deleteEmployee(req.params.id)
    res.json(response)
})

//edit Employee details
router.post("/editEmplDetails", async (req, res) => {
    let image = ""
    image = req.body.data.imageOne
    if (image.length > 100) {
        try {
            let fileStr = image;
            const uploadedResponse = await cloudinary.uploader.
                upload(fileStr)
            image = uploadedResponse.secure_url
        }
        catch (error) {
            console.error(error);
        }
    }
    req.body.data.imageOne = image
    let response = await employeeControler.editData(req.body.data)
    res.status(200).json(response)
})

//Search Employeee
router.post("/searchEmployee", async (req, res) => {
    let data = await employeeControler.searchEmployee(req.body.value)
    res.status(200).json(data)
})
















module.exports = router;