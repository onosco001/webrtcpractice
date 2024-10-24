 
   
import express from 'express';    
import http from 'http';  
import { Server } from 'socket.io';  // Correct import for socket.io

const app = express();   
const server = http.createServer(app); 

const io = new Server(server);  // Create a new socket.io instance 

import cors from 'cors';

  import ejs from 'ejs';  
  import fs from 'fs';   
  
  import fetch from 'node-fetch'; 
  import got from 'got'; 
  import Flutterwave from 'flutterwave-node-v3'; 
  import dotenv from 'dotenv';
  dotenv.config();   
 import mongodb from 'mongodb';
  import mongoose from 'mongoose';    
  mongoose.connect(process.env.MONGOOSE_CONNECTION, {
   useNewUrlParser:true,
   useUnifiedTopology:true
  } ).then(()=>{console.log('success')}).catch((err)=>{console.error(err)});          
      

  const validationString = process.env.VALIDATION_STRING;
  import cookieParser from 'cookie-parser';
 
   
  import url from 'url';
  import { fileURLToPath } from 'url';
  import { dirname, join } from 'path'; 
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
    
  import PaymentDb from './models/payment.js';
  import session from 'express-session'; 
  import passport from'passport';
  import passportLocal from 'passport-local';
  //const LocalStrategy = passportLocal.Strategy;
  import { Strategy as LocalStrategy } from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import { ensureLoggedIn } from 'connect-ensure-login';
import bcrypt from 'bcryptjs';
  const saltRounds = 12; 
 import jwt from 'jsonwebtoken';
  import BlogDb from './models/onoscoblog.js';
import MemDb from './models/register.js';
import CommentDb from './models/comment.js';
import ServiceDb from './models/service.js';
import CartDb from './models/cart.js';
import ContactDb from './models/contact.js';

  app.use(cookieParser());  
  import globalTok from './middlewares/global.js'; 
  app.use(globalTok);
  import authenticate from './middlewares/authentication.js';
import checkTok from './middlewares/authb.js';
import checkbTok from './middlewares/authc.js';
import checkcTok from './middlewares/authd.js';
import checkdTok from './middlewares/authe.js';
import admTok from './middlewares/authadmin.js';
import multer from 'multer';
import nodemailer from 'nodemailer';  
import cookie from 'cookie';

