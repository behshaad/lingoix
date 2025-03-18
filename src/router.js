import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Nav/Navbar";
import Resources from "./pages/Resources";
import Dashboard from "./pages/StudentDashboard.jsx"; 
import Login from "./components/Authentication/Login.jsx"; 
import SignUp from "./components/Authentication/SignUp";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <div className="content pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
