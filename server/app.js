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
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, uniquePrefix + file.originalname);
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

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload/:uniqueRequest", upload.array("userFiles"), (req, res) => {
  const fileArr = [];
  console.log(req.files);
  req.files.forEach((elem) =>
    fileArr.push({
      fileName: elem.originalname,
      filePath: elem.filename,
      fileType: elem.mimetype,
    })
  );
  let oldFile = fs.readFileSync(
    path.join(__dirname, "/..", "uploads", "uploadMap.json"),
    "utf-8"
  );
  oldFile = JSON.parse(oldFile);
  oldFile.push({
    userName: req.body.name,
    roll: req.body.roll,
    fileArr,
    uniqueRequest: req.params.uniqueRequest,
  });
  console.log(oldFile);
  fs.writeFileSync(
    path.join(__dirname, "/..", "uploads", "uploadMap.json"),
    JSON.stringify(oldFile)
  );
  res.send(fileArr);
});

app.get("/previewfiles/:uniqueRequest", (req, res) => {
  const uniqueReq = req.params.uniqueRequest;
  let fileData = fs.readFileSync(
    path.join(__dirname, "/..", "uploads", "uploadMap.json"),
    "utf-8"
  );
  fileData = JSON.parse(fileData).filter(
    (elem) => elem.uniqueRequest === uniqueReq
  );
  res.render("sucessfull.ejs", { previewData: fileData[0] });
});

app.get("/getFile/:fileName", (req, res) => {
  res.sendFile(path.join(__dirname, "/..", "uploads", req.params.fileName));
});

app.listen(port, () => console.log(`server is running at ${port}`));
