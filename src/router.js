import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Resources from "./pages/Resources";
import Dashboard from "./pages/ Dashboard"; 
import Login from "./components/Login"; 


const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <div className="content pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
