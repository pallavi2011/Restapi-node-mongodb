const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order  = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, resp, next)=>{
  Order.find().select('product quantity _id').exec()
  .then(docs=>
    resp.status(200).json({
      count:docs.length,
      orders:docs.map(doc=>{
        return{
          _id:doc._id,
          product:doc.product,
          quantity:doc.quantity,
          request:{
            type:'GET',
            url:'http://localhost:3000/orders/'+doc._id
          }
        }
      })
    })
  )
  .catch(err=>{
    resp.status(500).json({error:err});
  })
});

router.post('/', (req, resp, next)=>{
  Product.findById(req.body.productId).then(
    product=>{
      if (!product){
        return resp.status(404).json({
          message:"Product not found"
        })
      }
      const order = new Order({
        _id:mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product:req.body.productId
      });
      return order.save();
    })
    .then(result =>{
      console.log(result);
      resp.status(200).json({
        message:"Order stored",
        createdOrder:{
            _id:result._id,
            product:result.product,
            quantity:result.quantity
        },
        request:{
          type:'GET',
          url:'http://localhost:3000/orders/'+result._id
        }
      });
    })
    .catch(err=>{
      resp.status(500).json({error: err});
    });
});

router.get('/:orderID', (req, resp, next)=>{
  Order.findById(req.params.orderID).exec().then(
    order=>{
      if(!order){
        return resp.status(404).json({
          message:"Order not found"
        });
      }
      resp.status(200).json({
        order: order,
        request:{
          type:"GET",
          url:'http://localhost:3000/orders'
        }
      });
    }
  ).catch(err=>
  {
    resp.status(500).json({error:err})
  })

});

router.delete('/:orderID', (req, resp, next)=>{
Order.remove({_id:req.params.orderID}).exec().then(
  result=>{
    resp.status(200).json({
      message:"Order deleted",
      request: {
        type:"GET",
        url:'http://localhost:3000/orders'
      }
    })
  }).catch(err=>{
    resp.status(500).json({error:err})
  })
});

module.exports = router;
