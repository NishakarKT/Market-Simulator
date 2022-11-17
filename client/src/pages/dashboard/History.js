import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
// data
import userData from "./userData";

export default function History() {
  return (
    <React.Fragment>
      <Title>Users</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Stocks</TableCell>
            <TableCell>Fiats</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((user, index) => (
            <TableRow key={"user" + user.name}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.stocks}</TableCell>
              <TableCell>{user.fiats}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