const secretkey = process.env.FLW_SECRET_KEY;
const publickey = process.env.FLW_PUBLIC_KEY; 
const flw = new Flutterwave(publickey, secretkey);

   app.set('view engine', 'ejs'); 
   app.use(express.urlencoded({extended:false}));
   app.use(express.json()); 
   app.use(cors());
   app.use(express.static(join(__dirname + '/public')));   

 
     
  
        //initially socket.io connection 
   io.on('connection', (socket)=>{
      console.log('New user joined:', socket.id); 

         //let's map out online sockets (users)   
        const onlineUsers = Array.from(io.sockets.sockets); //returned array of currently connected sockets
         //let's make use of the connected users in our chatpage 
        console.log(onlineUsers);   
        //first destructure the array because the username is inside the socket array  
       //  const onlineUsersUserName = onlineUsers.map(([socketId, socketInstance])=>socketInstance.userName);   
       //  console.log(onlineUsersUserName);
       //  io.emit('connectedUsers', onlineUsersUserName);



       // socket.on('typing', (notification)=>{
              //broadcast message to all connected users except the initiator
           //   socket.broadcast.emit('typingg', notification);
       // });   

       //let me join a room  
       socket.on('joinRoom', (room)=>{
            socket.join(room);
       });
 
        socket.on('chatmsg', (data)=>{ 
         const {message, room, auser} = data;   
            socket.to(room).emit('newmessage', {message, auser});
        });  
        
        
        socket.on('offer', (localDescription)=>{
      socket.broadcast.emit('offer', localDescription);
        }); 

        socket.on('answer', (answer)=>{
         socket.broadcast.emit('answer', answer);
        });

        socket.on('disconnect', () => {
         console.log('User disconnected:', socket.id);
         
         // Remove user based on userId
       //  const onlineUsers = Array.from(io.sockets.sockets);
      //   const updatedUsers = onlineUsers.filter(([socketId, socketInstance]) => socketInstance.userId !== socket.userId);
      //   const updatedUsersUserName = updatedUsers.map(([socketId, socketInstance]) => socketInstance.userName);
     
       //  console.log(updatedUsersUserName);
       ///  io.emit('updatedUsers', updatedUsersUserName); // Emit updated user list
     }); 

     
    });

 
 

  //set the storage for multer files
 const storage = multer.diskStorage({
     destination : function( req, file, cb) {
           cb(null, 'public/uploads');
     },  

      filename : function (req, file, cb) {
         cb(null, Date.now() + '-' + file.originalname)
      },
     
 });

 //file fitering logic implementation

 const fileFilter = (req, file, cb) => {
   
     if(file.mimetype.startsWith('image/')){
      cb(null, true); // accept the file
     } 

      else{
         cb(new Error('Only image files are allowed!'), false); // reject the file

      }

          } 

  //create the multer instance
 const upload = multer({storage : storage, fileFilter : fileFilter});
 
    

   //home navigation
   app.get('/', async(req, res)=>{ 
      res.render('./pages/index');
   });      
   
     // app.use('/chatpage', authenticate);  
      app.get('/chatpage', (req,res)=>{
      res.render('./pages/chatpage');
     });
 
    
    app.get('/contact', (req,res)=>{
      res.render('./pages/contact');
   });  

   app.get('/about', (req,res)=>{
      res.render('./pages/about');
   });  
     
   app.get('/services', async(req,res)=>{
      const services = await ServiceDb.find();

      if(services){
      res.render('./pages/service', {services});
      }

      else{
          res.status(404).send('No service is availabble');
      }
   });   


   app.get('/services/servicedetail', async(req,res)=>{ 
      res.render('./pages/servicedetail'); 
   });  


        

   app.get('/explore', (req,res)=>{
      res.render('./pages/explore.ejs');
   }); 
     
  

   app.get('/socialhandle', (req,res)=>{
      res.redirect('https://wa.me/+2349122928923');
   });  
  
       
             

   app.post('/processingpayment', async (req,res)=>{
       const aamnt = req.body.amount;
       const rand =   Math.floor(10000 + Math.random() * 9873762732);
       const timestamp = Date.now().toString();
       const txRef = rand + '-' + timestamp;  
       const ouser = res.locals.user; 
       const duser = await MemDb.findOne({_id : ouser.userId});
       //firstly save the transaction reference in the mongodb along with the order information for later query
      await PaymentDb.create({ 
         txref : txRef,
         user : ouser.userId, 
         myServices : req.body.orderedServices,
         day : req.body.day,
         session : req.body.session, 
         });   
   
       try {
           const response = await got.post("https://api.flutterwave.com/v3/payments", {
               headers: {
                   Authorization: `Bearer ${secretkey}`
               },
               json: {
                   tx_ref: txRef,
                   amount: aamnt,
                   currency: "EUR", 
                   redirect_url: `${req.protocol}://${req.get('host')}/3ece3-x87b78ex86g3t3x683xr26b83286g32r2r3xb873286t23r86tbr2t342-x3f67`, //we will use this url to query transaction id returned and make request to flutterwave payment verification endpoint
                   customer: {
                       email: duser.regemail, 
                       name:  duser.reguser,
                   },
                   customizations: {
                       title: "Onosco Psychotherapy Services",
                       logo: "/images/onoscologo.jpg"
                   }
               }
           }).json();
   
           // Assuming response contains link property for redirection 
           const redirectUrl = response.data.link; 
           res.json({redirectUrl});
       } catch (err) {
           console.log(err.response.body);
           // Handle error accordingly, maybe send an error response
           res.status(500).send("Error processing payment");
       }
   });
     
 
   

   app.get('/3ece3-x87b78ex86g3t3x683xr26b83286g32r2r3xb873286t23r86tbr2t342-x3f67', async (req, res) => {
      const ouser = res.locals.user;
      console.log(ouser);
      try { 
          const { status, tx_ref, transaction_id } = req.query; 

          if(status === 'cancelled'){
               res.redirect('/checkout');
          }  else {
            
          // Check if the payment is for us
          const reference = await PaymentDb.findOne({ txref: tx_ref }).populate('myServices').populate('user').exec(); 
          
          if (!reference) {
              res.send('Transaction reference is not recognized'); 
          }
  
          const confirmation = await flw.Transaction.verify({ id: transaction_id });
          const paidAmount = confirmation.data.amount;
          const orderedServices = reference.myServices;
    
          let expectedAmount = 0;
  
          for (const service of orderedServices) {
            expectedAmount += service.servicePrice;
        }

  
          if (confirmation.data.status === "successful" &&
              paidAmount === expectedAmount && // extracted from txref
              confirmation.data.currency === 'EUR') { 
              // Check if the txref returned in the verification is still available in the database
              const transactionReference = confirmation.data.tx_ref;
              const confirmAgain = await PaymentDb.findOne({ txref: transactionReference });
  
              if (!confirmAgain) {
                  res.send('paymenterror'); 
              }
              

              const servicename = 'onosco';
              const randid =   Math.floor(10000 + Math.random() * 685312);
              const myorderid = servicename + randid;

              const updatedPaymentStatus = {
                status: 'available',
                orderid : myorderid,
             };  
 
               const updatedReference =  await PaymentDb.findByIdAndUpdate(reference._id, updatedPaymentStatus, { new: true });
                //clear all user's carts  
                const cartsToDelete = await CartDb.find({ user: ouser.userId }); 
                for (const cart of cartsToDelete) {
                  const cartid = cart._id;
                  await CartDb.deleteMany({ _id: cartid });
              }
               res.redirect(`/paymentresponse/2e6tv7te26re8r3e8v53e853vsgbgdbdxny383edb5r3br3rbe7re3drb673er36/${'successful'}/${reference.txref}`);
                console.log(updatedReference);
                
          } else {
              if (paidAmount > expectedAmount) {
                  // Refund the user
                  const refunding = paidAmount - expectedAmount;
                  res.redirect(`/paymentresponse/2e6tv7te26re8r3e8v53e853vsgbgdbdxny383edb5r3br3rbe7re3drb673er36/${'refunding'}/${reference.txref}`);
               } else if (paidAmount < expectedAmount) {
                  // Debit user manually
                  const balancing = expectedAmount - paidAmount;
                  res.send('debiting');
              }
          }  
          }
      } catch (err) {
          console.log(err);
          res.status(500).send('An error occurred');
      }
      
  });    


  app.get('/paymentresponse/2e6tv7te26re8r3e8v53e853vsgbgdbdxny383edb5r3br3rbe7re3drb673er36/:status/:reference', async (req,res)=>{
   const status = req.params.status;
   const txrefid = req.params.reference; 
   const userpaymentdetails = await PaymentDb.findOne({ txref: txrefid }).populate('myServices').populate('user').exec();
   
   if(!userpaymentdetails){ 
         res.send('transaction reference not recognized');
   }
 console.log(userpaymentdetails);
   if(status === 'successful'){ 
      const adata = {
         img : '/images/onoscologo.jpg',
         greentext : 'Payment Successful',
         text : 'Thank you for choosing Onosco Psychotherapy services.',
         textb : 'Please check your email for payment details as your order ID will be used to track your order when you make yourself available for the service',
       }  
        //send email to the user with the payment details  
        
const emailTemplate = fs.readFileSync(join(__dirname, 'views', 'pages', 'orderemail.ejs'), 'utf8');
const renderedEmailBody = ejs.render(emailTemplate, {userpaymentdetails});
// Create a SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', 
    port: 587,
    auth: {
      user:process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASS,
  }
});

// Define email options
 const emailAddresses = [ 
   userpaymentdetails.user.regemail,
   'alexaroh@yahoo.com',
   'victoremmy1876@gmail.com',
];
const mailOptions = {
    from: 'onoscopsychotherapyservices@gmail.com',
    to: emailAddresses.join(', '),
    subject: 'Order informations',
    html: renderedEmailBody,
     };

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error occurred:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});


     res.render('./pages/response', {adata}); 
  } else if(status === 'refunding'){
   const adata = {
       img : '/images/onoscologo.jpg',
       greentext : 'Refunding Payment..',
       text : 'Our system discovered the amount you paid is more than the amount expected, please be patient as we refund the remainder back to your account',
       textb : '',
      }
     res.render('./pages/response', {adata});
  } else{} 

  });  

  app.use('/trackorder/e3x8tbot484c367tc46vo8covbt6843684rcb7t546ot8b3o43o8', admTok);
  app.get('/trackorder/e3x8tbot484c367tc46vo8covbt6843684rcb7t546ot8b3o43o8', (req,res)=>{
       const user = res.locals.user;
       if(user && user.role === 'admin'){
        res.render('./pages/trackorder');
       }  

 else {
 res.redirect('/admin-control-login');
}

  });
 

  app.get('/trackorder/:orderid', async (req,res)=>{
       const user = res.locals.user; 
       const orderId = await req.params.orderid; 
            const orderinfo = await PaymentDb.findOne({ orderid : orderId}).populate('myServices').exec();
            if(orderinfo){
               res.json({ message : orderinfo._id});
            }   else {
                res.status(404).json({message : 'Order information not found in the database, Please try again with the valid order ID given after the service transaction..You can check your email for confirmation'});
            }
         
  }); 
 

  app.get('/settleorder/:orderid', async (req,res)=>{
   const user = res.locals.user; 
   try{ 
   const orderId = await req.params.orderid; 
        const orderinfo = await PaymentDb.findOne({ _id: orderId});
        if(orderinfo){
           await PaymentDb.findByIdAndDelete(orderId);
           res.status(200).send('Successfully settled');
        }   else {
            res.status(404).send('Order information not found in the database, Please try again with the valid order ID given after the service transaction..You can check your email for confirmation');
        }
      }  
      catch(err) {
          res.status(400).send('something went wrong, please try again');
      }
}); 
   
    

  app.get('/orderinformation/:idhere', async (req,res)=>{ 
   const user = res.locals.user;
   if(!user && user.role === 'admin'){
       res.redirect('/admin-control-login');
   }
    const orderid = req.params.idhere;
    const theorder = await PaymentDb.findOne({_id : orderid}).populate('myServices').exec();
    if(!theorder){
        res.redirect('/notfound/he87ed3ub');
    }  
    res.render('./pages/orderview', {theorder});
  });
  

   
    //Apply middleware to redirect user to dashboard if cookie is already set
    app.use('/login', checkTok); 
    //navigate to login page 
     app.get('/login', (req,res)=>{
          res.render('./pages/login');
     });  
       

       //Apply middleware to redirect user to dashboard if cookie is already set
    app.use('/signup', checkbTok);
      app.get('/signup', (req,res)=>{
             res.render('./pages/signup');
      }); 
 

    //admin access
           
