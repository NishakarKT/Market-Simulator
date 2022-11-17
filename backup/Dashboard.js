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
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import Orderbook from "./Orderbook";
import Buysell from "./Buysell";
import PriorityQueue from "js-priority-queue";
// import tradehis from "./Tradehis"
import History from "./Tradehis";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import { DASHBOARD_ROUTE, CRYPTO_ROUTE } from "../../constants/routes";
// data
import userData from "./userData";
// import ordersData from "./ordersData";
// vars
let simulationInterval;

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
        Kodein Hackathon
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
  const [usersData, setUsersData] = useState([]);
  const [history, setHistory] = useState([]);
  const [data, setData] = useState([]);
  const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [minHeap, setMinHeap] = useState(
    new PriorityQueue({
      comparator: (a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        else return a.time - b.time;
      },
    })
  );
  const [maxHeap, setMaxHeap] = useState(
    new PriorityQueue({
      comparator: (a, b) => {
        if (a.price !== b.price) return b.price - a.price;
        else return b.time - a.time;
      },
    })
  );

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const simulate = () => {
    let orders;
    setOrders((ordrs) => {
      orders = ordrs;
      return ordrs;
    });

    let order = orders.shift();

    if (!order) {
      // clearInterval(simulationInterval);
      return;
    }

    let currPrice;
    setPrice((price) => {
      currPrice = price;
      return price;
    });

    let mnHp;
    setMinHeap((minHeap) => {
      mnHp = minHeap;
      return minHeap;
    });

    let mxHp;
    setMaxHeap((maxHeap) => {
      mxHp = maxHeap;
      return maxHeap;
    });

    if (order.type === "limit") {
      if (order.mode === "sell") {
        let matchBid = mxHp.priv.data.find(
          (ordr) =>
            ordr.mode === "buy" &&
            ordr.price === order.price &&
            ordr.from !== order.from
        );
        while (matchBid && order.amount > 0) {
          currPrice = matchBid.price;
          let diff = matchBid.amount - order.amount;
          if (diff >= 0) {
            order.amount = 0;
            setUsersData((usersData) => {
              const idx = usersData.findIndex(
                (user) => user.name === matchBid.from
              );
              if (idx !== -1)
                usersData[idx].stocks =
                  Number(usersData[idx].stocks) - matchBid.amount;
              return usersData;
            });
            setHistory((history) => {
              history.unshift({
                from: order.from,
                to: matchBid.from,
                amount: matchBid.amount,
                price: matchBid.price,
              });
              return history;
            });
            if (diff) mnHp.queue(matchBid);
          } else {
            order.amount = -diff;
            matchBid = mxHp.priv.data.find(
              (ordr) =>
                ordr.mode === "buy" &&
                ordr.price === order.price &&
                ordr.from !== order.from
            );
          }
        }
        if (order.amount) mnHp.queue(order);
      } else if (order.mode === "buy") {
        let matchBid = mxHp.priv.data.find(
          (ordr) =>
            ordr.mode === "sell" &&
            ordr.price === order.price &&
            ordr.from !== order.from
        );
        while (matchBid && order.amount > 0) {
          currPrice = matchBid.price;
          let diff = matchBid.amount - order.amount;
          if (diff >= 0) {
            order.amount = 0;
            setUsersData((usersData) => {
              const idx = usersData.findIndex(
                (user) => user.name === matchBid.from
              );
              if (idx !== -1)
                usersData[idx].stocks =
                  Number(usersData[idx].stocks) + matchBid.amount;
              return usersData;
            });
            setHistory((history) => {
              history.unshift({
                from: order.from,
                to: matchBid.from,
                amount: matchBid.amount,
                price: matchBid.price,
              });
              return history;
            });
            if (diff) mxHp.queue(matchBid);
          } else {
            order.amount = -diff;
            matchBid = mxHp.priv.data.find(
              (ordr) =>
                ordr.mode === "sell" &&
                ordr.price === order.price &&
                ordr.from !== order.from
            );
          }
        }
        if (order.amount) mxHp.queue(order);
      }
    } else if (order.type === "market") {
      if (order.mode === "sell") {
        let highestBid = mxHp.priv.data.length ? mxHp.priv.data[0] : 0; //peek
        while (
          highestBid &&
          highestBid.price >= order.price &&
          order.amount > 0
        ) {
          highestBid = mxHp.dequeue();
          currPrice = highestBid.price;
          let diff = highestBid.amount - order.amount;
          if (diff >= 0) {
            order.amount = 0;
            setUsersData((usersData) => {
              const idx = usersData.findIndex(
                (user) => user.name === highestBid.from
              );
              if (idx !== -1)
                usersData[idx].stocks =
                  Number(usersData[idx].stocks) + highestBid.amount;
              return usersData;
            });
            setHistory((history) => {
              history.unshift({
                from: order.from,
                to: highestBid.from,
                amount: highestBid.amount,
                price: highestBid.price,
              });
              return history;
            });
            if (diff) mxHp.queue(highestBid);
          } else {
            order.amount = -diff;
            highestBid = mxHp.priv.data.price;
          }
        }
        if (order.amount) mnHp.queue(order);
      } else if (order.mode === "buy") {
        let lowestAsk = mnHp.priv.data.length ? mnHp.priv.data[0] : 0;
        while (
          lowestAsk &&
          lowestAsk.price <= order.price &&
          order.amount > 0
        ) {
          lowestAsk = mnHp.dequeue();
          currPrice = lowestAsk.price;
          let diff = lowestAsk.amount - order.amount;
          if (diff >= 0) {
            order.amount = 0;
            setUsersData((usersData) => {
              const idx = usersData.findIndex(
                (user) => user.name === lowestAsk.from
              );
              if (idx !== -1)
                usersData[idx].stocks =
                  Number(usersData[idx].stocks) - lowestAsk.amount;
              return usersData;
            });
            setHistory((history) => {
              history.unshift({
                from: order.from,
                to: lowestAsk.from,
                amount: lowestAsk.amount,
                price: lowestAsk.price,
              });
              return history;
            });
            if (diff) mnHp.queue(lowestAsk);
          } else {
            order.amount = -diff;
            lowestAsk = mnHp.priv.data.price;
          }
        }
        if (order.amount) mxHp.queue(order);
      }
    }

    setOrders(orders);
    setPrice(currPrice);
    setMinHeap(mnHp);
    setMaxHeap(mxHp);
  };

  useEffect(() => {
    // clearInterval(simulationInterval);
    // simulationInterval = setInterval(() => simulate(), 100);
  }, []);

  useEffect(() => {
    // setOrders(ordersData);
    setUsersData(userData);
  }, []);

  // useEffect(() => {
  //   const initData = JSON.parse(localStorage.getItem("kodein"));
  //   if(initData){
  //     const userData = initData.usersData || userData;
  //     const orders = initData.usersData || ordersData;
  //     const data = initData.usersData || [];
  //     const history = initData.history || [];
  //     setUsersData(userData);
  //     setOrders(orders);
  //     setData(data);
  //     setHistory(history);
  //   }
  // }, []);

  // useEffect(() => {
  //   const date = new Date();
  //   setData((data) => [
  //     ...data,
  //     {
  //       time:
  //         date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
  //       amount: price,
  //     },
  //   ]);
  // }, [price]);

  return (
    <ThemeProvider theme={mdTheme}>
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
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart data={data} />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
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
              {/* Recent Orders */}
              <Grid item xs={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 310,
                  }}
                >
                  <Orders usersData={usersData} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={6}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Buysell
                    setData={setData}
                    setOrders={setOrders}
                    setPrice={setPrice}
                    setUsersData={setUsersData}
                    setHistory={setHistory}
                  />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    overflowY: "auto",
                  }}
                >
                  <Orderbook orders={orders} />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={6} lg={6}>
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
