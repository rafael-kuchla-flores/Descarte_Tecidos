import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/home/Home.jsx";
import About from "../pages/main/about/About.jsx";
import PointsCollection from "../pages/main/collectionpoints/CollectionPoints.jsx";
import Campaigns from "../pages/main/campaigns/Campaigns.jsx";
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

function AppRoutes() {
  return (
    <Routes>
      {/* publica */}
      <Route path="/" element={<Home />} />
      <Route path="/como-funciona" element={<About />} />
      <Route path="/pontos-de-coleta" element={<PointsCollection />} />
      <Route path="/campanhas" element={<Campaigns />} />
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
    </Routes>
  );
}

export default AppRoutes;