//Apply middleware to redirect admin to login if cookie is not yet set
app.use('/admin-control', admTok);
app.use('/admin-control-edit-673xxsbjxswv325r327r', admTok);
 
//Apply middleware to redirect admin to dashboard if cookie is already set
app.use('/admin-control-login', checkcTok);


       //Apply middleware to redirect admin to dashboard if cookie is already set
       app.use('/admin-control-register', checkdTok);

     app.get('/admin-control-login', (req,res)=>{
              res.render('./pages/adminlogin.ejs', {validationString});
     });
  
     app.get('/admin-control-register', (req,res)=>{
      res.render('./pages/adminsignup.ejs');
});

     app.get('/admin-control', (req,res)=>{ 
      const user = res.locals.user;
      if(user && user.role === 'admin'){
      res.render('./pages/fadmin');
      }

      else{
         res.render('./pages/adminlogin.ejs', {validationString});
      }
}); 


 
 

app.get('/onosco-blog', async (req,res)=>{   
   //fetch data from mongodb  
     try{ 
   const blogpost = await BlogDb.find(); 
   console.log(blogpost); 
   res.render('./pages/blog', {blogpost}
   );  
     }  

      catch (err) {
          console.log(err);
    } 

});  

 

 

app.get('/onosco-blog/:postId', async (req, res) => {
    try {
        const postid = req.params.postId; 

       //check if post exists
        const post = await BlogDb.findOne({ _id: postid }); 
            //check if the post has comments and render in ejs
            const comments = await CommentDb.find({ post : postid}).populate('post').populate('user').populate('parentComment').exec(); 
         //check for related posts
         const relatedposts = await BlogDb.find({ _id : { $ne: post._id } });

        if (post) {
            console.log(post);   
            res.render('./pages/fullpost', { post , comments, relatedposts }); 
        }  

        else {
            // Handle case when post is not found
            res.status(404).send('Post not found');
        } 

    } catch (err) {
        console.log(err);
        // Handle other errors
        res.status(500).send('Internal Server Error');
    }
});    
     

