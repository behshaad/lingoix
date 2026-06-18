import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import { accountHomePath, canAccessRole, saveAccountSession } from "../../services/authSession";

const ProtectedRoute = ({ allowedRoles = [], requireLearnerProfile = true, children }) => {
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", account: null });

  useEffect(() => {
    let isMounted = true;
    apiClient
      .me()
      .then(({ account }) => {
        saveAccountSession(account);
        if (isMounted) setState({ status: "ready", account });
      })
      .catch(() => {
        if (isMounted) setState({ status: "guest", account: null });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-6xl p-6 text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  if (state.status === "guest") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!canAccessRole(state.account, allowedRoles)) {
    return <Navigate to={accountHomePath(state.account)} replace />;
  }

  if (
    requireLearnerProfile &&
    state.account.role === "learner" &&
    !state.account.learnerId
  ) {
    return <Navigate to="/profile-setup" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
