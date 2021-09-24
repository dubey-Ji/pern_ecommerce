const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");

const authenticate = require("./middleware/auth");

// calling queries function
const fun = require("./database/queries");

const multer = require("multer");
const imageUpload = multer({
  dest: "images",
});

router.get("/", (req, res) => {
  res.send("Hello this is home page");
});

router.get("/users", fun.getUsers);

router.get("/specific", authenticate, fun.getUserSpecific);

router.post("/registerbuyer", fun.addBuyerUser);

router.post("/registerseller", fun.addSellerUser);

router.get("/authorization", authenticate, fun.getRole);

router.post("/userlogin", fun.userLogin);

router.post("/addproduct", fun.addProduct);

router.get("/getproduct", fun.getProduct);

router.post("/getcatproduct", fun.getCatProduct);

router.post("/getcatproductwithlimit", fun.getCatProductWithLimit);

router.post("/getspecificproduct", fun.getSpecificProduct);

// Image upload route
// imageUpload.single("image")
// router.post("/image", imageUpload.single("image"), fun.addImage);

// Image get route
// router.get("/image/:filename", fun.getImage);

module.exports = router;