app.get('/onosco-service/:serviceid', async (req, res) => {
   try {
       const serviceId = req.params.serviceid; 

      //check if post exists
       const service = await ServiceDb.findOne({ _id: serviceId }); 
    
       if (service) {
           console.log(service);   
           res.render('./pages/serviceedit', { service }); 
       }  

       else {
           // Handle case when post is not found
           res.status(404).send('Service not found');
       } 

   } catch (err) {
       console.log(err);
       // Handle other errors
       res.status(500).send('Internal Server Error');
   }
});   

 
 

app.get('/testimonies', (req,res)=>{
   res.render('./pages/maintst.ejs'); 
});  
 

//handle contacting action
app.post('/contacting', async (req,res)=>{
   const condata = req.body;
   
   try{
         await ContactDb.create(condata);
         res.status(200).send('Message Sent Successfully');
   } 

    catch(err){
       res.status(400).send('Error sending message');
    }
});


 
  //post a comment text with reference to post and the user (initiator)

  app.post('/comment/:postId', async (req,res)=>{
        const postid = req.params.postId;
        console.log(postid);
        const commentText = req.body.txtbodyy;
        const user = res.locals.user;
        if(!user){ 
            return res.status(403).send('This section is only for authenticated users please login to also engage');
        }  

        await CommentDb.create({
         txtbodyy : commentText,
         post : postid,
         user : user.userId,
        });   
            res.redirect(`/onosco-blog/${postid}`);
  });


 
      //post a reply text with reference to its corresponding comment, post and initiator  (user)
          
      app.post('/reply/:postId/:commentId', async (req,res)=>{
         const postid = req.params.postId;
         const commentid = req.params.commentId; 
         const replyText = req.body.repinpp;
         const user = res.locals.user;
         if(!user){ 
             return res.status(403).send('This section is only for authenticated users please login to also engage');
         }  
 
         await CommentDb.create({
          txtbodyy : replyText,
          post : postid,
          parentComment : commentid,
          user : user.userId,
         });   
             res.redirect(`/blogposts/${postid}`);
   });
        



      app.post('/postingtestimony', (req,res)=>{
   const testimonybody = req.body;
   console.log(testimonybody);
}); 

  

