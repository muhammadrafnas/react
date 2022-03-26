import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  FilledInput,
  FormHelperText,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { axiosUser } from "../../axios";
import Swal from "sweetalert2";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function DialogBox() {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editCall, setEditCall] = useState(false);
  const [id, setId] = useState(null);
  const [serachData, setSearchData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let admin = localStorage.getItem("admin");
    if (admin) {
      navigate("/home");
    }
    else{
      navigate("/")
    }

  }, [refresh]);

  const handleClickOpen = () => {
    reset({
      name: null,
      email: null,
      contact: null,
      desigination: null,
      course: null,
    });
    setImage(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
  };
  const schema = Yup.object().shape({
    name: Yup.string().required("*Required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    contact: Yup.number()
      .min(10)
      .typeError("Enter Valid Phone number")
      .required("Required*"),
    desigination: Yup.string().required("Required*"),
    imageOne: Yup.mixed().test("required", "upload the image", (value) => {
      return value && value.length;
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  function employeeImage(e) {
    let file = e.target.files[0];
    console.log(file);
    getBase64(file).then((data) => {
      setImage(data);
    });
  }
  const onSubmit = async (data) => {
    data.imageOne = image;
    try {
      let response = await axiosUser.post("/addEmployee", {
        empDetails: data,
      });
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
    setRefresh(true);
  };
  const editUser = async (empId) => {
    console.log(empId);

    try {
      let response = await axiosUser.get("/getEditData/" + empId);
      setImage(response.data.image);
      reset({
        name: response.data.name,
        email: response.data.email,
        contact: response.data.contact,
        desigination: response.data.desigination,
        course: response.data.course,
      });
      setId(response.data._id);
      setEditCall(true);
      setOpen(true);
    } catch (error) {
      alert(error);
    }
  };
  const handelEdit = async (data) => {
    data.imageOne = image;
    data._id = id;
    try {
      let response = await axiosUser.post("/editEmplDetails", {
        data,
      });
      if (response) {
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Update Successfully",
          showConfirmButton: false,
        });
        setRefresh(true);
      }
    } catch (error) {}
  };
  async function handelSearch(value) {
    console.log(value);
    if (value) {
      const data = await axiosUser.post("/searchEmployee", {
        value,
      });
      console.log(data.data);
      if (data.data.length != 0) {
        setSearchData(data.data);
      } else {
        setRefresh(false);
      }
    } else {
      setRefresh(true);
    }
  }
  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
      >
        {editCall ? (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Edit form
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new employee
          </BootstrapDialogTitle>
        )}
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <img
              src={image}
              height="60px"
              width="60px"
              style={{ borderRadius: "50%" }}
            />
            <FilledInput
              id="filled-adornment-weight"
              type="file"
              name="imageOne"
              accept=".jpg,.jpeg,.png,"
              aria-describedby="filled-weight-helper-text"
              {...register("imageOne")}
              error={errors.imageOne ? true : false}
              helperText={errors.imageOne?.message}
              onChange={employeeImage}
            />
            <FormHelperText id="filled-weight-helper-text">
              Upload Shop Image
            </FormHelperText>

            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email?.message}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Mobile No"
              variant="outlined"
              fullWidth
              {...register("contact")}
              error={errors.contact ? true : false}
              helperText={errors.contact?.message}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Desigination
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="desigination"
                fullWidth
                {...register("desigination")}
                error={errors.desigination ? true : false}
                helperText={errors.desigination?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value={"HR"}>HR</MenuItem>
                <MenuItem value={"Manager"}>Manager</MenuItem>
                <MenuItem value={"Sales"}>Sales</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 2 }}>
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Male"
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                  {...register("gender")}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                  {...register("gender")}
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                  {...register("gender")}
                />
              </RadioGroup>
            </FormControl>
            <FormGroup sx={{ m: 2 }} name="course">
              <FormLabel id="demo-radio-buttons-group-label">Course</FormLabel>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="BCA"
                value="BCA"
                {...register("course")}
              />
              <FormControlLabel
                name="course"
                value="MCA"
                control={<Checkbox />}
                label="MCA"
                {...register("course")}
              />
              <FormControlLabel
                name="course"
                value="BSC"
                control={<Checkbox />}
                label="BSC"
                {...register("course")}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={
              editCall ? handleSubmit(handelEdit) : handleSubmit(onSubmit)
            }
          >
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 15,
          mr: 3,
          ml: 3,
        }}
      >
        <Box sx={{ boxShadow: 5, borderRadius: 2, mr: 1, maxHeight: "58px" }}>
          <InputBase
            sx={{ ml: 1 }}
            onChange={(e) => handelSearch(e.target.value)}
            placeholder="Search..."
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: "10px" }}>
          <AddBoxIcon sx={{ fontSize: "46px" }} onClick={handleClickOpen} />
        </Box>
      </Box>
      <Table props={{ editUser, setRefresh, refresh, serachData }} />
    </>
  );
}
