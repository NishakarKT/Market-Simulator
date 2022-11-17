import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Orders({ usersData }) {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Stocks</TableCell>
            <TableCell>Fiats</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user, index) => (
            <TableRow key={"user" + user.name}>
              <TableCell>{index + 1}</TableCell>
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