app.post('/postingregistration', async (req, res) => {
  try {
    // Hash the password asynchronously
    const hash = await bcrypt.hash(req.body.regpass, saltRounds);

    // Create a new user in the database
    await MemDb.create({
      reguser: req.body.reguser,
      regemail: req.body.regemail,
      regpass: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname, 
      role : 'client',
    });
 
    res.send('success');
  }
  
  catch (error) { 
    if (error.code === 11000 && error.keyPattern.regemail) {
      // Duplicate key error for email field
      res.status(400).send('Email is already in use');
    }
    
    else if (error.code === 11000 && error.keyPattern.reguser) {
      // Duplicate key error for username field
      res.status(400).send('Username is already taken');
    } 
    
    else {
      // Other errors
      console.error('Error:', error);
      res.status(500).send('Something went wrong, try again');
    }
    
  }
}); 


//post admin sign up

app.post('/postingadregistration', async (req, res) => {
   try {
     // Hash the password asynchronously
     const hash = await bcrypt.hash(req.body.regpass, saltRounds);
 
     // Create a new user in the database
     await MemDb.create({
       reguser: req.body.reguser,
       regemail: req.body.regemail,
       regpass: hash,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       role : 'admin',
     });
  
     res.send('success');
   }
   
   catch (error) { 
     if (error.code === 11000 && error.keyPattern.regemail) {
       // Duplicate key error for email field
       res.status(400).send('Email is already in use');
     }
     
     else if (error.code === 11000 && error.keyPattern.reguser) {
       // Duplicate key error for username field
       res.status(400).send('Username is already taken');
     } 
     
     else {
       // Other errors
       console.error('Error:', error);
       res.status(500).send('Something went wrong, try again');
     }
     
   }
 });
 


