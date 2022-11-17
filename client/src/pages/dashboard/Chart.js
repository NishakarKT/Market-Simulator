import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from "recharts";

export default function Chart({ data }) {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "10px" }}>
          <p>On <span style={{color: "red", fontWeight: "bold"}}>{new Date(label).toLocaleString()}</span></p>
          <p>Price was <span style={{color: "red", fontWeight: "bold"}}>$ {payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            tickFormatter={str => format(parseISO(str), "MMM d")}
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Price ($)
            </Label>
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
