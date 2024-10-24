
import express from 'express'; 
import mongoose from 'mongoose';

 
const ServiceSchema = new mongoose.Schema({
     
    serviceDescription : {
        type : String, 
    },  

    serviceName : {
        type : String, 
    }, 

    servicePrice : {
        type : Number, 
    },

    serviceImage : {
        originalname : { type : String, required : true},
        mimetype : { type : String, required : true},
        size : { type : Number, required : true},
        path : { type : String, required : true},
    }
}); 

const AllService = mongoose.model('Services', ServiceSchema);
//module.exports = AllService;
export default AllService;