app.post('/logino', async (req, res)=>{ 
  
   try { 
   const memb = await MemDb.findOne({regemail : req.body.regemail});  
   if(memb) {
      
     await bcrypt.compare(req.body.regpass, memb.regpass, function(err, auser){

             if(err){
               res.status(500).send('Something went wrong!');
             } 

              else{ 

               if(auser){  
           const token = jwt.sign({ userId : memb._id, date : memb.date, reguser : memb.reguser, firstname : memb.firstname, lastname : memb.lastname, points : memb.points, regemail : memb.regemail, role : 'client'}, process.env.JWT_SECRET_KEY, {
                  expiresIn : '3d',
               }); 
               res.cookie('authToken', token, {httpOnly : true, secure : true});
                  res.status(200).json({message : 'success'}); 
        
         }

         else{
            res.status(401).send('Invalid username or password');     
         }

         }

     }); 
   }       


   else{
      res.status(404).send('User does not exist in our record');      
   }


}   

   catch (err) {
      console.log(err);
   }

});    




  //handle admin login

  
app.post('/adlogino', async (req, res)=>{ 
  
   try { 
   const memb = await MemDb.findOne({regemail : req.body.regemail});  
   if(memb) {
      
     await bcrypt.compare(req.body.regpass, memb.regpass, function(err, auser){

             if(err){
               res.status(500).send('Something went wrong!');
             } 

              else{ 

               if(auser){  
           const token = jwt.sign({ userId : memb._id, date : memb.date, reguser : memb.reguser, firstname : memb.firstname, lastname : memb.lastname, regemail : memb.regemail, points : memb.points,  role : 'admin'}, process.env.JWT_SECRET_KEY, {
                  expiresIn : '1h',
               }); 
               res.cookie('authToken', token, {httpOnly : true, secure : true});
                  res.status(200).json({message : 'success'}); 
        
         }

         else{
            res.status(401).send('Invalid username or password');     
         }

         }

     }); 
   }       


   else{
      res.status(404).send('Admin does not exist in our record');      
   }


}   

   catch (err) {
      console.log(err);
   }

});   


  
  //apply the middleware to the protected route 
  app.use('/dashboard', authenticate); 
//protected endpoint
app.get('/dashboard', async (req, res)=>{
   const uuser = res.locals.user; 

   try{
   // Filter orders by user ID and status
  const orders = await PaymentDb.find({ user : uuser.userId, status: 'available' })
  .sort({ date : -1 }).populate('myServices').exec() // Sort by date field in descending order to get the latest order first
   res.render('./pages/dashboard', {uuser, orders}); 

   }   catch(err) {
        console.log('something went wrong');
   }
   
});   


 app.use('/checkout', authenticate); 
app.get('/checkout', async(req, res)=>{ 
   const ouser = res.locals.user; 
   const myCarts = await CartDb.find({user : ouser.userId}).populate('service').populate('user').exec(); 
   if(myCarts){ 
      res.render('./pages/cart', {myCarts}
      );
   }   
   else{
      res.redirect('/dashboard');
   }
});      

  app.use('/checkout-edit', authenticate); 
app.get('/checkout-edit/:cartid', async(req, res)=>{  
   const cartId = await req.params.cartid; 
   const thecart = await CartDb.findOne({ _id : cartId}).populate('service').populate('user').exec(); 
   if(thecart){ 
      res.render('./pages/editcart', {thecart}
      );
   }   
   else{
      res.redirect('/dashboard');
   }
});    


app.use('/checkout-delete', authenticate); 

app.get('/checkout-delete/:cartid', async(req, res)=>{  
   const cartId = await req.params.cartid; 
   const thecart = await CartDb.findOne({ _id : cartId}); 
   if(thecart){ 
      await CartDb.findByIdAndDelete(cartId);  
      res.redirect('/checkout');
   }   
   else{
      res.redirect('/dashboard');
   }
});  

   

   app.use('/postcart', authenticate);
 app.post('/postcart', async (req,res)=>{
   const theuser = await res.locals.user;
     const serviceId = await req.body.cartId; 

     try{
     const service = await ServiceDb.findOne({_id : serviceId});
     if(service){
          await CartDb.create({
               //provided that session , duration and population field are already set to default
            //now let's save the service the cart belongs to and user that carted it
            service : serviceId,
            user : theuser.userId,
            });
            res.status(200).send('added');
     } 
     else{
       res.status(400).send('Unable to add to cart'); 
     }
   } 

   catch(err){
      res.status(400).send(err); 
   } 
});
 

