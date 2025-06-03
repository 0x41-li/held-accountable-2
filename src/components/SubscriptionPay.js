import { createTippingHistory, getUserById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../lib/firebase";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const USDT_BEP20_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // Replace with actual USDT contract address on BSC
const USDT_ABI = [
  "function transfer(address to, uint amount) public returns (bool)",
];

export default function SubscriptionPay({show, hideDialog}) {
    const [tipAmount, setTipAmount] = useState("5");
    const [paymentType, setPaymentType] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const elements = useElements();
    const stripe = useStripe();

    const paymentElementOptions = {
        layout: "accordion",
    };
    if (!show)
        return "";

    const onSend = async () => {
        if (paymentType == 0) {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    let account = accounts[0];
                    if (!account) {
                        toast.error("Please connect MetaMask first!");
                        return;
                    }
                
                    try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        const contract = new ethers.Contract(USDT_BEP20_ADDRESS, USDT_ABI, signer);
                    
                        const decimals = 18; // Check the token decimals
                        const value = ethers.utils.parseUnits(tipAmount, decimals);
                    
                        const tx = await contract.transfer("192.168.135.102", value);
                        await tx.wait();
    
                        toast.success("Paid Successfully!");
                        hideDialog();
                    } catch (error) {
                        toast.error("Transaction Error: " + error);
                    }
                } catch (error) {
                    toast.error("Connection Error: " + error);
                }
            } else {
                toast.error("Please install MetaMask!");
            }
        }
        else {
            if (!stripe || !elements) {
                // Stripe.js hasn't yet loaded.
                // Make sure to disable form submission until Stripe.js has loaded.
                return;
            }
        
            setIsLoading(true);
        
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/success",
                },
            });
        
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        
            setIsLoading(false);
        }
    }

    return <div>
        <div id="default-modal" tabIndex="-1" className="flex bg-[#000000cc] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <div className="flex gap-[16px] items-center">
                            <img src="/images/card.png" />
                            <div className="flex flex-col gap-[4px]">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Choose your payment method
                                </h3>
                                <div className="text-[#475467] text-[14px] leading-[20px]">You can use credit card / Crypto</div>
                            </div>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal" onClick={() => hideDialog()}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className="flex flex-col gap-[16px]">
                            <button className={"flex rounded-[12px] border-[2px] items-center p-[16px] h-[72px] text-left" + (paymentType == 0 ? " border-blue": "")} onClick={() => setPaymentType(0)}>
                                <img src="/images/tether.png" />
                                <div className="flex flex-1 flex-col gap-[2px]">
                                    <p className="text-[16px] leading-[24px]">Tether (USDT) <span className="text-tertiary-600">BEP20 Network</span></p>
                                </div>
                                {paymentType == 0 && <div className="w-[20px] h-[20px] border-[5px] rounded-full border-blue bg-white">
                                </div>}
                                {paymentType == 1 && <div className="w-[20px] h-[20px] border-[1px] rounded-full bg-white">
                                </div>}
                            </button>
                            <button className={"flex rounded-[12px] border-[2px] items-center p-[16px] h-[72px] gap-[12px] text-left" + (paymentType == 1 ? " border-blue": "")} onClick={() => setPaymentType(1)}>
                                <img src="/images/mastercard.png" className="pl-[5px]" />
                                <div className="flex flex-1 flex-col gap-[2px]">
                                    <p className="text-[16px] leading-[24px]">Mastercard <span className="text-tertiary-600">Global</span></p>
                                </div>
                                {paymentType == 1 && <div className="w-[20px] h-[20px] border-[5px] rounded-full border-blue bg-white">
                                </div>}
                                {paymentType == 0 && <div className="w-[20px] h-[20px] border-[1px] rounded-full bg-white">
                                </div>}
                            </button>
                        </div>
                    </div>
                    {paymentType == 1 && <PaymentElement id="payment-element" />}
                    {message && <div id="payment-message">{message}</div>}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-[12px]">
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px]" onClick={() => hideDialog()}> Cancel </button>
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px] text-white bg-blue" onClick={() => onSend()}> {isLoading ? <div className="spinner" id="spinner"></div> : "Proceed"} </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;    
}