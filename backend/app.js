require('dotenv').config();

const express=require('express');
const app=express();
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser');
const fileUpload=require('express-fileupload');

const cloudinary=require('cloudinary');

const errorMiddleware=require('./middleware/error');
const connectDB=require('./db/connectDB');

const port=3001;

// middleware

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
const MONGO_URL="mongodb+srv://aman:1234@cluster0.e1ool9q.mongodb.net/?retryWrites=true&w=majority"

const product=require('./routes/productRoute');
const user=require('./routes/userRoute');
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute');

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1',payment);

app.use(errorMiddleware);
const start=async()=>{
   try {
    await connectDB(MONGO_URL);
     app.listen(port,console.log(`Server is listening on port ${port}`));
   } catch (error) {
    console.log(error);
   }

}

start();


cloudinary.config({
   cloud_name:process.env.CLOUDINARY_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET,
})


