'use client';
import { Icon } from "@iconify/react";
import { useState } from "react";
import SubscriptionPay from "@/components/SubscriptionPay";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const features = [
    {
        "icon": "/images/subscription/share.png",
        "title": "Share narratives on headlines"
    },
    {
        "icon": "/images/subscription/earn.png",
        "title": "Earn money on blockchain"
    },
    {
        "icon": "/images/subscription/fast.png",
        "title": "Fast, simple and secure"
    },
    {
        "icon": "/images/subscription/earn2.png",
        "title": "Earn money on blockchain"
    },
];

const subscriptionItems = [
    "Share narratives on polls",
    "Earn money with your engagement",
    "Get improved insights",
    "Withdraw with crypto",
    "Cancel anytime"
]

export default function Subscription({ clientSecret1, clientSecret2 }) {
    const [showPayDlg, setShowPayDlg] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState("monthly");
    const [isSubscribed, setIsSubscribed] = useState(true); // Assuming user has monthly subscription
    const appearance = {
        theme: 'stripe',
    };

    return (
        <div className='w-full h-full overflow-auto'>
            <div className='w-full h-full flex flex-col p-6 md:p-8'>
                {/* Header */}
                <div className='flex flex-col gap-2 mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold text-[#101828]'>Subscription</h1>
                    <p className='text-base text-[#475467]'>Upgrade your account and earn money with your activity</p>
                </div>

                {/* Main Content */}
                <div className='flex flex-col lg:flex-row gap-8 flex-1'>
                    {/* Subscription Cards */}
                    <div className='flex flex-col md:flex-row gap-6 flex-1 justify-center items-start'>
                        {/* Monthly Plan */}
                        <div className='relative w-full md:w-[400px] bg-[#F7F8FF80] rounded-[32px] border border-[#E9EAEB] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]'>
                            <h3 className='text-xl font-bold text-[#101828] mb-4'>Monthly</h3>
                            <div className='mb-6'>
                                <div className='text-5xl font-bold text-[#101828]'>$5</div>
                                <div className='text-sm text-[#98A2B3]'>month</div>
                            </div>
                            <p className='text-xs text-[#98A2B3] mb-4'>Everything in free plan plus...</p>
                            <div className='flex flex-col gap-3 mb-6'>
                                {subscriptionItems.map((item, index) => (
                                    <div key={`monthly-item-${index}`} className='flex items-center gap-3'>
                                        <Icon icon="ri:check-line" className="text-[#1D74D6]" width={20} height={20} />
                                        <span className='text-sm text-[#101828]'>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                className={`w-full rounded-lg py-3 px-4 font-bold text-sm transition-all ${
                                    isSubscribed && subscriptionType === 'monthly'
                                        ? 'text-[#344054]'
                                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md'
                                }`}
                                onClick={() => {
                                    if (!isSubscribed || subscriptionType !== 'monthly') {
                                        setSubscriptionType("monthly");
                                        setShowPayDlg(true);
                                    }
                                }}
                            >
                                {isSubscribed && subscriptionType === 'monthly' ? 'Your Subscription' : 'Upgrade'}
                            </button>
                        </div>

                        {/* Yearly Plan */}
                        <div className='relative w-full md:w-[400px] bg-[#F7F8FF80] rounded-[32px] border border-[#E9EAEB] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]'>
                            {/* Most Popular Badge */}
                            <div className='absolute -top-3 -right-3 px-3 py-1 badge-bg text-white text-xs font-bold rounded-full uppercase'>
                                Most Popular
                            </div>
                            <h3 className='text-xl font-bold text-[#101828] mb-4'>Yearly</h3>
                            <div className='mb-6'>
                                <div className='text-5xl font-bold text-[#101828]'>$50</div>
                                <div className='text-sm text-[#98A2B3]'>year</div>
                            </div>
                            <p className='text-xs text-[#98A2B3] mb-4'>Everything in free plan plus...</p>
                            <div className='flex flex-col gap-3 mb-6'>
                                {subscriptionItems.map((item, index) => (
                                    <div key={`yearly-item-${index}`} className='flex items-center gap-3'>
                                        <Icon icon="ri:check-line" className="text-[#1D74D6]" width={20} height={20} />
                                        <span className='text-sm text-[#101828]'>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <button 
                                    className='gradient-button rounded-full py-3 px-[50px] font-bold text-sm text-white shadow-sm hover:shadow-md transition-all'
                                    onClick={() => {
                                        setSubscriptionType("yearly");
                                        setShowPayDlg(true);
                                    }}
                                >
                                    Upgrade
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className='lg:w-[300px]'>
                        <h3 className='text-lg font-bold text-[#101828] mb-6'>Features</h3>
                        <div className='flex flex-col gap-6'>
                            {features.map((feature, index) => (
                                <div key={`feature-${index}`} className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0'>
                                        <img src={feature.icon} />
                                    </div>
                                    <p className='text-sm text-[#101828] font-medium'>{feature.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Dialogs */}
                <Elements stripe={stripePromise} options={{ appearance, clientSecret: clientSecret1 }}>
                    {subscriptionType === 'monthly' && <SubscriptionPay show={showPayDlg} subscriptionType={subscriptionType} hideDialog={() => setShowPayDlg(false)} />}
                </Elements>
                <Elements stripe={stripePromise} options={{ appearance, clientSecret: clientSecret2 }}>
                    {subscriptionType === 'yearly' && <SubscriptionPay show={showPayDlg} subscriptionType={subscriptionType} hideDialog={() => setShowPayDlg(false)} />}
                </Elements>
            </div>
        </div>
    );
}