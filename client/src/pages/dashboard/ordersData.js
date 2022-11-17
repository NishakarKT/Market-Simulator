const count = 100;
const names = ["A","B","C","D","E"];
const modes = ["buy","sell"];
const types = ["limit","market"];
const ordersData = [];

for (let i = 0; i < count; i++) {
  const data = {};
  data["from"] = names[Math.floor(Math.random() * names.length)];
  data["mode"] = modes[Math.floor(Math.random() * modes.length)];
  data["type"] = types[Math.floor(Math.random() * types.length)];
  data["amount"] = Math.floor(Math.random() * 10);
  data["price"] = Math.floor(Math.random() * 400 + 100);
  data["time"] = Math.floor(Math.random() * 9e6 + 1e6);
  ordersData.push(data);
}

export default ordersData;
