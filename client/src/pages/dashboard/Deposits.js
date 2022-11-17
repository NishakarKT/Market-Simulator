import React from "react";
import Typography from "@mui/material/Typography";

export default function Deposits({ price }) {
  return (
    <React.Fragment>
      <Typography component="p" variant="h4">
        $ {price ? price : 0}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {new Date().toLocaleString("en-US")}
      </Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={(e) => {e.preventDefault()}}>
          View balance
        </Link> */}
      </div>
    </React.Fragment>
  );
}
