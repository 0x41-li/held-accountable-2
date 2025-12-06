'use client';
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { getUserById, updateUserById, getViralDetections } from "@/services/polls/polls";
import { onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

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
    const [activeTab, setActiveTab] = useState("PASSWORD");
    const [viralData, setViralData] = useState([]);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                return;
            }
            getUserById(auth.currentUser.uid).then(async u => {
                setUser(u);
                setFullname(u.fullname);
                setEmail(u.email);
                setUsername(u.username);
                setWalletAddress(u.wallet_address);
            });
        });

        getViralDetections().then(data => {
            setViralData(data.slice(0, 3)); // Get first 3 viral detections
        });

        return () => unsubscribe();
    }, []);
    
    const saveChanges = async () => {
        try {
            if (activeTab === "PASSWORD" && newPassword.length > 0) {
                if (newPassword !== confirmPassword) {
                    toast.error("New passwords do not match!");
                    return;
                }
                const u = await signInWithEmailAndPassword(auth, user.email, oldPassword)
                if (u) {
                    await updatePassword(u.user, newPassword);
                }
            }

            await updateUserById(auth.currentUser.uid, {
                ...user,
                username,
                fullname,
                wallet_address: walletAddress
            });

            toast.success("Changes applied successfully!");
            // Reset password fields after successful save
            if (activeTab === "PASSWORD") {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        }
        catch (e) {
            console.error(e);
            toast.error("Errors met during saving");
        }
    }

    if (!user)
        return <></>;

    const tabs = ["PERSONAL", "ACCOUNT PLAN", "FINANCIAL", "PASSWORD"];

    return (
    <div className='w-full h-full overflow-hidden flex flex-col shadow-sm'>
        {/* Header */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start flex-1 justify-between gap-4">
            <div className="flex items-end gap-3 mt-4 flex-col md:flex-row">
              <div className="flex gap-[16px] items-center">
                <h1 className="text-3xl font-bold text-[#2b425b]">Profile</h1>
              </div>
              <p className="text-[#475467] text-sm md:text-base text-left md:text-right">Manage your account settings and preferences</p>
            </div>
          
            <button
                className="hidden md:block gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => router.push("/app/subscription")}
            >
              Subscribe
            </button>
          </div>
        </div>
        
        <div className='flex-1 flex flex-col md:flex-row h-full overflow-hidden'>
          {/* Left Section - Profile Management */}
          <div className='flex-1 flex flex-col overflow-auto pt-[30px] px-6 md:px-10'>
            {/* User Info Card */}
            <div className="bg-[#F7F8FF] card-item p-4 md:p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={fullname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#2b425b] text-lg md:text-xl font-bold">{fullname?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h3 className="text-2xl md:text-[36px] font-semibold text-[#2b425b]">{fullname || "User"}</h3>
                  <Icon icon="mdi:pencil" width={20} height={20} className="md:w-6 md:h-6 text-[#3D83FF] cursor-pointer hover:text-[#2B425B]" />
                </div>
                <p className="text-sm text-[#98A2B3]">{email}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 mt-2 mb-6 overflow-x-auto pb-2 -mx-6 md:mx-0 px-6 md:px-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? "text-blue-700 md:border border-dashed border-[#2B425B40] rounded-full px-3 md:px-4 py-2"
                      : "text-[#2b425b] hover:text-[#101828]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 pb-6 md:pb-8">
              {activeTab === "PERSONAL" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Full Name</label>
                    <input 
                      type="text" 
                      className="px-4 py-3 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                      placeholder="Enter your full name" 
                      value={fullname} 
                      onChange={(e) => setFullname(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Email</label>
                    <input 
                      type="email" 
                      className="px-4 py-3 rounded-lg border border-[#D0D5DD] text-[#101828] bg-[#F9FAFB] cursor-not-allowed" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Username</label>
                    <input 
                      type="text" 
                      className="px-4 py-3 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                      placeholder="Enter your username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="gradient-button text-white px-6 py-3 font-semibold hover:opacity-90 transition-opacity rounded-full" onClick={saveChanges}>
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "ACCOUNT PLAN" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Current Plan</label>
                    <div className="flex items-center gap-3">
                      {user.subscripted_at > Date.now() ? (
                        <>
                          <img src="/images/subscription.png" alt="Premium" width={24} height={24} />
                          <span className="text-[#2B425B]">Premium Subscription</span>
                        </>
                      ) : (
                        <span className="text-[#98A2B3]">Free Plan</span>
                      )}
                      <button className="ml-auto">
                        <img src="/images/sub-history.png" alt="History" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Renewal Date</label>
                    <span className="text-[#2B425B]">{user.subscripted_at > Date.now() ? new Date(user.subscripted_at).toLocaleDateString() : "N/A"}</span>
                </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Total Earnings</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2B425B] font-semibold">$ 0</span>
                      <span className="text-xs text-[#98A2B3]">Updated 30 sec ago.</span>
                </div>
                </div>
                  <div className="flex items-center gap-4 pt-4">
                    {user.subscripted_at > Date.now() && (
                      <button className="text-red-500 text-sm font-medium hover:text-red-600">Cancel Premium</button>
                    )}
                    <Link 
                      href="/app/subscription" 
                      className="gradient-button text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity ml-auto"
                    >
                      {user.subscripted_at > Date.now() ? "Renew Now" : "Subscribe"}
                    </Link>
                </div>
                </div>
              )}

              {activeTab === "FINANCIAL" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Wallet address (BEP20)</label>
                    <input 
                      type="text" 
                      className="px-4 py-3 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                      placeholder="Enter your BEP20 wallet address" 
                      value={walletAddress} 
                      onChange={(e) => setWalletAddress(e.target.value)} 
                    />
                </div>
                  <div className="flex flex-col gap-2 overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead className="bg-white border-b border-[#E4E7EC]">
                        <tr>
                          <th className="text-left p-3 text-xs font-medium text-[#98A2B3]">Tips</th>
                          <th className="text-left p-3 text-xs font-medium text-[#98A2B3]">Date</th>
                          <th className="text-left p-3 text-xs font-medium text-[#98A2B3]">Amount</th>
                          <th className="text-left p-3 text-xs font-medium text-[#98A2B3]">TX ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-sm text-[#98A2B3]">No tips yet</td>
                        </tr>
                    </tbody>
                </table>
                  </div>
                  <div className="flex justify-end">
                    <button className="gradient-button text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity" onClick={saveChanges}>
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "PASSWORD" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        className="w-full px-4 py-3 pr-11 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                        placeholder="Enter your current password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828]"
                      >
                        <Icon 
                          icon={showCurrentPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                          width={20} 
                          height={20} 
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        className="w-full px-4 py-3 pr-11 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                        placeholder="Enter your new password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828]"
                      >
                        <Icon 
                          icon={showNewPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                          width={20} 
                          height={20} 
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#344054]">Repeat New Password</label>
                    <div className="relative">
                      <input 
                        type={showRepeatPassword ? "text" : "password"} 
                        className="w-full px-4 py-3 pr-11 rounded-lg border border-[#D0D5DD] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent" 
                        placeholder="Re-Enter your new password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828]"
                      >
                        <Icon 
                          icon={showRepeatPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                          width={20} 
                          height={20} 
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="gradient-button text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity" onClick={saveChanges}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Sidebar */}
          <div className="hidden xl:flex xl:w-[440px] border-l border-[#E4E7EC] flex-col">
            <div className="flex flex-col gap-8 p-6 xl:p-10 overflow-auto">

              {/* Viral Detection Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#101828]">Viral Detection</h3>
                    <img src="/images/hot_badge.png" alt="Hot" width={32} height={20} />
                  </div>
                  <Link href="/app/viral-detection" className="text-sm text-[#3D83FF] font-medium hover:underline">
                    ALL
                  </Link>
                </div>
                <div className="flex flex-col gap-4 bg-[#F7F8FF80] rounded-[32px] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
                  {viralData.length > 0 ? (
                    viralData.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-4 transition-colors hover:bg-white/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-[#101828] line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#98A2B3] line-clamp-2">
                          {item.content?.replace(/\*/g, "").replace(/#/g, "").substring(0, 100) +
                          (item.content?.length > 100 ? "..." : "")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#98A2B3] text-center py-4">No viral detections yet</p>
                  )}
                </div>
              </div>

              {/* Company Section */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#101828]">Company</h3>
                  <img src="/images/hot_badge.png" alt="Hot" width={32} height={20} />
                </div>
                <div className="flex flex-col gap-4 rounded-lg">
                  <div className="flex gap-4 w-full items-center bg-[#F7F8FF] rounded-lg p-4">
                    <img src="/images/viralPage/companybg.png" alt="Company" width={80} height={80} className="rounded-lg flex-shrink-0" />
                    <p className="text-sm text-[#475467] leading-6 flex-1">
                      We approach every challenge with curiosity and rigor, digging beneath the surface
                    </p>
                  </div>
                  <p className="text-xs text-[#98A2B3] leading-6">
                    Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence of Former Leaducinda
                  </p>
                  <a
                    href="/about-us"
                    className="text-[#3D83FF] text-xs font-bold hover:underline"
                  >
                    LEARN MORE
                  </a>
                </div>
              </div>
                </div>
            </div>
        </div>
      </div>);
}