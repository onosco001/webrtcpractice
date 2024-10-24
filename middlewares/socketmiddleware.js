
//Let's create a middleware to make sure the user is authenticated before being able to use socket 
io.use(( socket, next )=>{
     const socketHeader = socket.handshake.headers.cookie; 

      // Check if cookie exists
if (!socketHeader) {
 return next(new Error('Authentication error: No cookies sent')); 
 console.log('cookie has been cleared');
}
     const parsedSocketHeader = cookie.parse(socketHeader);
     const token = parsedSocketHeader.authToken;
      if(!token)  { 
       console.log('no token found');
       return next(new Error('Authentication error: No token found')); 
      } 

      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
                  if(err) {
                   console.log('cookie has expired or other errors');
                   return next(new Error('Authentication error: Invalid token')); 
                  } else {
                      if(!user){
                         console.log('Not a valid user, scammer who are you ?');
                         return next(new Error('Authentication error: No user found'));
                      }  
                      //then at success, attach the user info to socket object   
                      const onlineUsers = Array.from(io.sockets.sockets); //returned array of currently connected sockets
                      const existingUser = onlineUsers.find(([id, socket])=>socket.userId === user.userId); 
                        if(existingUser){  
                          existingUser[1].disconnect(); 
                        } else {  
                         socket.userName = user.reguser;
                        socket.userId = user.userId;  
                   }   
                        next(); 
                      console.log('Successfully connected to socket');      
                  }    
      });  
}); 
