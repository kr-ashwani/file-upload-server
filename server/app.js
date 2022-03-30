const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
var multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/..", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// const upload = multer({ storage: storage });
const port = process.env.PORT || 3000;

//register view engine
app.set("view engine", "ejs"); //express will by default look up to views folder for ejs
// app.set("views","myViews"); //you can set default views to any folder

// for parsing application/json
// app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// Express 4.16+ has implemented their own version of body-parser so you do not need to add the dependency to your project. You can run it natively in express

// app.use(express.json()); // Used to parse JSON bodies
// app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload", upload.single("userFile"), (req, res) => {
  res.render("sucessfull", {
    userName: req.body.name,
    fileName: req.file.filename,
  });
});

app.get("/getFile/:fileName", (req, res) => {
  fs.createReadStream(
    path.join(__dirname, "/..", "uploads", req.params.fileName)
  ).pipe(res);
  // res.sendFile(path.join(__dirname, "/..", "uploads", req.params.fileName));
});

app.listen(port, () => console.log(`server is running at ${port}`));
