 
 

import express from 'express'; 
import mongoose from 'mongoose';


const CartSchema = new mongoose.Schema({
     
    day : {
        type : String,
        required : true,
        default : 'Apr 22, 2024',
    },  

    session : {
        type : String,
        required : true,
        default : '10:30 GMT',
    }, 

    duration : {
        type : String,
        required : true,
        default: '1hour',
    }, 
  
    //the service details
    service: { 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Services',  
    },  

    //the owner of the cart
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Clients',  
    },
}); 

const allCart = mongoose.model('Carts', CartSchema);
//module.exports = allCart;
export default allCart;