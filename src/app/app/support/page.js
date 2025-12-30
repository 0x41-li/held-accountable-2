'use client';
import Sidebar from "@/components/Sidebar";
import { Icon } from "@iconify/react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendContact } from "@/services/polls/polls";
import NotificationDropdown from "@/components/NotificationDropdown";
import "./page.css";

const faqs = [
    {
      question: "Is there a free trial available?",
      answer: "Yes. We offer a free tier, and Premium gives you access to viral detection, perks, follow feature, and much more."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan anytime through your account settings."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel anytime. Your subscription will remain active until the end of your billing cycle."
    },
    {
      question: "Can other info be added to an invoice?",
      answer: "Yes, you can add additional details like company name and VAT number."
    },
    {
      question: "How does billing work?",
      answer: "Billing is done on a monthly or yearly basis, depending on your selected plan."
    }
];

export default function Support() {
    const [openIndex, setOpenIndex] = useState(null);
    const agreeRef = useRef();
    const [data, setData] = useState({
        fullname: "",
        email: "",
        message: "",
    })

    const [isSending, setIsSending] = useState(false);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleFullName = (e) => {
        setData({
            ...data,
            fullname: e.target.value
        });
    }

    const handleEmail = (e) => {
        setData({
            ...data,
            email: e.target.value
        });
    }
    const handleMessage = (e) => {
        setData({
            ...data,
            message: e.target.value
        });
    }

    const handleSend = async () => {
        if (!agreeRef.current.checked) {
            toast.error("You need to agree our friendly privacy policy first by checking the box");
            return;
        }

        if (isSending) {
            return;
        }

        setIsSending(true);

        try {
            await sendContact({
                email: data.email,
                message: data.fullname + "\n" + data.message
            });
            toast.success("Sent successfully");
        }
        catch (e) {
            toast.error(e);
        }
        setIsSending(false);
    }

    return (
        <div className='w-full h-full overflow-hidden pt-[32px] flex flex-col'>
          <div className='flex px-[24px] pb-[20px] border-secondary items-start justify-between'>
            <div className='flex flex-col md:flex-row gap-[16px] flex-1 md:items-end'>
              <div className='text-[30px] leading-[38px] font-semibold'>Contact us</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Fill the form below and we will contact you in 24 hours</div>
            </div>
            <div className="hidden md:flex items-center">
              <NotificationDropdown />
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px]'>
            <div className="flex px-6 md:px-[60px] gap-[60px] flex-col md:flex-row">
                <div className="flex flex-[2] flex-col gap-[32px] w-full items-start">
                    <div className="text-[24px] font-bold">Contact Form</div>
                    <div className="flex gap-[6px] flex-col w-full">
                        <div className="text-[14px] leading-[20px] font-bold">Full Name</div>
                        <input type="text" className="w-1/2 border border-primary rounded-[20px] px-[20px] py-[10px] bg-[#F7F8FF80] outline-none" placeholder="Full Name" value={data.fullname} onChange={handleFullName} />
                    </div>
                    <div className="flex flex-col gap-[6px] w-full">
                        <div className="text-[14px] leading-[20px] font-bold">Email</div>
                        <input type="text" className="border border-primary rounded-[20px] px-[20px] py-[10px] bg-[#F7F8FF80] outline-none" placeholder="you@company.com" value={data.email} onChange={handleEmail} />
                    </div>
                    <div className="flex flex-col gap-[6px] w-full">
                        <div className="text-[14px] leading-[20px] font-bold">Message</div>
                        <textarea className="border border-primary rounded-[20px] px-[20px] py-[10px] bg-[#F7F8FF80] outline-none" placeholder="Leave us a message" value={data.message} onChange={handleMessage}></textarea>
                    </div>

                    <div className="flex gap-[14px] text-tertiary-600">
                        <input type="checkbox" className="w-[24px] h-[24px] bg-[#F7F8FF80] outline-none" ref={agreeRef} />
                        You agree to our friendly <u>privacy policy</u>.
                    </div>
                    <button className="gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all" disabled={isSending} onClick={handleSend}>Send a message</button>
                </div>
                <div className="flex flex-1 flex-col gap-[16px]">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-300 faq">
                            <button
                                className="w-full flex justify-between items-center p-4 text-left text-gray-900 font-semibold transition-all duration-200"
                                onClick={() => toggleAccordion(index)}
                            >
                                {faq.question}
                                {openIndex === index ? (
                                <MinusCircleIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                <PlusCircleIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="p-4 text-gray-700">
                                {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>);
}