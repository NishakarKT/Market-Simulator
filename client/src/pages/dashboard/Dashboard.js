import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Title from "./Title";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import Orderbook from "./Orderbook";
import Buysell from "./Buysell";
import History from "./Tradehis";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { DASHBOARD_ROUTE, CRYPTO_ROUTE, NEW_USER_ROUTE } from "../../constants/routes";
import { DATA_ENDPOINT } from "../../constants/endpoints";
import socket from "../../socket";
// data
import axios from "axios";
import Loader from "../../components/loader/Loader";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Market Simulator
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [history, setHistory] = useState([]);
  const [data, setData] = useState([]);
  const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [pendingBids, setPendingBids] = useState([]);
  const [pendingAsks, setPendingAsks] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    socket.off();
    socket.on("currData", data => {
      setUsersData(data.users);
      setHistory(data.history);
      setPrice(data.currPrice);
      setData(data.data);
      setPendingBids(data.pendingBids);
      setPendingAsks(data.pendingAsks);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios.get(DATA_ENDPOINT)
    .then(res => {
      setUsersData(res.data.users);
      setHistory(res.data.history);
      setPrice(res.data.currPrice);
      setData(res.data.data);
      setPendingBids(res.data.pendingBids);
      setPendingAsks(res.data.pendingAsks);
      setIsLoading(false);
    })
    .catch(err => {console.log(err);setIsLoading(false);});
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      {isLoading ? <Loader /> : null}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={() => navigate(DASHBOARD_ROUTE)}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(CRYPTO_ROUTE)}>
              <ListItemIcon>
                <CurrencyBitcoinRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Crypto" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(NEW_USER_ROUTE)}>
              <ListItemIcon>
                <PersonAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Create User" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Title>Price Data</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  {data?.length > 0 ? <Chart data={data} /> : null}
                </Paper>
              </Grid>
              {/* Current Price */}
              <Grid item xs={12} md={4} lg={3}>
                <Title>Current Price</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Deposits price={price} />
                </Paper>
              </Grid>
              {/* Users */}
              <Grid item xs={12} md={6} lg={6}>
                <Title>Users</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 272,
                    overflow: "auto",
                  }}
                >
                  <Orders usersData={usersData} />
                </Paper>
              </Grid>
              {/* Place Order */}
              <Grid item xs={12} md={6} lg={6}>
                <Title>Place Order</Title>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Buysell
                    setData={setData}
                    setOrders={setOrders}
                    setPrice={setPrice}
                    usersData={usersData}
                    setUsersData={setUsersData}
                    setHistory={setHistory}
                    setPendingBids={setPendingBids}
                    setPendingAsks={setPendingAsks}
                  />
                </Paper>
              </Grid>
              {/* Pending Bids */}
              <Grid item xs={12} md={6} lg={6}>
                <Title>Pending Bids</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    overflowY: "auto",
                  }}
                >
                  <Orderbook orders={pendingBids} type="bid" />
                </Paper>
              </Grid>
              {/* Pending Offers */}
              <Grid item xs={12} md={6} lg={6}>
                <Title>Pending Offers</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    overflowY: "auto",
                  }}
                >
                  <Orderbook orders={pendingAsks} type="ask" />
                </Paper>
              </Grid>
              {/* Past Transactions */}
              <Grid item xs={12} md={12} lg={12}>
                <Title>Past Transactions</Title>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    overflowY: "auto",
                  }}
                >
                  <History history={history} />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
