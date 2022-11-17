import React, { useEffect, useState } from "react";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// mui
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// constants
import { ORDER_ENDPOINT } from "../../constants/endpoints";
// data
const count = 1000;
const names = ["A", "B", "C", "D", "E"];
const modes = ["buy", "sell"];
const types = ["limit", "market"];
// vars
let simulationInterval;

const Buysell = ({ usersData, setOrders, setUsersData, setPrice, setHistory, setData, setPendingBids, setPendingAsks }) => {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [mode, setMode] = useState("buy");
  const [type, setType] = useState("limit");
  const [amount, setAmount] = useState(0);
  const [stkPrice, setStkPrice] = useState(0);
  const [amountErr, setAmountErr] = useState(false);
  const [stkPriceErr, setStkPriceErr] = useState(false);

  useEffect(() => {
    clearInterval(simulationInterval);
    simulationInterval = setInterval(() => {
      const order = {};
      order["from"] = names[Math.floor(Math.random() * names.length)];
      order["mode"] = modes[Math.floor(Math.random() * modes.length)];
      order["type"] = types[Math.floor(Math.random() * types.length)];
      order["amount"] = Math.floor(Math.random() * 10);
      order["price"] = Math.floor(Math.random() * 400 + 100);
      order["isHandled"] = false;
      axios
        .post(ORDER_ENDPOINT, { order })
        .then((res) => {
          setOrders((orders) => {
            if (orders.length >= count - 1) clearInterval(simulationInterval);
            else orders.unshift(order);
            return orders;
          });
          setHistory(res.data.history);
          setUsersData(res.data.users);
          setPrice(res.data.currPrice);
          setData(res.data.data);
          setPendingBids(res.data.pendingBids);
          setPendingAsks(res.data.pendingAsks);
        })
        .catch((err) => console.log(err));
    }, 1000);
  }, [setHistory, setUsersData, setPrice, setData, setOrders]);

  useEffect(() => {
    setFrom(usersData[0]?.name);
  }, [usersData])

  const handleOrder = () => {
    setStkPriceErr(stkPrice <= 0 ? "Enter a valid price (Greater Than 0)" : "");
    console.log(amount);
    console.log(usersData.find((user) => user.name === from).stocks);
    setAmountErr(!(amount > 0 && (mode === "buy" || amount <= Number(usersData.find((user) => user.name === from).stocks))) ? "Enter a valid amount (Greater than 0 But Less Than Total)" : "");
    if (stkPrice > 0 && amount > 0 && (mode === "buy" || amount <= Number(usersData.find((user) => user.name === from).stocks))) {
      try {
        const order = { from, mode, type, amount, price: stkPrice, isHandled: false };
        setOrders((orders) => {
          orders.unshift(order);
          return orders;
        });
        axios
          .post(ORDER_ENDPOINT, { order })
          .then((res) => {
            setHistory(res.data.history);
            setUsersData(res.data.users);
            setPrice(res.data.currPrice);
            setData(res.data.data);
            console.log(res.data.pendingBids);
            setPendingBids(res.data.pendingBids);
            setPendingAsks(res.data.pendingAsks);
            setStkPrice(0);
            setAmount(0);
            setOpen(true);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div classfrom="buySell">
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          Order placed successfully!
        </MuiAlert>
      </Snackbar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <FormControl
          style={{ marginBottom: "10px", marginTop: "5px" }}
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">Buy/Sell</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={mode}
            label="Buy/Sell"
            onChange={(e) => setMode(e.target.value)}
          >
            <MenuItem value={"buy"}>Buy</MenuItem>
            <MenuItem value={"sell"}>Sell</MenuItem>
          </Select>
        </FormControl>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <FormControl style={{ flex: "1", marginRight: "5px" }}>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={from}
              label="User"
              onChange={(e) => setFrom(e.target.value)}
            >
              {usersData.map((user, index) => (
                <MenuItem key={"user" + index} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ flex: "1", marginLeft: "5px" }}>
            <InputLabel id="demo-simple-select-label">Order Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Order Type"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value={"limit"}>Limit</MenuItem>
              <MenuItem value={"market"}>Market</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <TextField
            style={{ flex: "1", marginRight: "5px" }}
            label="Stocks Amount"
            type="number"
            value={amount}
            error={Boolean(amountErr)}
            helperText={amountErr}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            style={{ flex: "1", marginLeft: "5px" }}
            label="At Price"
            type="number"
            value={stkPrice}
            error={Boolean(stkPriceErr)}
            helperText={stkPriceErr}
            onChange={(e) => setStkPrice(e.target.value)}
          />
        </div>
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleOrder()} fullWidth variant="contained">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buysell;
