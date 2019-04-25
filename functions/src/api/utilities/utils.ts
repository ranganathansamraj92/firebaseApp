import * as express from "express";

const  username = "ranganathan";

export function sayHello(name:string): string {
    return ('Hello '+name + " by "+ username);
}

const meta = {status:false,msg:""};
const data = {result:{}};
const outputRes = {meta:meta,data:data};
meta.status =  false;
meta.msg =  "unknown";

outputRes['meta'] = meta;
outputRes['data'] = data;



export function  makeCommonRes(res: express.Response,status:boolean,msg:string,name:string,output:any) :void {     
    meta.msg= msg;
    meta.status= status;
    data['result'] = output;
    outputRes.meta = meta;
    outputRes.data = data;
    console.log("prepared  outputRes => ",outputRes); 
    res.send(outputRes);    
    //testCallback(outputRes);            
}
