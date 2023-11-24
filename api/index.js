const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleWare = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./models/Post");


const salt = bcrypt.genSaltSync(10);
const secret = "efviqjwk7930rtjhefvijkfjfjdfkjfiwrfjiehnjeoj66";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://blogapp:QnKFWWbS51NNtdhs@cluster0.uphl20l.mongodb.net/?retryWrites=true&w=majority",
      {}
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    // Handle the error appropriately, you might want to exit the process or do some other cleanup
  }
}

connect();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong Cradentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  res.json(req.cookies);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleWare.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summery, content } = req.body;
    const authorInfo = await User.findById(info.id);
    const postDoc = await Post.create({
      title,
      summery,
      content,
      cover: newPath,
      author: authorInfo,
    });
    res.json(postDoc);
  });
});
app.put("/post", uploadMiddleWare.single("file"), async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
      }
  
      const { token } = req.cookies;
  
      const info = await jwt.verify(token, secret, {});
      const { id, title, summery, content } = req.body;
      const postDoc = await Post.findOneAndUpdate(
        { _id: id, author: info.id },
        {
          title,
          summery,
          content,
          cover: newPath ? newPath : postDoc.cover,
        },
        { new: true }
      );
  
      if (!postDoc) {
        return res.status(400).json("You are not the Author or Post not found");
      }
  
      res.json(postDoc);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json("Internal Server Error");
    }
  });
  

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
     
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});



  app.listen(4000);

module.exports = app; //for catching vercel

