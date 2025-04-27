import { createTippingHistory, getUserById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../lib/firebase";

const USDT_BEP20_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // Replace with actual USDT contract address on BSC
const USDT_ABI = [
  "function transfer(address to, uint amount) public returns (bool)",
];

export default function TipAuthor({show, selectedUser, hideDialog}) {
    const [tipAmount, setTipAmount] = useState("");
    
    if (!show)
        return "";

    const onSend = async () => {
        const user = await getUserById(selectedUser.id);
        if (!user.wallet_address) {
            toast.error("Target user did not set wallet address yet...");
            return;
        }
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
                
                    const tx = await contract.transfer(user.wallet_address, value);
                    await tx.wait();

                    await createTippingHistory({
                        userId: auth.currentUser.uid,
                        description: "To " + selectedUser.fullname,
                        amount: tipAmount,
                        tx: tx.hash
                    });

                    await createTippingHistory({
                        userId: selectedUser.id,
                        description: "From " + auth.currentUser.displayName,
                        amount: tipAmount,
                        tx: tx.hash
                    });

                    toast.success("Tip Sent Successfully!");
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

    return <div>
        <div id="default-modal" tabIndex="-1" className="flex bg-[#000000cc] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <div className="flex gap-[16px] items-center">
                            <img src="/images/tip_icon.png" />
                            <div className="flex flex-col gap-[4px]">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Choose your payment method
                                </h3>
                                <div className="text-[#475467] text-[14px] leading-[20px]">You can use credit card / Crypto</div>
                            </div>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => hideDialog()}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className="flex flex-col gap-[16px]">
                            <input className="outline-none border border-primary py-[10px] px-[14px]" placeholder="Enter tip amount in USD" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} />
                            <div className="flex rounded-[12px] border-[2px] border-blue items-center p-[16px]">
                                <img src="/images/tether.png" />
                                <div className="flex flex-1 flex-col gap-[2px]">
                                    <p className="text-[16px] leading-[24px]">Tether (USDT) <span className="text-tertiary-600">BEP20 Network</span></p>
                                    <p className="text-tertiary-600 text-[16px] leading-[24px]">Minimum amount: $2</p>
                                </div>
                                <div className="w-[20px] h-[20px] border-[5px] rounded-full border-blue bg-white">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-[12px]">
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px]" onClick={() => hideDialog()}> Cancel </button>
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px] text-white bg-blue" onClick={() => onSend()}> Tip {selectedUser.fullname} </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;    
}