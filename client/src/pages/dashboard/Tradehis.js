import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Tradehis({ history }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);

  // useEffect(() => {
  //   if(history.length){
  //     setTotalPrice(totalPrice => totalPrice + history.slice(-1).price);
  //     setTotalStocks(totalStocks => totalStocks + history.slice(-1).stocks);
  //   }
  // }, [history]);

  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sl No</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Stocks</TableCell>
            <TableCell>Fiats</TableCell>
            <TableCell>Date/Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((hist, index) => (
            <TableRow key={"history" + index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{hist.from}</TableCell>
              <TableCell>{hist.to}</TableCell>
              <TableCell>{hist.amount}</TableCell>
              <TableCell>{hist.price}</TableCell>
              <TableCell>{new Date(hist.time).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
