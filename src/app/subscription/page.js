'use client';
import Sidebar from "@/components/Sidebar";
import { Icon } from "@iconify/react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import SubscriptionPay from "@/components/SubscriptionPay";

const explanations = [
    {
        "icon": "/images/sub1.png",
        "title": "Share narratives on polls",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        "icon": "/images/sub2.png",
        "title": "Earn money on blockchain",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        "icon": "/images/sub3.png",
        "title": "Fast, simple and secure",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }, 
];

const subscriptionItems = [
    "Share narratives on polls",
    "Earn money with your engagement",
    "Get improved insights",
    "Withdraw with crypto",
    "Cancel anytime"
]

export default function Support() {
    const [showPayDlg, setShowPayDlg] = useState(false);

    return (
        <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='hidden md:flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Poll Mania Premium</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Upgrade your account and earn money with your activity</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto md:pt-[30px]'>
            <div className="flex px-[12px] md:px-[52px] gap-[32px] md:py-[36px] flex-col md:flex-row items-center">
              <div className='md:hidden text-[30px] leading-[20px] font-semibold'>Poll Mania Premium</div>
              <div className='md:hidden text-[16px] leading-[16px] text-[#7C7C7C]'>Upgrade your account and earn money with your activity</div>
              
              <div className="flex flex-1 flex-col md:hidden">
                    <div className="w-full rounded-[16px] flex flex-col bg-white overflow-hidden">
                        <div className="w-full bg-subyellow h-[44px] flex items-center justify-center text-[14px] leading-[20px] text-semibold">
                            One plan, crystal clear.
                        </div>
                        <div className="border-l border-r border-b border-subprimary flex flex-col rounded-b-[16px]">
                            <div className="flex flex-col gap-[16px] px-[32px] pt-[32px]">
                                <p className="text-[24px] leading-[60px] text-center"><span className="text-[48px]">$5</span>/month</p>
                                <p className="text-[16px] leading-[24px] text-tertiary-600 text-center">Everything in <b>free plan</b> plus....</p>
                            </div>
                            <div className="flex flex-col gap-[16px] px-[32px] pt-[32px] pb-[40px]">
                                {
                                    subscriptionItems.map((item, index) => {
                                        return (
                                            <div key={`subscription-item-${index}`} className="flex gap-[16px] items-center">
                                                <div className="border rounded-full border-[#079455] flex items-center justify-center w-[24px] h-[24px] p-[6px]">
                                                    <Icon icon="ri:check-line" className="text-[#079455]" />
                                                </div>
                                                <div className="text-[16px] leading-[24px] text-[#475467]">{item}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="px-[32px] pb-[32px] w-full">
                                <button className="w-full rounded-[10px] bg-blue text-white py-[12px] px-[14px]" onClick={() => setShowPayDlg(true)}>Start Now</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-[48px]">
                    {
                        explanations.map((item, index) => {
                            return (
                                <div key={`subscription-explanation-${index}`} className="flex gap-[16px] items-start">
                                    <div className="border rounded-[10px] border-subprimary flex items-center justify-center w-[48px] h-[48px] p-[12px]">
                                        <img src={item.icon} width={24} />
                                    </div>
                                    <div className="flex flex-col gap-[16px]">
                                        <div className="text-[18px] leading-[28px] font-semibold">{item.title}</div>
                                        <div className="text-[16px] leading-[24px] text-[#475467]">{item.content}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="hidden md:flex flex-1 flex-col">
                    <div className="w-full rounded-[16px] flex flex-col bg-white overflow-hidden">
                        <div className="w-full bg-subyellow h-[44px] flex items-center justify-center text-[14px] leading-[20px] text-semibold">
                            One plan, crystal clear.
                        </div>
                        <div className="border-l border-r border-b border-subprimary flex flex-col rounded-b-[16px]">
                            <div className="flex flex-col gap-[16px] px-[32px] pt-[32px]">
                                <p className="text-[24px] leading-[60px] text-center"><span className="text-[48px]">$5</span>/month</p>
                                <p className="text-[16px] leading-[24px] text-tertiary-600 text-center">Everything in <b>free plan</b> plus....</p>
                            </div>
                            <div className="flex flex-col gap-[16px] px-[32px] pt-[32px] pb-[40px]">
                                {
                                    subscriptionItems.map((item, index) => {
                                        return (
                                            <div key={`subscription-item-${index}`} className="flex gap-[16px] items-center">
                                                <div className="border rounded-full border-[#079455] flex items-center justify-center w-[24px] h-[24px] p-[6px]">
                                                    <Icon icon="ri:check-line" className="text-[#079455]" />
                                                </div>
                                                <div className="text-[16px] leading-[24px] text-[#475467]">{item}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="px-[32px] pb-[32px] w-full">
                                <button className="w-full rounded-[10px] bg-blue text-white py-[12px] px-[14px]"  onClick={() => setShowPayDlg(true)}>Start Now</button>
                            </div>
                        </div>
                    </div>
                </div>
                <SubscriptionPay show={showPayDlg} hideDialog={() => setShowPayDlg(false)} />
            </div>
          </div>
        </div>);
}