import * as functions from 'firebase-functions';
import * as express from "express";
export let userRouter = express.Router();

import * as db from '../../api/firebase-db/db';



userRouter.get('/find/:uid', getUser);

userRouter.post('/', saveUser);

userRouter.get('/:age', getAllUsers);


async function getUser(req: express.Request, res: express.Response) {
    const uid = req.params.uid;
    res.status(200).send(`You requested user details for UID = ${uid}`);
}

async function saveUser(req: express.Request, res: express.Response) {
  const name = req.body.name;
  const location = req.body.location;
  const age = req.body.age;

  const user = {
    name:name,
    location:location,
    age:age
  }

  db.database.ref('/base/users').push(user).then(err =>{
    return res.status(200).send({status:true,msg:"success"});
  })  
}

async function getAllUsers(req: express.Request, res: express.Response) {

  db.database.ref('/base/users').once('value').then(snap =>{
    const results = Array<string>();
    snap.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      results.push(item);
      console.log(item.key, item);
      
    });
    let users = {}; 
    let data = {users:users};
  
    users = results; 
    data.users = results; 
    
   
    return res.status(200).send({status:true,msg:"success",data:data});

  }).catch(e=>{
    return res.status(500).send({status:false,msg:e});
  })  
}

functions.database.ref('base/users').onWrite(event=>{
  console.log('user  created!'+event.after.val());
})



// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
userRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This route does not exist.");
});
