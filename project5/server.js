const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const nedb = require("@seald-io/nedb");
const http = require("http");
const { Server } = require("socket.io");
const expressSession = require("express-session");
const nedbSessionStore = require("nedb-promises-session-store");
const bcrypt = require("bcryptjs");
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const upload = multer({
  dest: "public/uploads",
});

let database = new nedb({
  filename: "database.txt",
  autoload: true,
});

app.use("/audio", express.static(path.join(__dirname, "public/audio")));
app.use(express.static("public"));
app.use(urlEncodedParser);
app.set("view engine", "ejs");

const nedbSessionInit = nedbSessionStore({
  connect: expressSession,
  filename: "sessions.txt",
});

app.use(
  expressSession({
    store: nedbSessionInit,
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    secret: "supersecret123",
    resave: false,
    saveUninitialized: false,
  })
);

let userdatabase = new nedb({
  filename: "userdb.txt",
  autoload: true,
});

function requiresAuth(req, res, next) {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

function initializeOnlineUsers() {
  database.findOne({ key: "onlineUsers" }, (err, doc) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return;
    }
    if (!doc) {
      database.insert({ key: "onlineUsers", value: 0 }, (err) => {
        if (err) {
          console.error("初始化 onlineUsers 失败:", err);
        } else {
          console.log("已初始化 onlineUsers 为 0");
        }
      });
    } else {
      console.log("onlineUsers 已存在，当前值为:", doc.value);
    }
  });
}

initializeOnlineUsers();

app.get("/", requiresAuth, (req, res) => {
  const username = req.session.loggedInUser;

  database.findOne({ key: "onlineUsers" }, (err, onlineUsersDoc) => {
    const onlineUsers = err || !onlineUsersDoc ? 0 : onlineUsersDoc.value;

    userdatabase.findOne({ username: username }, (err, userDoc) => {
      if (err || !userDoc) {
        console.error("无法获取用户信息:", err);
        res.render("index.ejs", {
          onlineUsers: onlineUsers,
          username: username,
          points: 0,
          totalpoints: totalPoints,
          messages: [],
          rank: 1,
          remainingTime: 0,
        });
      } else {
        database
          .find({})
          .sort({ timestamp: -1 })
          .exec((err, messages) => {
            if (err) {
              console.error("数据库查询错误:", err);
              return res.status(500).send("服务器错误");
            }

            res.render("index.ejs", {
              onlineUsers: onlineUsers,
              username: username,
              points: userDoc.points,
              totalpoints: totalPoints,
              messages: messages,
              rank: userDoc.rank + 1,
              remainingTime: remainingTime,
            });
          });
      }
    });
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", {});
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {});
});

app.post("/signup", upload.single("profilePicture"), (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    console.log("用户名或密码为空");
    return res.redirect("/register");
  }

  userdatabase.findOne({ username: username }, (err, existingUser) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return res.status(500).send("服务器错误");
    }

    if (existingUser) {
      console.log("用户名已存在");
      return res.redirect("/register");
    }

    let data = {
      username: req.body.username,
      fullname: req.body.fullname,
      password: hashedPassword,
      onlineStatus: false,
      rank: 0,
      points: 0,
    };

    userdatabase.insert(data, (err, insertedData) => {
      if (err) {
        return res.status(500).send("用户数据插入失败");
      }
      res.redirect("/login");
    });
  });
});

