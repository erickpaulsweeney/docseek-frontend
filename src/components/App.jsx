import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import LogIn from "./Login";
import ProfileDoctor from "./ProfileDoctor";
import ProfilePatient from "./ProfilePatient";
import Signup from "./Signup";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-doctor" element={<ProfileDoctor />} />
            <Route path="/profile-patient" element={<ProfilePatient />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}
