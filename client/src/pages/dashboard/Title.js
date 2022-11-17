import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" style={{backgroundColor: "white", padding: "10px", borderRadius: "5px", boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)", marginTop: props.mt ? "20px" : "0px"}} gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