//log out user
app.get('/logout', (req, res)=>{ 
   res.clearCookie('authToken');
  const user = res.locals.user;
   if(user.role === 'admin'){
      res.redirect('/admin-control-login'); 
   } 
 
   res.redirect('/login');
});

 




app.post('/postingcontent', upload.single('postImage'), async (req,res)=>{
 

   try{ 

     const newPost = {
          posttitle : req.body.posttitle, 
          postbody : req.body.postbody,
          author : req.body.author, 
          postImage : {
               originalname : req.file.originalname,
               mimetype : req.file.mimetype,
               size : req.file.size,
               path : 'uploads/' + req.file.filename,
          },
      }   

       
       if(!req.file){
         console.log('file not received'); 
       }

       else{
      await BlogDb.create(newPost);
      res.status(307).json({message : 'success'});  
      console.log('success');  
     console.log(newPost);
       }

   }
 

    catch(err){
       console.log(err);
    }
   
   

});      
 

app.use('/admin-control', admTok);
app.get('/admin-control-service', (req,res)=>{
   const user = res.locals.user;
   if(user && user.role === 'admin'){ 
      res.render('./pages/postservice'); 
   }  else {
      res.redirect('/admin-control-login');
   }

});




app.post('/postingservice', upload.single('serviceImage'), async (req,res)=>{
 

   try{ 

     const newService = {
          serviceName : req.body.serviceName, 
          servicePrice : req.body.servicePrice,
          serviceDescription: req.body.serviceDescription, 
          serviceImage : {
               originalname : req.file.originalname,
               mimetype : req.file.mimetype,
               size : req.file.size,
               path : 'uploads/' + req.file.filename,
          },
      }   

       
       if(!req.file){
         console.log('file not received'); 
       }

       else{
      await ServiceDb.create(newService);
      res.status(200).send({message : 'success'});  
     console.log(newService);
       }

   }
 

    catch(err){
       console.log(err);
    }
   
   

});      


  
  
    //editing post


    //first make the post informations available to the editing page
app.get('/admin-control-edit-6gv119jsbv532vgewti26/:postId', async (req,res)=>{
   const postid = req.params.postId; 
   const user = res.locals.user;
   if(user && user.role === 'admin'){ 

   const thepost = await BlogDb.findOne({ _id : postid });

   if(thepost){
   res.render('./pages/admin-control-edit', {thepost});
   }
   
   else{
      res.status(404).send('post not found');
   }
}  else{ 
   res.render('./pages/adminlogin.ejs', {validationString});
}

 
}); 

//update
app.put('/posting-edited-content/:cartId', async (req, res) => {
   const cartId = req.params.cartId;
    // Corrected variable name to camelCase
   try {
       const cart = await CartDb.findById(cartId);
        // Using findById instead of findOne with _id
       if (cart) {
           const updatedCart = {
               session: req.body.session,
               day: req.body.day,
           };
           const updated = await CartDb.findByIdAndUpdate(cartId, updatedCart, { new: true });
           if (updated) {
               res.status(200).send('Success');
           } else {
               res.status(500).send('Error updating cart');
           }
       } else {
           res.status(404).send('Cart not found'); // Changed status code to 404 for resource not found
       }
   } catch (err) {
       console.error(err); // Log the error for debugging
       res.status(500).send('Something went wrong');
   }
});
  






//update

app.put('/posting-edited-contentb/:postId', upload.single('videofile'), async (req,res)=>{
   const postid = req.params.postId;  
   try{   
   const post = await BlogDb.findOne({ _id : postid});
   if(post) {
     const updatedPost = {
          posttitle : req.body.posttitle,
          bibleverse : req.body.bibleverse,
          postbody : req.body.postbody,
          author : req.body.author, 
          postImage: req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: 'uploads/' + req.file.filename,
        } : post.postImage,
      }  
        const updated = await BlogDb.findByIdAndUpdate(postid, updatedPost, {new : true});
        res.status(200).send('Success');
      } 

       else{ 
      res.status(307).send('Error updating contents');   
       }
        
   }
 

   catch(err){ 
      console.log(err);
      res.status(500).send('Something went wrong');
  }
   
   

});   
    

   

