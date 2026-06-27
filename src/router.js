import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Nav/Navbar";
import ResourcesPage from "./pages/ResourcesPage"; // به جای Resources
import Dashboard from "./pages/StudentDashboard.jsx";
import Login from "./components/Authentication/Login.jsx";
import SignUp from "./components/Authentication/SignUp";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import LehrePage from "./pages/LehrePage.jsx";
import Dictionary from "./components/Dictionary/Dictionary.jsx";
import Product from "./components/Home/Product/Product.jsx";
import BookPlayer from "./components/Resource/BookPlayer/BookPlayer.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import LearningPathPage from "./pages/LearningPathPage.jsx";
import ProfileSetupPage from "./pages/ProfileSetupPage.jsx";
import AdaptiveLearningResearchPage from "./pages/AdaptiveLearningResearchPage.jsx";
import ResearchGuidancePage from "./pages/ResearchGuidancePage.jsx";
import AccountProfilePage from "./pages/AccountProfilePage.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <div className="content pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/learning-path"
            element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <LearningPathPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={["learner", "teacher", "school_admin", "platform_admin"]}>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <PracticePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute allowedRoles={["learner"]} requireLearnerProfile={false}>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute requireLearnerProfile={false}>
                <AccountProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["teacher", "school_admin", "platform_admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/research/adaptive-learning"
            element={
              <ProtectedRoute allowedRoles={["teacher", "school_admin", "platform_admin"]}>
                <AdaptiveLearningResearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/research/guidance"
            element={
              <ProtectedRoute allowedRoles={["teacher", "school_admin", "platform_admin"]}>
                <ResearchGuidancePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/lehre" element={<LehrePage />} />
          <Route path="/Lehre" element={<LehrePage />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/Dictionary" element={<Dictionary />} />
          <Route path="/product" element={<Product />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/book-player" element={<BookPlayer />} />
          <Route path="/BookPlayer" element={<BookPlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
