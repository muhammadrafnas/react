import React, { useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios'
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosUser } from "../../axios";
import Swal from "sweetalert2";
const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const schema = Yup.object().shape({
    name: Yup.string().required("*Required"),
    password: Yup.string().required("*Required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (data) => {
    try {
      let response = await axiosUser.post("/login", {
        admin: data,
      });
      if (response.status == 200) {
        localStorage.setItem("admin", response.data);
        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Enter correct data",
        showConfirmButton: false,
      });
    }
  };
 let endpont= axios.create({
    baseURL: "http://localhost:5000/"
  })
  useEffect(() => {
    const fetchdata= async()=>{
      console.log("call");
            let data=await endpont.post("/sendOtp",{
              name:"rafnas"
            })
            
    }
    fetchdata()
    let admin = localStorage.getItem("admin");
    if (admin) {
      navigate("/home");
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 5,
          }}
        >
          <Box
            sx={{
              m: 5,
            }}
          >
            <LoginIcon style={{ color: "green" }} />
            <Typography component="h1" variant="h6">
              LOGIN
            </Typography>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="User Name"
                name="name"
                autoComplete="phone"
                {...register("name")}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
              />
              <TextField
                margin="normal"
                {...register("password")}
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoComplete="password"
                error={errors.password ? true : false}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: "#206CE2" }}
              >
                LOGIN
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
