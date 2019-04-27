import * as db from '../../api/firebase-db/db';
import * as express from "express";
import * as dateformat from "dateformat"


const  username = "ranganathan";

export function sayHello(name:string): string {
    return ('Hello '+name + " by "+ username);
}

export function sayHello2(name:string): string {
    return ('Hello '+name + " by "+ username);
}

const meta = {status:false,message:""};
const data = {};
const outputRes = {meta:meta,data:data};
meta.status =  false;
meta.message =  "unknown";

outputRes['meta'] = meta;
outputRes['data'] = data;



export function  makeCommonRes(res: express.Response,status:boolean,msg:string,name:string,output:any) :void {     
    meta.message= msg;
    meta.status= status;
    outputRes.meta = meta;
    outputRes.data = output;
    console.log("prepared  outputRes => ",outputRes); 
    res.send(outputRes);    
    //testCallback(outputRes);            
}

export function GetFormattedDate () {    
    const indiaDateTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const indiaTime = new Date(indiaDateTime);
    console.log('India time: '+indiaTime.toLocaleString());
    const dateTime = dateformat(indiaTime, "ddd, mmm dd, yyyy, HH:MM TT");
    console.log('India time format '+dateTime);
    return dateTime;
}

export function GetCurrentTime () {    
    const indiaDateTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const indiaTime = new Date(indiaDateTime);
    console.log('India time: '+indiaTime.toLocaleString());
    const dateTime = dateformat(indiaTime, "HH:MM TT");
    console.log('India time format '+dateTime);
    return dateTime;
}

export function sendMessage(token_id:string,payload:any) {
   return db.DBadmin.messaging().sendToDevice(token_id, payload);   
}

export function sendMessages(token_id:string,payload:any):Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {  
        resolve(    
            db.DBadmin.messaging().sendToDevice(token_id, payload).then(response => {
                console.log('This was the notification Feature',response);
            })  
        )
      }, 1000)
    })
}