import Subscription from "@/views/Subscription";
import { stripe } from "../../../../lib/stripe";

export default async function SubscriptionPage() {
    // Create PaymentIntent as soon as the page loads
    const { client_secret: clientSecret1 } = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      payment_method_types: ['card'],
    })
    const { client_secret: clientSecret2 } = await stripe.paymentIntents.create({
      amount: 5000,
      currency: 'usd',
      payment_method_types: ['card'],
    })


    return <Subscription clientSecret1={clientSecret1} clientSecret2={clientSecret2}/>;
}