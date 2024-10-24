  
import express from 'express'; 
import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const PaymentSchema = new mongoose.Schema({
    

    txref: {
        type : String,
        required : true, 
    },  

    myServices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services', // Reference to the Service model
    }],
  

    //the owner of the payment
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Clients',  
    },   

    orderid : {
        type : String,
        default : '0a',
    },


    status : {
         type : String,
         default : 'invalid',
    }, 

    day : {
      type : Schema.Types.Mixed
    }, 

     session : {
        type : Schema.Types.Mixed
     },

    date: {
        type : Date,
        default : Date.now(),
    },
}); 

const allPayments = mongoose.model('Payments', PaymentSchema); 
export default allPayments;