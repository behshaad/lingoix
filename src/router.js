import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Nav/Navbar";
import ResourcesPage from "./pages/ResourcesPage"; // به جای Resources
import Dashboard from "./pages/StudentDashboard.jsx";
import Login from "./components/Authentication/Login.jsx";
import SignUp from "./components/Authentication/SignUp";
import LehrePage from "./pages/LehrePage.jsx";
import Dictionary from "./components/Dictionary/Dictionary.jsx";
import Product from "./components/Home/Product/Product.jsx";
import BookPlayer from "./components/Resource/BookPlayer/BookPlayer.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <div className="content pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Lehre" element={<LehrePage />} />
          <Route path="/Dictionary" element={<Dictionary />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/BookPlayer" element={<BookPlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
