const db = require("./connection");
const jwt = require("jsonwebtoken");
const path = require("path");

const getUsers = async (req, res) => {
  try {
    // const user = req.user;
    const userList = await db.query("select * from user_buyer");
    res.sendStatus(200).json(userList.rows);
    // console.log(user);
  } catch (error) {
    console.log(error);
  }
};

const addBuyerUser = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, role, address, password } = req.body;

    // Checking if user exists
    const response = await db
      .select("*")
      .from("user_buyer")
      .where({ buyer_email: email });

    if (response.length === 0) {
      // adding user if user does not exist
      const data = await db
        .insert({
          buyer_name: fullname,
          buyer_email: email,
          buyer_phno: phoneNumber,
          buyer_role: role,
          buyer_address: address,
          buyer_pass: password,
        })
        .into("user_buyer")
        .returning("*");
      console.log(data);
      res.status(200).json(data.rows[0]);
      //   console.log("User does not exist");
    } else {
      res.status(402).json("Message: User already exist");
    }
  } catch (error) {
    console.log(error);
  }
};

// Seller Register
const addSellerUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      role,
      shopName,
      shopAddress,
      password,
    } = req.body;

    // Checking if user exists
    const response = await db
      .select("*")
      .from("user_seller")
      .where({ seller_email: email });
    console.log(response.length);

    if (response.length === 0) {
      // adding user if user does not exist
      const data = await db
        .insert({
          seller_name: fullname,
          seller_email: email,
          seller_phno: phoneNumber,
          seller_role: role,
          seller_shop_name: shopName,
          seller_address: shopAddress,
          seller_pass: password,
        })
        .into("user_seller")
        .returning("*");

      console.log(data);
      res.status(200).json(data[0]);
      //   console.log("User does not exist");
    } else {
      res.status(402).json("Message: User already exist");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  let accessToken;
  const responseSeller = await db
    .select("*")
    .from("user_seller")
    .whereRaw("seller_email = ? and seller_pass = crypt(?, seller_pass)", [
      email,
      password,
    ]);

  console.log(responseSeller);

  const responseBuyer = await db
    .select("*")
    .from("user_buyer")
    .whereRaw("buyer_email = ? and buyer_pass = crypt(?, buyer_pass)", [
      email,
      password,
    ]);

  console.log(responseBuyer);

  if (responseSeller.length === 1) {
    let data = responseSeller[0];
    console.log(data.seller_role);
    const payload = {
      role: data.seller_role,
      id: data.seller_id,
    };

    accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    console.log(`User login Successful with ${accessToken}`);
    res.cookie("jwtoken", accessToken);

    res.status(200).json(responseSeller[0]);
  } else if (responseBuyer.length === 1) {
    let data = responseBuyer[0];
    const payload = {
      role: data.buyer_role,
      id: data.buyer_id,
    };

    accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    console.log(`User login Successful with ${accessToken}`);
    res.cookie("jwtoken", accessToken);

    res.status(200).json(responseBuyer[0]);
  } else {
    res.status(400).json("Message: Invalid Credentials");
  }
};

const getUserSpecific = async (req, res) => {
  console.log(req.body);
};

const getRole = async (req, res) => {
  const userInfo = req.user;
  console.log(userInfo);
  res.status(200).json(userInfo);
};

const addProduct = async (req, res) => {
  try {
    // console.log(req.body);
    const { productName, category, description, price, seller_id } = req.body;

    const id = parseInt(seller_id);

    const responseAddProduct = await db
      .insert({
        product_name: productName,
        product_category: category,
        product_desc: description,
        product_price: price,
        seller_id: id,
      })
      .into("products")
      .returning("*");

    if (responseAddProduct.length === 1) {
      res.status(200).json(responseAddProduct[0]);
    } else {
      res.status(400).json("Message: Something went wrong");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const data = await db
      .column("product_name", "product_category", "product_price")
      .select()
      .from("products");
    console.log(data);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json("Message: Unable to get products");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const getCatProduct = async (req, res) => {
  const { category } = req.body;
  if (category === "*") {
    const data = await db.select("*").from("products");
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(401).json("Message: Something went wrong");
    }
  } else {
    const data = await db
      .select("*")
      .from("products")
      .where({ product_category: category });
    // console.log(data);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(401).json("Message: Something went wrong");
    }
  }
};

const getCatProductWithLimit = async (req, res) => {
  const { category } = req.body;
  if (category === "*") {
    const data = await db.select("*").from("products");
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(401).json("Message: Something went wrong");
    }
  } else {
    const data = await db
      .select("*")
      .from("products")
      .where({ product_category: category })
      .limit("3");
    // console.log(data);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(401).json("Message: Something went wrong");
    }
  }
};

const getSpecificProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await db.select().from("products").where({ product_id: id });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json("Message: Something went wrong");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const addImage = async (req, res) => {
  try {
    console.log(req.file);
    // const { filename, mimetype, size } = req.file;
    // const filepath = req.file.path;
    // await db
    //   .insert({
    //     filename,
    //     filepath,
    //     mimetype,
    //     size,
    //   })
    //   .into("image_files");
    res.json(req.file);
  } catch (error) {
    console.log(error.message);
  }
};

const getImage = async (req, res) => {
  const { filename } = req.params;
  try {
    const images = await db.select("*").from("image_files").where({ filename });
    if (images[0]) {
      const dirname = path.resolve();
      const fullfilepath = path.join(dirname, images[0].filepath);
      res.type(images[0].mimetype).sendFile(fullfilepath);
    }
    res
      .status(404)
      .json({ success: false, message: "not found", stack: err.stack });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getUsers,
  addBuyerUser,
  addSellerUser,
  userLogin,
  getUserSpecific,
  getRole,
  addProduct,
  getProduct,
  getCatProduct,
  getCatProductWithLimit,
  getSpecificProduct,
  getImage,
  addImage,
};
