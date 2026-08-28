import { Routes, Route } from "react-router-dom";

import Home from "../pages/main/home/Home.jsx";
import HowItWorks from "../pages/main/about/HowItWorks.jsx";
import PointsCollection from "../pages/main/collectionpoints/CollectionPoints.jsx";
import Campaigns from "../pages/main/campaigns/Campaigns.jsx";
import Content from "../pages/main/content/Content.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/como-funciona" element={<HowItWorks />} />
      <Route path="/pontos-de-coleta" element={<PointsCollection />} />
      <Route path="/campanhas" element={<Campaigns />} />
      <Route path="/conteudos" element={<Content />} />
    </Routes>
  );
}

export default AppRoutes;