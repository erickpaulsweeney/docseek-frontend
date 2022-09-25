import React, { useState, useEffect } from "react";
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

export default function Signup() {
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [status, setStatus] = useState("patient");
    const navigate = useNavigate();

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const doctorSignUp = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            "auth/signup-doctor",
            input,
            header
        );
        if (response.status !== 201) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Sign up successful!");
            localStorage.setItem("docSeekUser", JSON.stringify(response.data));
            navigate("/profile-doctor");
        }
    };

    const patientSignUp = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            "auth/signup-patient",
            input,
            header
        );
        if (response.status !== 201) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Sign up successful!");
            localStorage.setItem("docSeekUser", JSON.stringify(response.data));
            navigate("/profile");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get("name");
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirm");
        console.log(email, password);

        if (name.length < 5) {
            setNameError("Full name must be at least 5 characters long.")
            return;
        }

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailError("Invalid email.");
            return;
        }

        if (password.length < 4) {
            setPasswordError("Password is at least 4 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmError("Passwords do not match.");
            return;
        }

        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmError("");

        if (status === "patient") {
            patientSignUp({ name, email, password, confirmPassword });
        } else {
            doctorSignUp({ name, email, password, confirmPassword });
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (data) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, []);

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
                            "url(https://assets.entrepreneur.com/content/3x2/2000/20160813043340-Healthcare.jpeg)",
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
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: "500",
                                mb: "0.5em",
                                color: "rgb(34 86 138)",
                            }}
                        >
                            DocSeek
                        </Typography>
                        <FormControl>
                            <FormLabel id="status">Sign up as:</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="status"
                                name="status"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <FormControlLabel
                                    value="patient"
                                    control={<Radio />}
                                    label="Patient"
                                />
                                <FormControlLabel
                                    value="doctor"
                                    control={<Radio />}
                                    label="Doctor"
                                />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            type="text"
                            fullWidth
                            autoFocus
                            required
                            error={nameError.length > 0}
                            helperText={nameError}
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
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
                        <TextField
                            name="confirm"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            error={confirmError.length > 0}
                            helperText={confirmError}
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Sign up
                        </Button>
                    </Box>
                    <Grid container sx={{ width: "90%", mb: "3em" }}>
                        <Grid item xs>
                            <Link href={"/forgot-password"} variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href={"/login"} variant="body2">
                                Already have an account? Log in here!
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
