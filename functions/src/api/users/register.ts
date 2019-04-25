import * as functions from 'firebase-functions';
import * as express from "express";
export let userRegisterRouter = express.Router();
import * as db from '../../api/firebase-db/db';
import * as utils from '../../api/utilities/utils';

export const signUp = functions.https.onRequest((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;    
    const photoURL = req.body.photoURL;
    const fcmToken = req.body.fcmToken;

    let userId = "";
    // const additionalClaims = {
    //     premiumAccount: true
    //     };

        db.auth.createUser({
        email: email,
        emailVerified: false,
        phoneNumber: phoneNumber,
        password: password,
        displayName: name,
        photoURL: photoURL,
        disabled: false
      })
        .then(user =>{
            userId = user.uid;
            console.log("Successfully created new user:", user.uid);
            const userObject = {
                email : user.email,
                name : user.displayName,
                mobile : user.phoneNumber,
                fcmToken:fcmToken,
                photoUrl : user.photoURL
            };
            return db.database.ref('users/' + user.uid).set(userObject).then(snapShot =>{
                console.log('DB Updated userObjects ');  
                let msg = 'registartion completed';
                utils.makeCommonRes(res,false,msg,"result",{token:userId,message:msg}); 
            }).catch(error => {
                console.log('DB Update failed on new user creation -> ', error);    
            });
        }).catch((error) => {
            console.log('Error creating user:', error);
            let msg = 'registartion faild Error creating user';
            if(error.code ==='auth/email-already-exists'){
                msg = error.message;
            }  
            utils.makeCommonRes(res,false,msg,"result",null);         
        });

        
});