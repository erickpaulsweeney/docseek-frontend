import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    Container,
    Typography,
    Button,
    Avatar,
} from "@mui/material";

export default function Error() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
        }
        // eslint-disable-next-line
    }, [])

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
                        "url(https://img.freepik.com/vetores-gratis/medicina-e-saude-na-cor-azul_1017-26807.jpg?w=2000)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(25deg)",
                    zIndex: "-1",
                }}
            />
            <Container
                maxWidth="lg"
                sx={{
                    py: "3em",
                    backgroundColor: "#ffffff81",
                    minHeight: "100vh",
                }}
            >
                {user && <Grid container spacing={1}>
                    <Grid item container spacing={1} xs={12}>
                        <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Avatar
                                src="/images/med_logo.png"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: "0.25em solid rgb(34 86 138)",
                                }}
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
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: "500",
                                    color: "rgb(34 86 138)",
                                }}
                            >
                                DocSeek
                            </Typography>
                            <Typography
                                variant="overline"
                                align="center"
                                color="rgb(34 86 138)"
                            >
                                Where we provide a one-stop solution to patients
                                and doctors alike
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ my: "3em", display: "flex", flexDirection: "column", alignItems: "center", gap: "1em" }}>
                            <Typography variant="h4" align="center" gutterBottom>You seem to be lost!</Typography>
                            <Button variant="contained" onClick={() => user.role === "patient" ? navigate("/patient") : navigate("/doctor")}>Go back to home page</Button>
                            <Button onClick={() => navigate("/login")}>Log in</Button>
                        </Grid>
                    </Grid>
                </Grid>}
            </Container>
        </Grid>
    );
}
