import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
// import OtherPage from "./pages/OtherPage";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <div className="content pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/other" element={<OtherPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
