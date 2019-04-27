import * as functions from 'firebase-functions';
import * as express from "express";
export let userRouter = express.Router();
import * as db from '../../api/firebase-db/db';
import * as register from '../../api/users/register';
import * as utils from '../../api/utilities/utils';

userRouter.get('/find/:uid', getUser);

userRouter.post('/', saveUser);

userRouter.post('/signUp', register.signUp);

userRouter.get('/:age', getAllUsers);

export let registerApis = register;


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

export  const  f =  functions.database.ref('/base/users/-Ld8b5lnZXKMeGWx0rxu').onWrite(event=>{
  console.log('Its got trihggered! from users.ts');
  console.log('just onWrite in user '+event.after);
  
});

export const  locationTrigggers = functions.database.ref('base/users/{id}/location').onUpdate((event,context) => {
  console.log('Address =?  location '+ context.params.id);
  console.log('locationTrigggers  location '+event.after.val());
});



async function getAllUsers(req: express.Request, res: express.Response) {

  db.database.ref('/users').once('value').then(snap =>{
    const results = Array<string>();
    snap.forEach(function(childSnapshot) {
      let json = childSnapshot.val();
      json.id = childSnapshot.key;
      json.userName = childSnapshot.val().name;

      results.push(json);
      console.log(json.key, json);
      
    });
    let users = {}; 
    const data = {users:users};
  
    users = results; 
    data.users = results; 
    utils.makeCommonRes(res,true,"msg","data",data);
   
    //return res.status(200).send({status:true,msg:"success",data:data});

  }).catch(e=>{
    return res.status(200).send({status:false,msg:e});
  })  
}



// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
userRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This route does not exist.");
});