//update

app.put('/posting-edited-contentc/:serviceId', upload.single('videofile'), async (req,res)=>{
   const serviceid = req.params.serviceId;  
   try{   
   const service = await ServiceDb.findOne({ _id : serviceid});
   if(service) {
     const updatedPost = {
          serviceName : req.body.posttitle, 
          servicePrice : req.body.author, 
          serviceImage: req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: 'uploads/' + req.file.filename,
        } : service.serviceImage,
      }  
        const updated = await ServiceDb.findByIdAndUpdate(serviceid, updatedPost, {new : true});
        res.status(200).send('Success');
      } 

       else{ 
      res.status(307).send('Error updating contents');   
       }
        
   }
 

   catch(err){ 
      console.log(err);
      res.status(500).send('Something went wrong');
  }
   
   

});   


   //Delete post

   app.delete('/admin-control-delete-v62gw278yxe5/:postId', async (req,res)=>{
         const postid = req.params.postId;
         try{ 
            const thepost = await BlogDb.findOne({ _id: postid});
             if(thepost){
                 await BlogDb.findByIdAndDelete(postid);
                 res.status(200).json({'message' : 'sucessful'});
             } 

             else{
               res.status(404).send('Post not found');
             }
         }  
         
         catch(err){
             res.status(500).send('Something went wrong');
         }
   });
     

   app.get('/upcomingevents', (req,res)=>{
      res.render('./pages/upcoming');
   });  

   app.get('/reset-password', (req,res)=>{
      res.render('./pages/fp');
   }); 
 
   

    app.post('/submitemail', async (req,res)=>{ 
         
    try{
           //check if email is available in database
      const email = req.body.anemail;
      const mememail = await MemDb.findOne({ regemail: email}); 
      if(mememail){
      //create token to reset password
      const resetToken = jwt.sign({userid : mememail._id}, process.env.JWT_SECRET_KEY, {
         expiresIn : '15m'});  
         //create reset link from reset token
         const resetLink = `${req.protocol}://${req.get('host')}/resetpassword/?auser=${mememail._id}&token=${resetToken}`;

     ///create SMTP transporter
     const transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com', 
      port: 587,
      auth: {
          user:process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASS,
      }
  });

     //set mail option
     const mailOptions = {
      from: 'onoscopsychotherapyservices@gmail.com',
      to: mememail.regemail,
      subject: 'Reset password',
      text: `To reset your password, click on this link: ${resetLink}. Note that it expires after 15 minutes.`
   }; 


     transporter.sendMail(mailOptions, (error, info)=>{
           if(error){
             console.log(error);
           } else{
               res.status(200).send('success');
           }
     });
   } else{
       res.status(404).send('Email not available in our database');
   }
 }

   catch(err){
      res.status(500).send(err);
      console.log(err);
   } 
   }); 



   //verify the token
   app.get('/resetpassword', async (req,res)=>{
      const duser = req.query.auser;
      const ouser = await MemDb.findOne({_id: duser});

      if(ouser){
         const token = req.query.token;
         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
               if(err){ 
                  console.log(err);
                  res.status(404).redirect('/notfound');
               } 
               res.render('./pages/setpass', {ouser});
         });
      }

      else{
         res.status(404).redirect('/notfound');
      }
   }); 

    
 

   app.put('/submitpass/:userId', async(req,res)=>{
         const onewpassword = req.body.regpass;
         const newpassword = await bcrypt.hash(onewpassword, saltRounds);
         const userid = req.params.userId;
          const user = await MemDb.findOne({_id: userid});
          const newpswd = {
             regpass : newpassword,
          }
          
          if(user){
              const updatedpswd = await MemDb.findByIdAndUpdate(userid, newpswd, {new : true});
                res.json({message : 'ok'});
              console.log(updatedpswd);  
            } else{
             res.status(400).send('Error resetting password');
          }
   });
     



     app.get('/terms', (req,res)=>{
       res.render('./pages/terms');
     });

   // Wildcard route to handle all other routes (Not found pages)
   app.get('/*', (req,res)=>{
      res.render('./pages/notfound.ejs');
   });  


   server.listen(3000 , '0.0.0.0', ()=>{
   console.log('listening to the port 3000');
});   