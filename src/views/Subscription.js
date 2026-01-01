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
import NotificationDropdown from "@/components/NotificationDropdown";

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
    "Unlimited access - Read all finance and crypto headlines without limits.",
    "Viral detection - Identify emerging themes, signals, and patterns early before they’re obvious.",
    "Voting Access & Member Benefits - Participate in platform voting and unlock the perks and incentives tied to engagement and understanding.",
    "Follow Companies & Filter What You See - Follow companies and use advanced filters to focus on the finance and crypto stories that matter to you.",
]

export default function Subscription({ clientSecret1, clientSecret2 }) {
    const [showPayDlg, setShowPayDlg] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState("yearly");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const appearance = {
        theme: 'stripe',
    };

    return (
        <div className='w-full h-full overflow-auto'>
            <div className='w-full h-full flex flex-col p-4 md:p-8'>
                {/* Header */}
                <div className='flex flex-col gap-2 mb-6 md:mb-8'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h1 className='text-2xl md:text-4xl font-bold text-[#2B425B]'>Subscription</h1>
                            <p className='text-sm md:text-base text-[#475467]'>Upgrade your account and earn money</p>
                        </div>
                        <div className="hidden md:flex items-center">
                            <NotificationDropdown />
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className='md:hidden flex flex-col'>
                    {/* Subscription Cards */}
                    <div className='flex flex-row gap-3 mb-6'>
                        {/* Monthly Plan */}
                        <div
                            onClick={() => setSubscriptionType("monthly")}
                            className={`relative flex-1 rounded-2xl border p-4 text-center cursor-pointer transition-all ${subscriptionType === 'monthly'
                                ? 'bg-white border-[#3D83FF] shadow-md'
                                : 'bg-[#F9FAFB] border-[#E4E7EC] hover:border-[#D0D5DD]'
                                }`}
                        >
                            <h3 className='text-[20px] font-bold text-[#2B425B] mb-3'>Monthly</h3>
                            <div className='mb-4'>
                                <div className='text-[60px] font-bold text-[#2B425B] leading-none'>$5</div>
                                <div className='text-[14px] text-[#2B425B] mt-1'>month</div>
                            </div>
                        </div>

                        {/* Yearly Plan */}
                        <div
                            onClick={() => setSubscriptionType("yearly")}
                            className={`relative flex-1 rounded-2xl border p-4 text-center cursor-pointer transition-all ${subscriptionType === 'yearly'
                                ? 'bg-white border-[#3D83FF] shadow-md'
                                : 'bg-white border-[#E4E7EC] hover:border-[#D0D5DD]'
                                }`}
                        >
                            {/* Most Popular Badge */}
                            <div className='absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white text-[10px] font-bold rounded-full uppercase'>
                                Most Popular
                            </div>
                            <h3 className='text-[20px] font-bold text-[#2B425B] mb-3'>Yearly</h3>
                            <div className='mb-4'>
                                <div className='text-[60px] font-bold text-[#2B425B] leading-none'>$50</div>
                                <div className='text-[14px] text-[#2B425B] mt-1'>year</div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className='mb-6'>
                        <p className='text-xs text-[#98A2B3] mb-4'>Everything in free plan plus..</p>
                        <div className='flex flex-col gap-3'>
                            {subscriptionItems.map((item, index) => (
                                <div key={`item-${index}`} className='flex flex-col items-start justify-start gap-3'>
                                    <div className="flex items-start gap-3">
                                        <Icon icon="ri:check-line" className="text-[#1D74D6]" width={20} height={20} />
                                        <span className='text-sm text-[#2B425B]'>{item.split(" - ")[0]}</span>
                                    </div>
                                    <span className='text-sm text-[#2B425B66] text-left'>{item.split(" - ")[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade Button */}
                    <div className='mt-auto'>
                        <button
                            className='w-full gradient-button rounded-xl py-3 font-bold text-sm text-white shadow-sm hover:shadow-md transition-all'
                            onClick={() => {
                                setShowPayDlg(true);
                            }}
                        >
                            Upgrade
                        </button>
                    </div>
                    {/* Features Section */}
                    <div className="mt-8">
                        <h3 className='text-[24px] font-bold text-[#2B425B] mb-6'>Features</h3>
                        <div className='flex flex-col gap-6'>
                            {features.map((feature, index) => (
                                <div key={`feature-${index}`} className='flex items-center gap-4'>
                                    <div className='w-12 h-12 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0'>
                                        <img src={feature.icon} />
                                    </div>
                                    <p className='text-sm text-[#2B425B] font-medium'>{feature.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className='hidden md:flex flex-col lg:flex-row gap-8 flex-1'>
                    {/* Subscription Cards */}
                    <div className='flex flex-col md:flex-row gap-6 flex-1 justify-center items-start'>
                        {/* Monthly Plan */}
                        <div className='relative w-full md:w-[400px] bg-[#F7F8FF80] rounded-[32px] border border-[#E9EAEB] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)] text-center'>
                            <h3 className='text-[24px] font-bold text-[#2B425B] mb-4'>Monthly</h3>

                            <div className='mb-6'>
                                <div className='text-[90px] font-bold text-[#2B425B]'>$5</div>
                                <div className='text-[16px] text-[#2B425B]'>month</div>
                            </div>

                            <p className='text-xs text-[#98A2B3] mb-4 text-left'>Everything in free plan plus...</p>

                            <div className='flex flex-col gap-[17px] mb-6'>
                                {subscriptionItems.map((item, index) => (
                                    <div key={`monthly-item-${index}`} className='flex flex-col items-start justify-start gap-3'>
                                        <div className="flex items-start gap-3">
                                            <Icon icon="ri:check-line" className="text-[#1D74D6]" width={20} height={20} />
                                            <span className='text-sm text-[#2B425B]'>{item.split(" - ")[0]}</span>
                                        </div>
                                        <span className='text-sm text-[#2B425B66] text-left'>{item.split(" - ")[1]}</span>
                                    </div>
                                ))}
                            </div>

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

                        {/* Yearly Plan */}
                        <div className='relative w-full md:w-[400px] bg-[#F7F8FF80] rounded-[32px] border border-[#E9EAEB] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)] text-center'>
                            {/* Most Popular Badge */}
                            <div className='absolute -top-3 -right-3 px-3 py-1 badge-bg text-white text-xs font-bold rounded-full uppercase'>
                                Most Popular
                            </div>

                            <h3 className='text-[24px] font-bold text-[#2B425B] mb-4'>Yearly</h3>

                            <div className='mb-6'>
                                <div className='text-[90px] font-bold text-[#2B425B]'>$50</div>
                                <div className='text-[16px] text-[#2B425B]'>year</div>
                            </div>

                            <p className='text-xs text-[#98A2B3] mb-4 text-left'>Everything in free plan plus...</p>

                            <div className='flex flex-col gap-[17px] mb-6'>
                                {subscriptionItems.map((item, index) => (
                                    <div key={`yearly-item-${index}`} className='flex flex-col items-start justify-start gap-3'>
                                        <div className="flex items-start gap-3">
                                            <Icon icon="ri:check-line" className="text-[#1D74D6]" width={20} height={20} />
                                            <span className='text-sm text-[#2B425B]'>{item.split(" - ")[0]}</span>
                                        </div>
                                        <span className='text-sm text-[#2B425B66] text-left'>{item.split(" - ")[1]}</span>
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
                    <div>
                        <h3 className='text-[24px] font-bold text-[#2B425B] mb-6'>Features</h3>
                        <div className='flex flex-col gap-6'>
                            {features.map((feature, index) => (
                                <div key={`feature-${index}`} className='flex items-center gap-4'>
                                    <div className='w-12 h-12 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0'>
                                        <img src={feature.icon} />
                                    </div>
                                    <p className='text-sm text-[#2B425B] font-medium'>{feature.title}</p>
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