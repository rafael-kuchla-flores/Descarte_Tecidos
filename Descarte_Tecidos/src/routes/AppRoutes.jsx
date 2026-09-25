import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/main/home/Home.jsx";
import About from "../pages/main/about/About.jsx";
import PointsCollection from "../pages/main/collectionpoints/CollectionPoints.jsx";
import CollectionPointDetail from "../pages/main/collectionpoints/CollectionPointDetail.jsx";
import Campaigns from "../pages/main/campaigns/Campaigns.jsx";
import CampaignDetail from "../pages/main/campaigns/CampaignDetail.jsx";
import Content from "../pages/main/content/Content.jsx";
import Login from "../pages/auth/login/Login.jsx";
import Register from "../pages/auth/register/Register.jsx";
import PasswordReset from "../pages/auth/password-reset/PasswordReset.jsx";
import NewPassword from "../pages/auth/password-reset/NewPassword.jsx";
// admin
import DashBoard from "../pages/admin/dashboard/DashBoard.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AdminLayout from "../components/adminlayout/AdminLayout.jsx";
import CampaignsAdmin from "../pages/admin/campaigns/CampaignsAdmin.jsx";
import CollectionPoints from "../pages/admin/collection-points/CollectionPoints.jsx";
import UsersAdmin from "../pages/admin/users/Users.jsx";
import ContentAdmin from "../pages/admin/content/ContentAdmin.jsx";
//acess denied
import AccessDenied from "../pages/access-denied/AccessDenied.jsx";
// Manager
import ManagerLayout from "../components/managerlayout/ManagerLayout.jsx";
import ManagerDashboard from "../pages/manager/dashboard/ManagerDashboard.jsx";
import ManagerCollectionPoint from "../pages/manager/collection-point/CollectionPoint.jsx";
import Schedules from "../pages/manager/schedules/Schedules.jsx";
import AcceptedFabrics from "../pages/manager/accepted-fabrics/AcceptedFabrics.jsx";
import Operators from "../pages/manager/operators/Operators.jsx";
import Receipts from "../pages/manager/receipts/Receipts.jsx";
// Operator
import OperatorLayout from "../components/operatorlayout/OperatorLayout.jsx";
import OperatorDashboard from "../pages/operator/dashboard/OperatorDashboard.jsx";
import ReceiveMaterial from "../pages/operator/dashboard/ReceiveMaterial.jsx";
import ReceiptsOperator from "../pages/operator/receipts/Receipts.jsx";


function AppRoutes() {
  return (
    <Routes>
      {/* publica */}
      <Route path="/" element={<Home />} />
      <Route path="/como-funciona" element={<About />} />
      <Route path="/pontos-de-coleta" element={<PointsCollection />} />
      <Route path="/pontos-de-coleta/:id" element={<CollectionPointDetail />} />
      <Route path="/campanhas" element={<Campaigns />} />
      <Route path="/campanhas/:id" element={<CampaignDetail />} />
      <Route path="/conteudos" element={<Content />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/redefinir-senha" element={<PasswordReset />} />
      <Route path="/redefinir-senha/nova" element={<NewPassword />} />

      {/* admin */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashBoard />} />
          <Route path="/admin/campaigns" element={<CampaignsAdmin />} />
          <Route path="/admin/collect-points" element={<CollectionPoints />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/content" element={<ContentAdmin />} />
        </Route>
      </Route>
      <Route path="/acesso-negado" element={<AccessDenied />} />

      {/* Manager */}
      <Route element={<ProtectedRoute managerOnly={true} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="collection-point" element={<ManagerCollectionPoint />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="accepted-fabrics" element={<AcceptedFabrics />} />
          <Route path="operators" element={<Operators />} />
          <Route path="recebimentos" element={<Receipts />} />
        </Route>
      </Route>

      {/* Operator */}
      <Route element={<ProtectedRoute operatorOnly={true} />}>
        <Route path="/operator" element={<OperatorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="receber" element={<ReceiveMaterial />} />
          <Route path="recebimentos" element={<ReceiptsOperator />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;