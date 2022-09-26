import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    Container,
    Typography,
    Button,
    Avatar,
    Tabs,
    Tab,
} from "@mui/material";
import axiosClient from "../api-config";

export default function ProfileDoctor() {
    const [user, setUser] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const navigate = useNavigate();

    const fetchSpecialties = async () => {
        const response = await axiosClient.get("doctor/specialties");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setSpecialties(response.data);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchSpecialties();
        }
        // eslint-disable-next-line
    }, []);

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
                        "url(https://wallup.net/wp-content/uploads/2018/03/19/587713-digital_art-minimalism-abstract-simple_background-heartbeat-blue_background-medicine.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(25deg)",
                    zIndex: "-1",
                }}
            />
            {user && specialties.length > 0 && (
                <Container
                    maxWidth="lg"
                    sx={{
                        py: "3em",
                        backgroundColor: "#ffffff81",
                        minHeight: "100vh",
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                mb: "2em",
                            }}
                        >
                            <Tabs value={"Profile"} centered>
                                <Tab
                                    label={"Home"}
                                    value={"Home"}
                                    href={"/doctor"}
                                />
                                <Tab
                                    label={"Profile"}
                                    value={"Profile"}
                                />
                                <Tab
                                    label={"Consultations"}
                                    value={"Consultations"}
                                    href={"/doctor/schedule"}
                                />
                            </Tabs>
                        </Grid>
                        <Grid item container spacing={1} xs={12}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Box
                                    component="img"
                                    maxWidth="sm"
                                    src={
                                        "https://digitalapicraft.com/wp-content/webpc-passthru.php?src=https://digitalapicraft.com/wp-content/uploads/2022/01/banner-back.png&nocache=1"
                                    }
                                    sx={{ width: "100%", mt: "2em", mb: "2em" }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    my: "3em",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="500"
                                    mb="1em"
                                    align="center"
                                >
                                    Dr. {user.name}
                                </Typography>
                                <Typography variant="h5" align="center">
                                    {user.hospital}
                                </Typography>
                                <Typography variant="h6" align="center">
                                    {user.location}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight="500"
                                    textTransform="uppercase"
                                    align="center"
                                    sx={{ width: "100%", mt: "3em", mb: "1em" }}
                                >
                                    Specialties
                                </Typography>
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        gap: "2em",
                                    }}
                                >
                                    {user.specialty.map((item) => (
                                        <Grid
                                            key={item}
                                            item
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Avatar
                                                src={`/images/${specialties[
                                                    item - 1
                                                ].name.toLowerCase()}.svg`}
                                                sx={{ width: 75, height: 75 }}
                                            />
                                            <Typography variant="overline">
                                                {specialties[item - 1].name}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Typography
                                    variant="h6"
                                    fontWeight="500"
                                    textTransform="uppercase"
                                    align="center"
                                    sx={{ width: "100%", mt: "3em", mb: "1em" }}
                                >
                                    Experience
                                </Typography>
                                <Grid container spacing={2}>
                                    {user.experience.map((item) => {
                                        const position = item.split(" in ")[0];
                                        const institution = item
                                            .split(" in ")[1]
                                            .split(" from ")[0];
                                        const date = item.split(" from ")[1];
                                        return (
                                            <Grid
                                                key={item}
                                                item
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    align="center"
                                                >
                                                    {position}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    align="center"
                                                >
                                                    {institution}
                                                </Typography>
                                                <Typography
                                                    variant="overline"
                                                    align="center"
                                                >
                                                    {date}
                                                </Typography>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                                <Typography
                                    variant="h6"
                                    fontWeight="500"
                                    textTransform="uppercase"
                                    align="center"
                                    sx={{ width: "100%", mt: "3em", mb: "1em" }}
                                >
                                    Qualification
                                </Typography>
                                <Grid container spacing={2}>
                                    {user.qualification.map((item) => {
                                        const [training, institution] =
                                            item.split(" in ");
                                        return (
                                            <Grid
                                                key={item}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    my: "0.5em",
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {training}
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    {institution}
                                                </Typography>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    my: "2em",
                                }}
                            >
                                <Button
                                    size="large"
                                    variant="contained"
                                    sx={{ borderRadius: "2em" }}
                                    onClick={() => navigate("/profile-doctor")}
                                >
                                    Edit your profile
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
