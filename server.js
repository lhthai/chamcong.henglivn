const express = require("express");
const port = process.env.PORT || 3000;
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
const app = new express();
const path = require("path");
const handle = require("./libs/handle");

// Configure middleware

// set storage engine
const storage = multer.diskStorage({
  destination: "./public/upload/",
  filename: function(req, file, cb) {
    cb(null, "file" + path.extname(file.originalname));
  }
});
// init upload
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("txtInput");
// CheckFileType function
function checkFileType(file, cb) {
  const filetypes = /xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb("Error: Chỉ sử dụng file excel .xlsx");
  }
}
// configure helmet middleware
app.use(helmet());

// configure expression middleware
app.use(compression());

// configure ejs middleware
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

// setting up routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.download('1531185931185.txt')
      res.redirect('/');
    } else {
      handle.handleFileAddDate();
      res.redirect('/');
    }
  });
});

app.post("/keepdate", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.download('1531185931185.txt')
      res.redirect('/');
    } else {
      handle.handleFileKeepDate();
      res.redirect('/');
    }
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

app.listen(port, () => console.log(`App running on port ${port}`));
