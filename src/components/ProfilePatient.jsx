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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function ProfilePatient() {
    const [user, setUser] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState([]);
    const [issues, setIssues] = useState([{ issue: "", duration: "" }]);
    const navigate = useNavigate();

    const handleIssueChange = (event, index) => {
        const { name, value } = event.target;
        const newList = [...issues];
        newList[index][name] = value;
        setIssues(newList);
    };

    const fetchSpecialties = async () => {
        const response = await axiosClient.get("doctor/specialties");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setSpecialties(
                response.data.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
            );
            const newChecked = response.data.reduce((accu, curr) => {
                accu[curr.id] = false;
                return accu;
            }, {});
            setChecked(newChecked);
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
                        "url(https://www.energiepositiefleven.nu/wp-content/uploads/Energiepositief-Zorgen-scaled.jpeg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // filter: "saturate(80%) blur(1px)",
                    zIndex: "-1",
                }}
            />
            {user && (
                <Container maxWidth="md" sx={{ my: "3em" }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        Complete your profile
                    </Typography>
                    <Typography align="center" sx={{ mb: "2em" }}>
                        This will help us serve you better.
                    </Typography>
                    <Card sx={{ background: "#ffffffdd", width: "100%" }}>
                        <CardContent>
                            <Box component="form">
                                <Grid container spacing={2} sx={{ mb: "1em" }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Residence
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            name="location"
                                            label="Current Location"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Past Health Issues
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            gutterBottom
                                        >
                                            Please provide at least one.
                                        </Typography>
                                        {issues.map((entry, index) => (
                                            <Grid
                                                container
                                                key={index}
                                                spacing={0}
                                                sx={{ my: "1em" }}
                                            >
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={7}
                                                >
                                                    <TextField
                                                        variant="outlined"
                                                        name="issue"
                                                        required={index === 0}
                                                        fullWidth
                                                        label={
                                                            "Issue " +
                                                            (index + 1)
                                                        }
                                                        value={
                                                            issues[index].issue
                                                        }
                                                        onChange={(event) =>
                                                            handleIssueChange(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={11}
                                                    md={4}
                                                >
                                                    <TextField
                                                        type="number"
                                                        variant="outlined"
                                                        name="duration"
                                                        required={index === 0}
                                                        fullWidth
                                                        label={
                                                            "Duration " +
                                                            (index + 1)
                                                        }
                                                        value={
                                                            issues[index]
                                                                .duration
                                                        }
                                                        onChange={(event) =>
                                                            handleIssueChange(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                        placeholder="Number of years"
                                                    />
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: "2em", width: "100%" }}
                                        >
                                            Save Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            )}
        </Grid>
    );
}
