import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Loader from "../../components/loader/Loader";
import { NEW_USER_ENDPOINT } from "../../constants/endpoints";
import { DASHBOARD_ROUTE } from "../../constants/routes";
import { Alert } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Kodein Hackathon
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState(0);
  const [fiats, setFiats] = useState(0);
  const [nameErr, setNameErr] = useState("");
  const [stocksErr, setStocksErr] = useState("");
  const [fiatsErr, setFiatsErr] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setNameErr(!name ? "Please, enter your name!" : "");
    setStocksErr(stocks <= 0 ? "Enter stocks amount > 0" : "");
    setFiatsErr(fiats <= 0 ? "Enter fiats amount > 0" : "");
    if(name && stocks > 0 && fiats > 0){
      setIsLoading(true);
      try{
        axios.post(NEW_USER_ENDPOINT, {name, stocks, fiats})
        .then(res => {
          console.log(res);
          setIsLoading(false);
          navigate(DASHBOARD_ROUTE);
          setName("");
          setStocks(0);
          setFiats(0);
        })
        .catch(err => {
          setIsLoading(false);
          Alert("Something went wrong!")
        });
      }catch(err){console.log(err);setIsLoading(false);};
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? <Loader /> : null}
      <Container
        component="main"
        maxWidth="xs"
        style={{
          display: "grid",
          placeItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonAddRoundedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create/Update User
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(nameErr)}
              helperText={nameErr}
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              error={Boolean(stocksErr)}
              helperText={stocksErr}
              id="stocks"
              label="Stocks"
              name="stocks"
              autoComplete="stocks"
            />
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              value={fiats}
              onChange={(e) => setFiats(e.target.value)}
              error={Boolean(fiatsErr)}
              helperText={fiatsErr}
              id="fiats"
              label="Fiats"
              name="fiats"
              autoComplete="fiats"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Create/Update
            </Button>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}