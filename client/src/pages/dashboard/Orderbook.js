import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Orders({ orders, type }) {
  const getOrderBook = orders => {
    const orderBook = {};
    orders.forEach(order => {
      if(orderBook[order.price])
        orderBook[order.price].amount =  Number(orderBook[order.price].amount) + Number(order.amount);
      else
        orderBook[order.price] = { type: order.type, amount: order.amount };
    })
    const modifiedOrderBook = Object.keys(orderBook).map(price => ({type: orderBook[price].type, amount: orderBook[price].amount, price}));
    return type === "ask" ? modifiedOrderBook : modifiedOrderBook.reverse();
  };
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Stocks</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getOrderBook(orders).map((order, index) => (
            <TableRow key={"order" + index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.type}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