app.post("/authenticate", (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
  };
  let query = {
    username: data.username,
  };
  userdatabase.findOne(query, (err, user) => {
    console.log("attempted login");
    if (err || user == null) {
      res.redirect("/login");
    } else {
      console.log("found user");
      let encPass = user.password;

      if (onlineUsers.includes(data.username)) {
        console.log("User is already online");
        res.redirect("/login");
      } else if (bcrypt.compareSync(data.password, encPass)) {
        console.log("successful login");
        let session = req.session;
        session.loggedInUser = data.username;
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.get("/logout", (req, res) => {
  delete req.session.loggedInUser;
  res.redirect("/login");
});

let onlineUsers = [];
let totalPoints = 0;
let remainingTime = 24 * 60 * 60 * 1000;

function updateRemainingTime(interval) {
  remainingTime -= interval;
  if (remainingTime <= 0) {
    remainingTime = 24 * 60 * 60 * 1000;
    resetUserData();
  }
}

function resetUserData() {
  userdatabase.find({}, (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return;
    }

    users.forEach((user) => {
      userdatabase.update(
        { _id: user._id },
        { $set: { rank: 0, points: 0 } },
        { upsert: false },
        (err, numReplaced) => {
          if (err) {
            console.error(`Error resetting user ${user.username}:`, err);
          } else {
            totalPoints = 0;
            console.log(`User ${user.username} reset successfully.`);
          }
        }
      );
    });
  });
}

setInterval(() => {
  updateRemainingTime(1000);
}, 1000);

io.on("connection", (socket) => {
  let lastClickTime = 0;

  database.update(
    { key: "onlineUsers" },
    { $inc: { value: 1 } },
    { upsert: false },
    (err, numAffected) => {
      if (err) {
        console.error("更新 onlineUsers 失败:", err);
        return;
      }
      database.findOne({ key: "onlineUsers" }, (err, doc) => {
        if (doc) {
          io.emit("updateOnlineUsers", doc.value);
        }
      });
    }
  );

  setInterval(() => {
    io.emit("updateTotalPoints", totalPoints);
  }, 1000);

  socket.on("donatePoints", (data) => {
    const { username } = data;

    if (!username) {
      console.log("用户名未提供或无效");
      return;
    }

    userdatabase.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error("数据库查询失败:", err);
        return;
      }

      if (user) {
        const pointsToDonate = user.points;

        if (pointsToDonate <= 0) {
          return;
        }

        const updatedPoints = 0;

        userdatabase.update(
          { username: username },
          { $set: { points: updatedPoints } },
          { upsert: false },
          (err) => {
            if (err) {
              console.error("更新用户 points 失败:", err);
              return;
            }

            totalPoints += pointsToDonate;
            io.emit("updateTotalPoints", totalPoints);
            socket.emit("updatePoints", updatedPoints);
            socket.emit("exceedwarning", { message: "大慈大悲功德无量！" });
          }
        );
      } else {
        console.log(`未找到用户 ${username}`);
      }
    });
  });

  socket.on("updateUserPointsAndRank", (data) => {
    const { username } = data;

    userdatabase.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error("数据库查询失败:", err);
        return;
      }

      if (user) {
        let updatedPoints =
          user.points - 100 * (user.rank + 1) - 100 * user.rank;
        if (updatedPoints < 0) {
          console.log(`警告：用户 ${username} 功德不足，无法升级`);
          socket.emit("underwarning", {
            message: "您的功德不足，无法升级！",
          });
          return;
        }
        let updatedRank = 0;
        if (user.rank < 4) {
          updatedRank = user.rank + 1;
        } else {
          console.log(`已满级，无法继续操作`);
          socket.emit("exceedwarning", { message: "木鱼已满级！" });
          return;
        }

        userdatabase.update(
          { username: username },
          { $set: { points: updatedPoints, rank: updatedRank } },
          { upsert: false },
          (err) => {
            if (err) {
              console.error("更新用户积分和排名失败:", err);
              return;
            }

            console.log(
              `用户 ${username} 的积分已更新为 ${updatedPoints}，排名已提升至 ${updatedRank}`
            );
            socket.emit("updateRank", updatedRank);
            socket.emit("exceedwarning", { message: "大慈大悲功德无量！" });
          }
        );
      } else {
        console.log("未找到该用户");
      }
    });
  });

  socket.on("userClick", (data) => {
    const { username } = data;
    if (!username) {
      console.log("用户名未提供或无效");
      return;
    }

    const currentTime = Date.now();

    if (currentTime - lastClickTime < 50) {
      return;
    }

    lastClickTime = currentTime;

    userdatabase.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error("数据库查询失败:", err);
        return;
      }

      if (user) {
        const rank = user.rank;
        const pointsToAdd = rank + 1;

        const updatedPoints = user.points + pointsToAdd;

        userdatabase.update(
          { username: username },
          { $set: { points: updatedPoints } },
          { upsert: false },
          (err, numReplaced) => {
            if (err) {
              console.error("更新用户 points 失败:", err);
              return;
            }
            if (numReplaced === 0) {
              console.log(`没有找到用户 ${username}，未能更新积分`);
            }

            socket.emit("updatePoints", updatedPoints);

            totalPoints += pointsToAdd;
            io.emit("updateTotalPoints", totalPoints);
          }
        );
      } else {
        console.log(`未找到用户 ${username}`);
      }
    });
  });

  socket.on("startNuclear", (data) => {
    const { username } = data;

    if (!username) {
      console.log("用户名未提供或无效");
      return;
    }

    userdatabase.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error("数据库查询失败:", err);
        return;
      }

      let updatedPoints = user.points - 5000;

      if (updatedPoints < 0) {
        console.log(`警告：用户 ${username} 积分不足，无法继续操作`);
        socket.emit("underwarning", {
          message: "您的功德不足，无法启动",
        });
        return;
      }

      if (user) {
        userdatabase.update(
          { username: username },
          { $set: { points: updatedPoints } },
          { upsert: false },
          (err) => {
            if (err) {
              console.error("更新用户 points 失败:", err);
              return;
            }

            console.log(`用户 ${username} 的积分已更新为 ${updatedPoints}`);

            socket.emit("updatePoints", updatedPoints);
            socket.emit("nuclearStarted");
            socket.emit("exceedwarning", {
              message: "已启动终极木鱼，请勿刷新网页!",
            });
          }
        );
      } else {
        console.log(`未找到用户 ${username}`);
      }
    });
  });

  socket.on("registerUser", (username) => {
    socket.username = username;
    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }
    io.emit("updateUserList", onlineUsers);
  });

  socket.on("newMessage", (message) => {
    console.log("收到新消息:", message);

    const messageData = {
      id: Date.now(),
      content: message,
      timestamp: new Date(),
    };
    database.insert(messageData, (err) => {
      console.log(`消息已存入 (ID: ${messageData.id})`);
      if (err) {
        console.error("数据库插入错误:", err);
        return;
      }

      io.emit("updateMessage", messageData);

      setTimeout(() => {
        database.remove({ id: messageData.id }, {}, (err, numRemoved) => {
          if (err) {
            console.error("数据库删除错误:", err);
          } else {
            console.log(`消息已删除 (ID: ${messageData.id})`);
          }
        });
      }, 15000);
    });
  });

  socket.on("laugh", (data) => {
    const { username } = data;
    userdatabase.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error("数据库查询失败:", err);
        return;
      }

      if (user) {
        let updatedPoints = user.points - 500;

        userdatabase.update(
          { username: username },
          { $set: { points: updatedPoints } },
          { upsert: false },
          (err) => {
            if (err) {
              console.error("更新用户积分失败:", err);
              return;
            }

            console.log(`用户 ${username} 的积分已更新为 ${updatedPoints}`);
            socket.emit("exceedwarning", { message: "功德-500!" });
            socket.emit("updatePoints", updatedPoints);
          }
        );
      } else {
        console.log("未找到该用户");
      }
    });

    io.emit("playLaugh");
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user !== socket.username);
    io.emit("updateUserList", onlineUsers);
    database.update(
      { key: "onlineUsers" },
      { $inc: { value: -1 } },
      { upsert: true },
      (err) => {
        if (err) {
          console.error("更新 onlineUsers 失败:", err);
          return;
        }
        database.findOne({ key: "onlineUsers" }, (err, doc) => {
          if (doc) {
            io.emit("updateOnlineUsers", doc.value);
          }
        });
      }
    );
  });
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});
