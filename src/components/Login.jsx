import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import axiosClient from "../api-config";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Avatar,
    TextField,
    Typography,
    Button,
    Link,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";


export default function Login() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [status, setStatus] = useState("patient");
    const navigate = useNavigate();
    
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const doctorLogIn = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post("auth/login-doctor", input, header);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Log in successful!");
            localStorage.setItem("docSeekUser", JSON.stringify(response.data));
            const { experience, hospital, location, qualification, specialty } = response.data.data;
            if (!experience || !hospital || !location || !qualification || !specialty) {
                navigate("/profile-doctor");
            } else {
                navigate("/");
            }
        }
    };

    const patientLogIn = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post("auth/login-patient", input, header);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Log in successful!");
            localStorage.setItem("docSeekUser", JSON.stringify(response.data));
            const { location, past_diseases, blood_group, weight, sex, age } = response.data.data;
            if (!location || !past_diseases || !blood_group || !weight || !sex || !age) {
                navigate("/profile-patient");
            } else {
                navigate("/");
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        console.log(email, password);

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailError("Invalid email.");
            return;
        }

        if (password.length < 4) {
            setPasswordError("Password is at least 4 characters long.");
            return;
        }

        setEmailError("");
        setPasswordError("");

        if (status === "patient") {
            patientLogIn({ email, password });
        } else {
            doctorLogIn({ email, password });
        }
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (data) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [])
    
    return (
        <Grid component="main" sx={{ height: "100vh", width: "100vw" }}>
            <Grid container spacing={1} sx={{ height: "100%" }}>
                {/* Side pic */}
                <Grid
                    item
                    xs={false}
                    md={6}
                    sx={{
                        backgroundImage:
                            "url(https://igec.com.br/wp-content/uploads/2021/05/2e9e3528852397e3bd2f34a06c488e52_metodos-terapeuticos-para-o-tratamento-da-hpb.jpg)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "left",
                    }}
                />
                {/* Main form */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: "90%",
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1em",
                        }}
                    >
                        <Avatar
                            src="/images/med_logo.png"
                            sx={{ width: 150, height: 150, border: "0.25em solid rgb(34 86 138)" }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: "500", mb: "1em", color: "rgb(34 86 138)" }}>
                            DocSeek
                        </Typography>
                        <FormControl>
                            <FormLabel id="status">Log in as:</FormLabel>
                            <RadioGroup row aria-labelledby="status" name="status" value={status} onChange={handleStatusChange}>
                                <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                                <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                            autoFocus
                            error={emailError.length > 0}
                            helperText={emailError}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            error={passwordError.length > 0}
                            helperText={passwordError}
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Log in
                        </Button>
                    </Box>
                    <Grid container sx={{ width: "90%", mb: "3em" }}>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href={"/signup"} variant="body2">
                                Don't have an account? Sign up here!
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
