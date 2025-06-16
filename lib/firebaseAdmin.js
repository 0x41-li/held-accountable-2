import * as admin from "firebase-admin";

if (!admin.apps.length) {
  console.log(JSON.parse(process.env.SERVICE_ACCOUNT_KEY));
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY)),
  });
}

export { admin };