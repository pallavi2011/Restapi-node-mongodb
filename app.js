const express= require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
mongoose
.connect(process.env.DB_CONNECTION, { dbName: 'test', useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to db"))
.catch(err => console.log(`Could not Connected to db ${process.env.DB_CONNECTION} `, err));
//mongoose.connect('mongodb+srv://pallavi2011:Mumbai28@noderestshop.8qe0g.mongodb.net/<dbname>?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req,resp,next)=>{
  resp.header('Access-Control-Allow-Origin', '*');
  resp.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-type, Accept, Authorization');
  if(req.method ==='OPTIONS'){
      resp.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET');
      return resp.status(200).json({

      })
  }
})



app.use((req, resp, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req,resp,next)=>{
  resp.status(error.status || 500);
    resp.json({
        error :{
            message : error.message
    }
  })
})



module.exports = app;
