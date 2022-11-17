import PriorityQueue from "js-priority-queue";
import clone from "clone";
import usersData from "../data/usersData.js";
import { io } from "../index.js";
import { Order } from "../models.js";

let data = [];
let history = [];
let currPrice = 0;
let pendingBids = [];
let pendingAsks = [];
let users = usersData;

const minHeap = new PriorityQueue({
  comparator: (a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    else return a.time - b.time;
  },
});

const maxHeap = new PriorityQueue({
  comparator: (a, b) => {
    if (a.price !== b.price) return b.price - a.price;
    else return a.time - b.time;
  },
});

const getPendingOrders = (pq, mode) => {
  let copy = clone(pq);
  let orders = [];
  while (copy.priv.data.length) {
    const order = copy.dequeue();
    if (mode === order.mode) orders.push(order);
  }
  return orders;
};

const processOrder = (order) => {
  if (!order) return;
  if (order.type === "limit") {
    if (order.mode === "sell") {
      let matchBid = maxHeap.priv.data.find(
        (ordr) =>
          ordr.mode === "buy" &&
          ordr.price === order.price &&
          ordr.from !== order.from
      );
      while (matchBid && Number(order.amount) > 0) {
        currPrice = Number(matchBid.price);
        let diff = Number(matchBid.amount) - Number(order.amount);
        if (diff >= 0) {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(matchBid.price) * Number(order.amount);
          }
          idx = users.findIndex((user) => user.name === matchBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(matchBid.price) * Number(order.amount);
          }
          history.unshift({
            from: order.from,
            to: matchBid.from,
            amount: Number(order.amount),
            price: Number(matchBid.price) * Number(order.amount),
            time: Date.now(),
          });
          idx = maxHeap.priv.data.findIndex(
            (ordr) =>
              ordr.mode === "buy" &&
              ordr.price === order.price &&
              ordr.from !== order.from
          );
          if (diff > 0) {
            if (idx !== -1) maxHeap.priv.data[idx].amount = Number(diff);
          } else {
            if (idx !== -1) maxHeap.priv.data.splice(idx, 1);
          }
          order.amount = 0;
        } else {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(matchBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(matchBid.price) * Number(matchBid.amount);
          }
          idx = users.findIndex((user) => user.name === matchBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(matchBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(matchBid.price) * Number(matchBid.amount);
          }
          history.unshift({
            from: order.from,
            to: matchBid.from,
            amount: Number(matchBid.amount),
            price: Number(matchBid.price) * Number(matchBid.amount),
            time: Date.now(),
          });
          idx = maxHeap.priv.data.findIndex(
            (ordr) =>
              ordr.mode === "buy" &&
              ordr.price === order.price &&
              ordr.from !== order.from
          );
          if (idx !== -1) maxHeap.priv.data.splice(idx, 1);
          order.amount = -diff;
        }
      }
      if (Number(order.amount) > 0) minHeap.queue(order);
    } else if (order.mode === "buy") {
      let matchBid = minHeap.priv.data.find(
        (ordr) =>
          ordr.mode === "sell" &&
          ordr.price === order.price &&
          ordr.from !== order.from
      );
      while (matchBid && Number(order.amount) > 0) {
        currPrice = Number(matchBid.price);
        let diff = Number(matchBid.amount) - Number(order.amount);
        if (diff >= 0) {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(matchBid.price) * Number(order.amount);
          }
          idx = users.findIndex((user) => user.name === matchBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(matchBid.price) * Number(order.amount);
          }
          history.unshift({
            from: order.from,
            to: matchBid.from,
            amount: Number(order.amount),
            price: Number(matchBid.price) * Number(order.amount),
            time: Date.now(),
          });
          idx = maxHeap.priv.data.findIndex(
            (ordr) =>
              ordr.mode === "sell" &&
              ordr.price === order.price &&
              ordr.from !== order.from
          );
          if (diff > 0) {
            if (idx !== -1) maxHeap.priv.data[idx].amount = Number(diff);
          } else {
            if (idx !== -1) maxHeap.priv.data.splice(idx, 1);
          }
          order.amount = 0;
        } else {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(matchBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(matchBid.price) * Number(matchBid.amount);
          }
          idx = users.findIndex((user) => user.name === matchBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(matchBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(matchBid.price) * Number(matchBid.amount);
          }
          history.unshift({
            from: order.from,
            to: matchBid.from,
            amount: Number(matchBid.amount),
            price: Number(matchBid.price) * Number(matchBid.amount),
            time: Date.now(),
          });
          idx = maxHeap.priv.data.findIndex(
            (ordr) =>
              ordr.mode === "sell" &&
              ordr.price === order.price &&
              ordr.from !== order.from
          );
          if (idx !== -1) maxHeap.priv.data.splice(idx, 1);
          order.amount = -diff;
        }
      }
      if (Number(order.amount) > 0) maxHeap.queue(order);
    }
  } else if (order.type === "market") {
    if (order.mode === "sell") {
      let highestBid = maxHeap.priv.data.length ? maxHeap.priv.data[0] : 0; //peek
      while (highestBid && Number(order.amount) > 0) {
        highestBid = maxHeap.dequeue();
        if (highestBid.from === order.from) {
          highestBid = maxHeap.priv.data.length;
          continue;
        }
        currPrice = Number(highestBid.price);
        let diff = Number(highestBid.amount) - Number(order.amount);
        if (diff >= 0) {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(highestBid.price) * Number(order.amount);
          }
          idx = users.findIndex((user) => user.name === highestBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(highestBid.price) * Number(order.amount);
          }
          history.unshift({
            from: order.from,
            to: highestBid.from,
            amount: Number(order.amount),
            price: Number(highestBid.price) * Number(order.amount),
            time: Date.now(),
          });
          if (diff) maxHeap.queue(highestBid);
          highestBid.amount = Number(highestBid.amount) - Number(order.amount);
          order.amount = 0;
        } else {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(highestBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(highestBid.price) * Number(highestBid.amount);
          }
          idx = users.findIndex((user) => user.name === highestBid.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(highestBid.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(highestBid.price) * Number(highestBid.amount);
          }
          history.unshift({
            from: order.from,
            to: highestBid.from,
            amount: Number(highestBid.amount),
            price: Number(highestBid.price) * Number(highestBid.amount),
            time: Date.now(),
          });
          order.amount = -diff;
          highestBid.amount = 0;
          highestBid = maxHeap.priv.data.length;
        }
      }
      if (Number(order.amount) > 0) minHeap.queue(order);
    } else if (order.mode === "buy") {
      let lowestAsk = minHeap.priv.data.length ? minHeap.priv.data[0] : 0; //peek
      while (lowestAsk && Number(order.amount) > 0) {
        lowestAsk = minHeap.dequeue();
        if (lowestAsk.from === order.from) {
          lowestAsk = minHeap.priv.data.length;
          continue;
        }
        currPrice = Number(lowestAsk.price);
        let diff = Number(lowestAsk.amount) - Number(order.amount);
        if (diff >= 0) {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(lowestAsk.price) * Number(order.amount);
          }
          idx = users.findIndex((user) => user.name === lowestAsk.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(order.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(lowestAsk.price) * Number(order.amount);
          }
          history.unshift({
            from: order.from,
            to: lowestAsk.from,
            amount: Number(order.amount),
            price: Number(lowestAsk.price) * Number(order.amount),
            time: Date.now(),
          });
          if (diff) minHeap.queue(lowestAsk);
          lowestAsk.amount = Number(lowestAsk.amount) - Number(order.amount);
          order.amount = 0;
        } else {
          let idx = users.findIndex((user) => user.name === order.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) + Number(lowestAsk.amount);
            users[idx].fiats =
              Number(users[idx].fiats) -
              Number(lowestAsk.price) * Number(lowestAsk.amount);
          }
          idx = users.findIndex((user) => user.name === lowestAsk.from);
          if (idx !== -1) {
            users[idx].stocks =
              Number(users[idx].stocks) - Number(lowestAsk.amount);
            users[idx].fiats =
              Number(users[idx].fiats) +
              Number(lowestAsk.price) * Number(lowestAsk.amount);
          }
          history.unshift({
            from: order.from,
            to: lowestAsk.from,
            amount: Number(lowestAsk.amount),
            price: Number(lowestAsk.price) * Number(lowestAsk.amount),
            time: Date.now(),
          });
          order.amount = -diff;
          lowestAsk.amount = 0;
          lowestAsk = minHeap.priv.data.length;
        }
      }
      if (Number(order.amount) > 0) maxHeap.queue(order);
    }
  }

  const date = new Date();
  data.push({
    time: date.toISOString(),
    amount: currPrice,
  });

  pendingBids = getPendingOrders(maxHeap, "buy");
  pendingAsks = getPendingOrders(minHeap, "sell");

  io.sockets.emit("currData", {
    currPrice,
    data,
    history,
    users,
    pendingBids,
    pendingAsks,
  });

  return { currPrice, data, history, users, pendingBids, pendingAsks };
};

