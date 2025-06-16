import { updateUserSubscription } from "@/services/polls/polls";
import Profile from "@/views/Profile";
import { stripe } from "../../../lib/stripe";
import { auth } from "../../../lib/firebase";
import { admin } from "../../../lib/firebaseAdmin";
import { headers } from "next/headers";

export default async function ProfilePage({searchParams}) {
    searchParams = await searchParams;
    const headerList = await headers();
    let redirect_status = searchParams["redirect_status"];
    let intentId = searchParams["payment_intent"];

    console.log(redirect_status);
    console.log(intentId);

    // get cookies
    const cookies = headerList.get("cookie");
    const sessionCookie = cookies.split('; ').find(row => row.startsWith('token='));
    if (sessionCookie) {
      const token = sessionCookie.split('=')[1];
      console.log(token);
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        let user = decodedToken;
        if (redirect_status === "succeeded") {
            // check intentId from stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
            console.log(intentId);
            if (paymentIntent.status === "succeeded") {
                // Update user subscription status in your database
                await updateUserSubscription(user.uid, paymentIntent.amount, intentId);
            }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }


    return <Profile />;
}