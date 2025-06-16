'use client';
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { getUserById, updateUserById } from "@/services/polls/polls";
import { onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Profile() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [tippings, setTippings] = useState([]);
    const [walletAddress, setWalletAddress] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                return;
            }
            getUserById(auth.currentUser.uid).then(async u => {
                setUser(user);
                setFullname(u.fullname);
                setEmail(u.email);
                setUsername(u.username);
                setWalletAddress(u.wallet_address);
            });
        });

        return () => unsubscribe();
    }, []);
    
    const saveChanges = async () => {
        try {
            if (newPassword.length > 0) {
                const u = await signInWithEmailAndPassword(auth, user.email, oldPassword)
                if (u) {
                    await updatePassword(u, newPassword);
                }
            }

            await updateUserById(auth.currentUser.uid, {
                ...user,
                username,
                fullname
            });

            toast.success("Changes applied successfully!");
        }
        catch (e) {
            toast.error("Errors met during saving");
        }
    }

    return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
        <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
          <div className='flex flex-col gap-[4px] flex-1'>
            <div className='text-[30px] leading-[38px] font-semibold'>Profile</div>
          </div>
        </div>
        <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px] pl-[24px]'>
            <div className="flex flex-col gap-[16px] w-full pr-[20px] md:pr-[0px] pb-[20px] md:pb-[0px] md:w-[640px]">
                <div className="text-[18px] leading-[38px]">Personal Info</div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Full Name</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your full name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Email</span>
                    <input type="email" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Username</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <hr />
                <div className="text-[18px] leading-[38px]">Financial</div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Wallet address (BEP20)</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your BEP20 wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                </div>
                <table>
                    <thead className="bg-white border-b border-primary text-[12px] text-tertiary-600 leading-[18px] py-[10px]">
                        <tr>
                            <th className="w-[265px] p-[10px]">Tips</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>TX ID</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <hr/>
                <div className="text-[18px] leading-[38px]">Update Password</div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Current Password</span>
                    <input type="password" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">New Password</span>
                    <input type="password" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter your new password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Repeat New Password</span>
                    <input type="password" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="re-Enter your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <button className="rounded-[8px] bg-blue py-[10px] px-[14px] text-white" onClick={saveChanges}>Apply Changes</button>
                </div>
            </div>
        </div>
      </div>);
}