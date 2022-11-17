import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// components
import Loader from "./components/loader/Loader.js";
// constants
import {
  DASHBOARD_ROUTE,
  CRYPTO_ROUTE,
  NEW_USER_ROUTE,
} from "./constants/routes";
// mui
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
// pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const NewUser = lazy(() => import("./pages/newUser/NewUser"));
const Crypto = lazy(() => import("./pages/crypto/Crypto"));

const App = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    Boolean(JSON.parse(localStorage.getItem("kodein"))?.dark)
  );

  useEffect(() => {
    if (!dark)
      document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";
    else document.querySelector("html").style.filter = "none";
  }, [dark]);

  const handleDarkMode = () => {
    const localData = JSON.parse(localStorage.getItem("kodein")) || {};
    localStorage.setItem(
      "kodein",
      JSON.stringify({ ...localData, dark: !dark })
    );
    setDark(!dark);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", right: 10, bottom: 10, zIndex: "100000" }}
        icon={<SpeedDialIcon style={{ color: "white" }} />}
      >
        <SpeedDialAction
          icon={<PersonAddRoundedIcon />}
          tooltipTitle={"Create User"}
          onClick={() => navigate(NEW_USER_ROUTE)}
        />
        <SpeedDialAction
          icon={<CurrencyBitcoinRoundedIcon />}
          tooltipTitle={"Crypto"}
          onClick={() => navigate(CRYPTO_ROUTE)}
        />
        <SpeedDialAction
          icon={<DashboardIcon />}
          tooltipTitle={"Dashboard"}
          onClick={() => navigate(DASHBOARD_ROUTE)}
        />
        <SpeedDialAction
          icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />}
          tooltipTitle={dark ? "Light mode" : "Dark mode"}
          onClick={() => handleDarkMode()}
        />
      </SpeedDial>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={NEW_USER_ROUTE} element={<NewUser />} />
          <Route path={DASHBOARD_ROUTE} element={<Dashboard />} />
          <Route path={CRYPTO_ROUTE} element={<Crypto />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
