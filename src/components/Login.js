import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { addAuthorizationUserInfo, addLoggedIn } from "../utils";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "./CircularIndeterminate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_ENDPOINT = "http://35.238.228.19:8080";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangeForm = (e, type) => {
    setErrorFlag(true);
    setForm({
      ...form,
      [type]: e.target.value,
    });
  };
  const handleClickLogin = () => {
    if (form.email.length === 0) {
      toast.warn("Email is required !");
      return;
    }

    if (form.password.length === 0) {
      toast.warn("password is required !");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.warn("Email is invalid !");
      return;
    }

    setIsLoading(true);

    let data = {
      email: form.email,
      password: form.password,
    };

    axios
      .post(`${API_ENDPOINT}/login`, data, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((res) => {
        let data = res.data;
        let user_info = {
          user_id: data.data.user_id,
          user_email: data.data.user_email,
          auth_token: data.data.token,
        };

        addAuthorizationUserInfo(JSON.stringify(user_info));
        addLoggedIn(true);
        toast.success("Login Success !");
      })
      .catch((e) => {
        toast.error("Login Failed !");
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => navigate("/home"), 3000);
      });
  };

  const handleClickBackToHome = () => {
    navigate("/home");
  };

  return (
    <div style={{ margin: 25, gap: 20, display: "grid" }}>
      <div style={{ textAlign: "center", fontSize: 20 }}>
        Log in to your Moonhub Search account
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        Email:
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => handleChangeForm(e, "email")}
          error={
            errorFlag && (form.email.length === 0 || !validateEmail(form.email))
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        Input Password
        <FormControl variant="outlined">
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            value={form.password}
            onChange={(e) => handleChangeForm(e, "password")}
            error={errorFlag && form.password.length === 0}
          />
        </FormControl>
      </div>
      <Button
        variant="contained"
        onClick={handleClickLogin}
        style={{ background: "#5f2ee5", textTransform: "none" }}
        endIcon={
          isLoading ? (
            <CircularIndeterminate color="white" width={30} height={30} />
          ) : null
        }
      >
        Login
      </Button>
      <Button
        variant="outlined"
        style={{ color: "grey", borderColor: "#e8e8e8", textTransform: "none" }}
        onClick={handleClickBackToHome}
      >
        Back to Home
      </Button>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Login;
