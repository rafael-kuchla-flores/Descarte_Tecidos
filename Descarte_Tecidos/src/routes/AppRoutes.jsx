import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/home/Home.jsx";
import About from "../pages/main/about/About.jsx";
import PointsCollection from "../pages/main/collectionpoints/CollectionPoints.jsx";
import Campaigns from "../pages/main/campaigns/Campaigns.jsx";
import Content from "../pages/main/content/Content.jsx";
import Login from "../pages/auth/login/Login.jsx";
import Register from "../pages/auth/register/Register.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/como-funciona" element={<About />} />
      <Route path="/pontos-de-coleta" element={<PointsCollection />} />
      <Route path="/campanhas" element={<Campaigns />} />
      <Route path="/conteudos" element={<Content />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;