import * as admin from 'firebase-admin';


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://baseapi-e2980.firebaseio.com"
});

export const database  = admin.database();

export const auth  =admin.auth();