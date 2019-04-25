import * as functions from 'firebase-functions';
import * as express from "express";
export let userRegisterRouter = express.Router();
import * as db from '../../api/firebase-db/db';
import * as utils from '../../api/utilities/utils';
import * as payloads from '../utilities/payloads'

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


export const  registerTokenTrigger = functions.database.ref('users/{userId}/authIdToken').onWrite((change,context) => {

    db.database.ref('users/' + context.params.userId).once('value').then(snap=>{
        const token_id = snap.val().fcmToken;
         // Exit when the data is deleted.
        if (!change.after.exists()) {
            console.log('data is deleted.?   '+ context.params.userId);
            return null;
        }
        if (change.before.exists()) {
            // Only edit data 
            console.log('loggedIn! userId =?   '+ context.params.userId);           
            return change.before.ref.parent!.ref.child('loggedInAt').set(utils.GetFormattedDate()).then(error=>{
                payloads.Loginpayloads.notification.title = "Hi! "+snap.val().name;
                payloads.Loginpayloads.notification.body = payloads.loginBodyText + " "+utils.GetFormattedDate();
                utils.sendMessage(token_id,payloads.Loginpayloads).then(t=>{
                    return null; 
                }).catch(e=>{
                    return null;  
                });
            }).catch(e=>{
                return null;
            })

            
        }
        if (!change.before.exists()) { // it is first created.
            console.log('New user signedUp ! userId =?   '+ context.params.userId);
            // Grab the current value of what was written to the Realtime Database.
            const original = change.after.val();
            console.log('authIdToken  current  :  '+original);
            return change.before.ref.parent!.ref.child('loggedInAt').set(utils.GetFormattedDate()).then(error=>{
                utils.sendMessage(token_id,payloads.welcomPayloads).then(t=>{
                    return null; 
                }).catch(e=>{
                    return null;  
                });
            }).catch(e=>{
                return null;
            })
              
        }
        return null;       
    }).catch(e=>{
        return e;
    })    

  //  return change.before.ref.parent!.ref.child('justUpdate').set(utils.GetFormattedDate());     
    
});