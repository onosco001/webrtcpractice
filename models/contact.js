
import express from 'express'; 
import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema({
      
        name : {
                  type : String,
                  required : true,
        }, 

        email : {
            type : String,
            required : true,
        },

        phoneNumber : {
            type : Number,
            required : true,
        },

        message : {
            type : String,
            required : true,
        }

}); 

const Contact = mongoose.model('Contacters', contactSchema);
//module.exports = Contact;
export default Contact;
