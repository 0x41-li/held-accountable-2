import Subscription from "@/views/Subscription";
import { stripe } from '../../../lib/stripe'

export default async function SubscriptionPage() {
    const calculateOrderAmount = (items) => {
        // Replace this constant with a calculation of the order's amount
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        return 1400;
      };
    // Create PaymentIntent as soon as the page loads
    const { client_secret: clientSecret } = await stripe.paymentIntents.create({
      amount: calculateOrderAmount([{ id: 'xl-tshirt' }]),
      currency: 'eur',
      payment_method_types: ['card'],
    })

    return <Subscription clientSecret={clientSecret} />;
}