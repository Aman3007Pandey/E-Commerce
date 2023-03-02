require('express-async-errors');
require('dotenv').config();

const express=require('express');
const app=express();

//

const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const fileUpload=require('express-fileupload');

//router
const authRouter=require('./routers/auth-router');
const userRouter=require('./routers/user-router');
const productRouter=require('./routers/product-router');
const reviewRouter=require('./routers/review-router');

const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
const connectDB=require('./db/connect');
const port=3000;

// middleware

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/product',productRouter);
app.use('/api/v1/review',reviewRouter);

app.get('/',(req,res)=>{
    res.send('E-COMMERCE API')
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start=async()=>{
   try {
    await connectDB(process.env.MONGO_URL);
     app.listen(port,console.log(`Server is listening on port ${port}`));
   } catch (error) {
    console.log(error);
   }

}

start();