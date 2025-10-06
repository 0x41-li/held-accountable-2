'use client';
import Sidebar from "@/components/Sidebar";
import { Icon } from "@iconify/react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendContact } from "@/services/polls/polls";

const faqs = [
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
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
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    })

    const [isSending, setIsSending] = useState(false);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleFirstName = (e) => {
        setData({
            ...data,
            firstName: e.target.value
        });
    }
    const handleLastName = (e) => {
        setData({
            ...data,
            lastName: e.target.value
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
                message: data.firstName + " " + data.lastName + "\n" + data.message
            });
            toast.success("Sent successfully");
        }
        catch (e) {
            toast.error(e);
        }
        setIsSending(false);
    }

    return (
        <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Contact us</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Fill the form below and we will contact you in 24 hours</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px]'>
            <div className="flex px-[60px] gap-[60px] flex-col md:flex-row">
                <div className="flex flex-1 flex-col gap-[32px]">
                    <div className="flex gap-[32px] flex-col md:flex-row">
                        <div className="flex flex-col gap-[6px]">
                            <div className="text-[14px] leading-[20px]">First name <span className="text-[#ff0000]">*</span></div>
                            <input type="text" className="border border-primary rounded-[8px] px-[14px] py-[10px]" placeholder="First Name" value={data.firstName} onChange={handleFirstName} />
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <div className="text-[14px] leading-[20px]">Last name <span className="text-[#ff0000]">*</span></div>
                            <input type="text" className="border border-primary rounded-[8px] px-[14px] py-[10px]" placeholder="Last Name" value={data.lastName} onChange={handleLastName} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] leading-[20px]">Email <span className="text-[#ff0000]">*</span></div>
                        <input type="text" className="border border-primary rounded-[8px] px-[14px] py-[10px]" placeholder="you@company.com" value={data.email} onChange={handleEmail} />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] leading-[20px]">Message <span className="text-[#ff0000]">*</span></div>
                        <textarea className="border border-primary rounded-[8px] px-[14px] py-[10px]" placeholder="Leave us a message" value={data.message} onChange={handleMessage}></textarea>
                    </div>

                    <div className="flex gap-[14px] text-tertiary-600">
                        <input type="checkbox" ref={agreeRef} />
                        You agree to our friendly <u>privacy policy</u>.
                    </div>
                    <button className="rounded-[8px] bg-blue w-full text-white py-[10px]" disabled={isSending} onClick={handleSend}>Send a message</button>
                </div>
                <div className="flex flex-1 flex-col">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-300">
                        <button
                            className="w-full flex justify-between items-center p-4 text-left text-gray-900 font-semibold hover:bg-gray-200 transition-all duration-200"
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
                            <div className="p-4 text-gray-700 bg-gray-50">
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