export const acceptOrder = (req, res) => {
  const { order } = req.body;

  const data = processOrder(order);
  res.status(200).send(data);

  // const newOrder = new Order(order);
  // newOrder.save()
  // .then(result => {
  //   const data = processOrder(order);
  //   Order.findByIdAndUpdate(result._id, { isHandled: true }, {new: true}, (err, docs) => {
  //     if (err)
  //       {}
  //     else
  //       {}
  //   });
  //   res.status(200).send(data);
  // })
  // .catch(err => res.status(550).send(err))
};

export const getData = (req, res) => {
  res
    .status(200)
    .send({ currPrice, data, history, users, pendingBids, pendingAsks });
};

export const newUser = (req, res) => {
  const { name, stocks, fiats } = req.body;
  if (users.find((user) => user.name === name)) {
    const idx = users.findIndex((user) => user.name === name);
    users[idx].stocks = stocks;
    users[idx].fiats = fiats;
    res.status(201).send("User Updated!");
  } else {
    users.push({ name, stocks, fiats });
    res.status(201).send("User Created!");
  }
};

// // server crash handling
// Order.find({isHandled: false})
// .sort( { 'timestamp': -1 } )
// .then(res => {
//   res.map(order => {
//     processOrder(order);
//     Order.findByIdAndUpdate(order._id, { isHandled: true }, {new: true}, (err, docs) => {
//       if (err) console.log(err);
//       else console.log("Updated User : ", docs);
//     });
//   });
// })
// .catch(err => console.log(err))
