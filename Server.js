const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
// const userRouter = require("./router/user");
// const PostRouter = require("./router/Post")


// Define JWT_SECRET globally
const JWT_SECRET = 'uhduyw72y3r7834y()gfiwehgd9283eiunvwo?eureuw£^ueds{sdefieofja]~}[[fjnerna334j3n';

app.use(express.json());
app.use(cors());
// app.use("/api/user" , userRouter);
// app.use("/api/post" , PostRouter )

// app.use("/api", router);

const mongoUrl = 'mongodb+srv://ewalsh27:uGkiVYrmB8@cluster.e5jaz1u.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((e) => console.error('Database connection error:', e));

require('./UserDetails');
const User = mongoose.model('UserInfo');

require('./ProductDetails'); // Assuming ProductDetails.js contains the Product model
const ProductModel = mongoose.model('ProductInfo');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File naming convention
  }
});

// Multer instance
const upload = multer({ 
  storage: storage,
  // Limit file size if needed
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });

    res.send({ status: 'ok' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, userType: user.userType }, JWT_SECRET);
      res.json({ status: 'ok', data: token });
    } else {
      res.status(401).json({ error: 'Invalid Password' });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/userData', authenticateUser, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userData = await User.findOne({ email: userEmail });
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send({ status: 'ok', userData: userData }); // Return all user data
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Create product endpoint
app.post('/createProduct', authenticateUser, upload.array('productImages', 5), async (req, res) => {
  try {
    const { product, description, category, donatedBy } = req.body; // Add donatedBy here
    const imageUrls = req.files.map(file => file.path.replace("public/", ""));

    const newProduct = await ProductModel.create({
      product,
      description,
      category,
      imageUrls,
      donatedBy // Add donatedBy field to the new product
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Failed to create product. Please try again later.' });
  }
});

// Fetch products endpoint
app.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
  }
});

// Fetch products endpoint
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await ProductModel.findById(productId);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
  }
});

// Update the route for updating a product
app.put('/api/donations/:id', authenticateUser, async (req, res) => {
  const donationId = req.params.id;
  const { product, description, category } = req.body;

  try {
    // Verify if the donationId is a valid ObjectId (if using MongoDB)
    if (!mongoose.isValidObjectId(donationId)) {
      return res.status(400).json({ error: 'Invalid donation ID' });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      donationId,
      { product, description, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product. Please try again later.' });
  }
});

// Add a route for deleting a product
app.delete('/api/products/:id', authenticateUser, async (req, res) => {
  const productId = req.params.id;

  try {
    // Verify if the productId is a valid ObjectId (if using MongoDB)
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product. Please try again later.' });
  }
});

// Display My Listing
app.get('/api/mylistings/:email', authenticateUser, async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log("User Email:", userEmail);

    const myListings = await ProductModel.find({ donatedBy: userEmail }).distinct('_id');
    console.log("My Listings:", myListings);

    const uniqueListings = await ProductModel.find({ _id: { $in: myListings } });
    console.log("Unique Listings:", uniqueListings);

    res.json(uniqueListings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch user listings. Please try again later.' });
  }
});


// Update authenticateUser middleware to extract token from "Authorization" header with "Bearer " prefix
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const userEmail = decoded.email;
    
    User.findOne({ email: userEmail })
      .then((userData) => {
        if (!userData) {
          return res.status(401).json({ error: 'User not found' });
        }
       req.user = { email: userEmail };
       next();
      })
      .catch((error) => {
        console.error("Error authenticating user:", error);
        res.status(500).json({ error: 'Internal server error' });
      });

  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

  //create message
  app.post('/api/post/msg', authenticateUser, async(req, res)=>{
    try{ 
       const{from , to , message} = req.body;
       const newmessage = await Message.create ({
            message:message,
            Chatusers: [from , to],
            Sender: from
        })

        return res.status(200).json(newmessage);

    }catch (error) {
       return res.status(500).json({ error: 'Internal server error' });
    }
  })

  //create message
  app.get('/api/post/get/chat/msg/:user1Id/:user2Id', async(req, res)=>{

      try{
          const from = req.params.user1Id;
          const to = req.params.user2Id;

          const newmessage = await Message.find({
              Chatusers:{
                $all:[from , to],
              }
          }).sort ({updatedAt: -1 });

          const allmessage = newmessage.map((msg)=>{
                return{
                    myself: msg.Sender.toString() === from,
                    message : msg.message
                }

          })

          return res.status(200).json(allmessage);


        }catch(error){
          return res.status(500).json({ error: 'Internal server error' });
        }

    })


const PORT = process.env.PORT || 5321;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
