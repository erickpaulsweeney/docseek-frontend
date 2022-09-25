import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Box,
    TextField,
    Container,
    Typography,
    IconButton,
    Button,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Radio,
    RadioGroup,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function PasswordReset() {
    const { userId, token } = useParams();
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const navigate = useNavigate();

    const submitNewPassword = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            `auth/password-reset/${userId}/${token}`,
            input,
            header
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Password reset successfully! You may now log in with your new password.");
            navigate("/login");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get("password");
        const confirmPassword = data.get("confirm");

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmError("Passwords do not match.");
            return;
        }

        setPasswordError("");
        setConfirmError("");

        submitNewPassword({ password, confirmPassword });
    };

    return (
        <Grid
            component="main"
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    backgroundImage:
                        "url(https://www.energiepositiefleven.nu/wp-content/uploads/Energiepositief-Zorgen-scaled.jpeg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: "-1",
                }}
            />
            <Container maxWidth="sm" sx={{ my: "3em" }}>
                <Card sx={{ background: "#ffffffdd", width: "100%" }}>
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid item xs={12} mb="1em">
                                <TextField
                                    type="password"
                                    variant="outlined"
                                    name="password"
                                    label="New password"
                                    required
                                    fullWidth
                                    error={passwordError.length > 0}
                                    helperText={passwordError}
                                />
                            </Grid>
                            <Grid item xs={12} mb="2em">
                                <TextField
                                    type="password"
                                    variant="outlined"
                                    name="confirm"
                                    label="Confirm new password"
                                    required
                                    fullWidth
                                    error={confirmError.length > 0}
                                    helperText={confirmError}
                                />
                            </Grid>
                            <Grid item xs={12} mb="1em">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: "100%" }}
                                >
                                    Save new password
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth onClick={() => navigate("/login")}>Back to log in page</Button>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
