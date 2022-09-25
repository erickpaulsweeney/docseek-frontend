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
    Avatar,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DoctorDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState([]);
    const navigate = useNavigate();

    const fetchSpecialties = async () => {
        const response = await axiosClient.get("doctor/specialties");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setSpecialties(response.data);
            const newChecked = response.data.reduce((accu, curr) => {
                accu[curr.id] = false;
                return accu;
            }, {});
            setChecked(newChecked);
        }
    };

    const fetchDoctors = async () => {
        const response = await axiosClient.get("doctor/list");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const doctor = response.data.filter((el) => el.id == id)[0];
            setDoctor(doctor);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchSpecialties();
            fetchDoctors();
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
                    position: "relative",
                }}
            >
                <IconButton
                    sx={{ position: "absolute", top: "1em", left: "1em" }}
                    onClick={() => navigate("/patient/list")}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Grid container spacing={1}>
                    <Grid container spacing={1} item xs={12}>
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
                                lineHeight="1.5em"
                            >
                                Where we provide a one-stop solution to patients
                                and doctors alike
                            </Typography>
                        </Grid>
                        {user && doctor && specialties.length > 0 && (
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
                                    mb="0.5em"
                                    align="center"
                                >
                                    Dr. {doctor.name}
                                </Typography>
                                <Typography variant="h5" align="center">
                                    {doctor.hospital}
                                </Typography>
                                <Typography variant="h6" align="center">
                                    {doctor.location}
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
                                    {doctor.specialty.map((item) => (
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
                                    {doctor.experience.map((item) => {
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
                                    {doctor.qualification.map((item) => {
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
                        )}
                        {user && doctor && (
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={doctor.timeslots === null}
                                    onClick={() =>
                                        navigate(`/consultation/new/${id}`)
                                    }
                                >
                                    Book a consult now
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}
