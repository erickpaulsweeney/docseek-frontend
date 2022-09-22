import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import LogIn from "./Login";
import ProfileDoctor from "./ProfileDoctor";
import ProfilePatient from "./ProfilePatient";
import Signup from "./Signup";
import Error from "./Error";
import HomePatient from "./HomePatient";
import HomeDoctor from "./HomeDoctor";
import DoctorDetails from "./DoctorDetails";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-doctor" element={<ProfileDoctor />} />
            <Route path="/profile-patient" element={<ProfilePatient />} />
            <Route index element={<Home />} />
            <Route path="/patient" element={<HomePatient />} />
            <Route path="/doctor" element={<HomeDoctor />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="*" element={<Error />} />
        </Routes>
    );
}
