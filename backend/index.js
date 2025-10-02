const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 2012;
const dotenv = require("dotenv");
const cors= require("cors");

dotenv.config();

//middleware
app.use(express.json());
app.use(cors());


//route
const contactRoute = require("./routes/contactRoute");


//mongose connect
mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log("mongoose connected");
}).catch((err) =>{
    console.log("error to connecting", err);
});


app.use("/api", contactRoute);

app.listen(PORT,() =>{
    console.log("server is running on port",PORT);
})

