const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get("/",(req, resp, next)=>{
  Product.find()
  .select('name price _id')
  .exec()
  .then(docs => {
    const response = {
      count : docs.length,
      products:docs.map(doc=>{
        return{
          name:doc.name,
          price:doc.price,
          _id : doc._id,
          request:{
            type:"GET",
            url:"http://localhost:3000/products/" + doc._id
          }
        }
      })
    }
    resp.status(200).json(response);
  })
  .catch(err=>{
    console.log(err);
    resp.status(500).json({error:err});
  });
});

router.post("/",(req, resp, next)=>{
  const product = new Product({
    _id : new mongoose.Types.ObjectId(),
    name : req.body.name,
    price : req.body.price
  });
  product.save()
  .then(result => {
    console.log(result);
    resp.status(201).json({
        message: "Created product successfully",
        createdProduct : {
          name:result.name,
          price:result.price,
          _id : result._id,
          request:{
            type:"GET",
            url:"http://localhost:3000/products/"+result._id
          }
        }
    });
  })
  .catch(err => {
    console.log(err);
    resp.status(500).json({error: err})
  });

});

router.get("/:productID",(req, resp, next)=>{
    const id = req.params.productID;
    Product.findById(id)
    .exec()
    .then(doc=>{
      console.log(doc);
      if(doc){
        resp.status(200).json({
          product:doc,
          request:{
            type:"GET",
            url:"http://localhost:3000/products/"
          }
        });
      }
      else{
        resp.status(404).json({
          message: "No valid entry found",
        });
      }
    })
    .catch(err=>{
    console.log(err);
    resp.status(500).json({error:err});
  });
});

router.patch("/:productID",(req, resp, next)=>{
  const id = req.params.productID;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName]=ops.value
  }
  Product.updateOne({_id:id},{$set : updateOps})
  .exec()
  .then(result => {
    console.log(result);
    resp.status(200).json({
      message:"product updated successfully",
      request:{
        type:"GET",
        url:"http://localhost:3000/products/"+id
      }
    });
  })
  .catch(err =>{
    console.log(err);
    resp.status(500).json({error:err})
  })
});

router.delete('/:productID',(req, resp, next)=>{
  const id = req.params.productID;
  Product.remove({ _id : id })
  .exec()
  .then(result =>{
    resp.status(200).json({
      message: "Product Deleted",
      request:{
        type:'POST',
        url:'http://localhost:3000/products',
        body:{ name: 'String', price:'Number'}

      }
    }
    );
  })
  .catch(err => {
    console.log(err);
    resp.status(500).json({error:err});
  });
});

module.exports = router;
