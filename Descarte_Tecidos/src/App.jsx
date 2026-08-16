import { useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Home from "./pages/home/Home";

function App() {


  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
