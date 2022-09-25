import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ForgotPassword() {
    const [status, setStatus] = useState("patient");
    const navigate = useNavigate();

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const requestLink = async (input) => {
        console.log(input)
        const header = { headers: { "Content-Type": "application/json" } }
        const response = await axiosClient.post("auth/password-reset", input, header);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert(response.data.message);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");

        requestLink({ email, role: status });
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
                            <Grid item xs={12} mb="0.5em">
                                <Typography variant="h6" align="center">
                                    Your email address
                                </Typography>
                            </Grid>
                            <Grid item xs={12} mb="1em">
                                <TextField
                                    type="email"
                                    variant="outlined"
                                    name="email"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                                mb="2em"
                            >
                                <FormControl>
                                    <FormLabel id="status">
                                        You registed in DocSeek as a:
                                    </FormLabel>
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
                            </Grid>
                            <Grid item xs={12} mb="1em">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: "100%" }}
                                >
                                    Request for reset link
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
