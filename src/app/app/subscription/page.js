import Subscription from "@/views/Subscription";
import { stripe } from "../../../../lib/stripe";

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  let clientSecret1 = null;
  let clientSecret2 = null;

  if (stripe) {
    // Create PaymentIntent as soon as the page loads
    const { client_secret: cs1 } = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    const { client_secret: cs2 } = await stripe.paymentIntents.create({
      amount: 5000,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    clientSecret1 = cs1;
    clientSecret2 = cs2;
  }

  return <Subscription clientSecret1={clientSecret1} clientSecret2={clientSecret2} />;
}