'use client';
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { getUserById, updateUserById, getViralDetections } from "@/services/polls/polls";
import { onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";

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
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationFilter, setNotificationFilter] = useState('all');
    const [statistics, setStatistics] = useState({
        voteAccuracy: 0,
        totalVotes: 0,
        totalComments: 0,
        totalPoints: 0
    });
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [accBalance, setAccBalance] = useState(0);
    const [pointHistory, setPointHistory] = useState([]);
    const [convertingPoints, setConvertingPoints] = useState(false);
    const [convertAll, setConvertAll] = useState(false);
    const [pointsToConvert, setPointsToConvert] = useState('0');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if we should open notifications tab from URL
        const tab = searchParams?.get('tab');
        if (tab === 'notifications') {
            setActiveTab('NOTIFICATIONS');
        }
    }, [searchParams]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                return;
            }
            const u = await getUserById(auth.currentUser.uid);
            setUser(u);
            setFullname(u.fullname);
            setEmail(u.email);
            setUsername(u.username);
            setWalletAddress(u.wallet_address);
            
            // Load user statistics
            loadStatistics(auth.currentUser.uid);
            // Load ACC balance
            loadAccBalance(auth.currentUser.uid);
        });

        getViralDetections().then(data => {
            setViralData(data.slice(0, 3)); // Get first 3 viral detections
        });

        return () => unsubscribe();
    }, []);

    // Load ACC balance and point history when REWARD tab is active
    useEffect(() => {
        if (activeTab === 'REWARD' && auth.currentUser) {
            loadAccBalance(auth.currentUser.uid);
            loadPointHistory(auth.currentUser.uid);
        }
    }, [activeTab]);

    const loadAccBalance = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/acc-balance`);
            if (response.ok) {
                const data = await response.json();
                setAccBalance(data.acc_balance || 0);
            }
        } catch (error) {
            console.error('Error loading ACC balance:', error);
        }
    };

    const loadPointHistory = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/point-history`);
            if (response.ok) {
                const data = await response.json();
                setPointHistory(data.history || []);
            }
        } catch (error) {
            console.error('Error loading point history:', error);
        }
    };

    const handleConvertPoints = async () => {
        if (!auth.currentUser) return;

        setConvertingPoints(true);
        try {
            const response = await fetch(`/api/users/${auth.currentUser.uid}/convert-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    convertAll: convertAll,
                    points: convertAll ? null : parseInt(pointsToConvert) || 0
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Successfully converted ${data.points_converted} points to ${data.acc_tokens_awarded} ACC tokens!`);
                // Reload statistics and ACC balance
                await loadStatistics(auth.currentUser.uid);
                await loadAccBalance(auth.currentUser.uid);
                await loadPointHistory(auth.currentUser.uid);
                setConvertAll(false);
                setPointsToConvert('');
            } else {
                toast.error(data.error || 'Failed to convert points');
            }
        } catch (error) {
            console.error('Error converting points:', error);
            toast.error('Failed to convert points');
        } finally {
            setConvertingPoints(false);
        }
    };

    const loadStatistics = async (userId) => {
        try {
            setStatisticsLoading(true);
            const response = await fetch(`/api/users/${userId}/statistics`);
            if (response.ok) {
                const data = await response.json();
                setStatistics({
                    voteAccuracy: data.statistics.vote_accuracy || 0,
                    totalVotes: data.statistics.total_votes || 0,
                    totalComments: data.statistics.total_comments || 0,
                    totalPoints: data.statistics.total_points || 0
                });
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setStatisticsLoading(false);
        }
    };

    // Load notifications when notifications tab is active or filter changes
    useEffect(() => {
        if (activeTab === 'NOTIFICATIONS' && auth.currentUser) {
            loadNotifications(auth.currentUser.uid);
        }
    }, [activeTab, notificationFilter]);

    const loadNotifications = async (userId, filter = notificationFilter) => {
        try {
            setNotificationsLoading(true);
            let url = `/api/notifications?user_id=${userId}`;
            if (filter && filter !== 'all') {
                url += `&type=${filter}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setNotificationsLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user || !auth.currentUser) return;

        try {
            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: auth.currentUser.uid }),
            });

            if (response.ok) {
                await loadNotifications(auth.currentUser.uid);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_read: true }),
            });

            if (response.ok) {
                setNotifications(notifications.map(n => 
                    n.id === notificationId ? { ...n, is_read: 1 } : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''} ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'vote_ended':
                return <Icon icon="solar:clock-circle-linear" width={32} height={32} className="text-[#2B425B]" />;
            case 'reward':
                return <Icon icon="solar:gift-linear" width={32} height={32} className="text-[#34C759]" />;
            case 'comment_reply':
                return <Icon icon="solar:chat-round-call-linear" width={32} height={32} className="text-[#3D83FF]" />;
            case 'system':
                return <Icon icon="solar:settings-linear" width={32} height={32} className="text-[#3D83FF]" />;
            default:
                return <Icon icon="solar:bell-linear" width={32} height={32} className="text-[#2B425B]" />;
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.is_read === 0) {
            handleMarkAsRead(notification.id);
        }

        if (notification.poll_id) {
            router.push(`/app/polls/${notification.poll_id}`);
        }
    };
    
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

    const tabs = ["PERSONAL", "REWARD", "ACCOUNT PLAN", "FINANCIAL", "PASSWORD", "NOTIFICATIONS"];

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
          
            <div className="hidden md:flex items-center gap-4">
              <NotificationDropdown />
              <button
                  className="gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                  onClick={() => router.push("/app/subscription")}
              >
                Subscribe
              </button>
            </div>
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

            {/* My Statistics Card */}
            <div className="card-item rounded-2xl p-4 md:p-6 mb-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-[#2B425B]">MY STATISTICS</h2>
                <button 
                  className="text-sm font-semibold text-[#3D83FF] hover:text-[#2B5FCC] transition-colors"
                  onClick={() => setActiveTab("REWARD")}
                >
                  VIEW HISTORY
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                {/* Vote Accuracy */}
                <div className="flex flex-1 flex-col items-center">
                  <div className="relative w-32 h-20 md:w-56 md:h-32 mb-2">
                    <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="voteAccuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#B2C7FF" />
                          <stop offset="100%" stopColor="#398DEB" />
                        </linearGradient>
                      </defs>
                      {/* Background arc (unfilled) */}
                      <path
                        d="M 20 80 A 80 80 0 0 1 180 80"
                        stroke="#E4E7EC"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Progress arc (filled) with gradient */}
                      <path
                        d="M 20 80 A 80 80 0 0 1 180 80"
                        stroke="url(#voteAccuracyGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.PI * 80 * (statistics.voteAccuracy / 100)} ${Math.PI * 80}`}
                        className="transition-all duration-500"
                        style={{
                          strokeDashoffset: 0,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col mt-12">
                      <span className="text-2xl md:text-[46px] font-bold text-[#3D83FF]">
                        {statistics.voteAccuracy}%
                      </span>
                      <p className="text-[12px] md:text-sm text-[#475467] mt-1">Vote Accuracy</p>
                    </div>
                  </div>
                </div>

                {/* Votes */}
                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="text-2xl md:text-[36px] font-bold text-[#2B425B] mb-1">
                    {statistics.totalVotes.toLocaleString()}
                  </span>
                  <p className="text-[16px] text-[#475467] text-center">Votes</p>
                </div>

                {/* Comments */}
                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="text-2xl md:text-[36px] font-bold text-[#2B425B] mb-1">
                    {statistics.totalComments.toLocaleString()}
                  </span>
                  <p className="text-[16px] text-[#475467] text-center">Comments</p>
                </div>

                {/* Available Points */}
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl md:text-[36px] font-bold text-[#2B425B]">
                      {statistics.totalPoints.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[16px] text-[#475467] text-center">Available Points</p>
                </div>
                <button 
                  onClick={() => setActiveTab("REWARD")}
                  className="gradient-button text-white text-[13px] leading-[13px] font-bold px-[24px] py-[12px] rounded-full hover:opacity-90 transition-opacity"
                >
                  Redeem
                </button>
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

              {activeTab === "REWARD" && (
                <div className="flex flex-col gap-6">
                  {/* ACC Token Overview */}
                  <div className="px-6">
                    <div className="flex items-center">
                      <div className="flex items-center gap-4">
                        <img src="/images/V2.png" className="w-[84px] h-[84px]" />
                        <div>
                          <h3 className="text-[24px] leading-[24px] font-bold text-[#2B425B]">ACC</h3>
                          <p className="text-[12px] text-[#515151] mt-[12px]">Held Accountable Coin</p>
                        </div>
                        <img src="/images/sep.png" />
                        <div>
                          <div className="text-[36px] leading-[24px] font-bold text-[#3D83FF]">{accBalance}</div>
                          <p className="text-[12px] text-[#98A2B3] mt-[12px]">Your ACC</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Point Conversion Section */}
                  <div className="px-6 flex flex-col items-start justify-start">
                    <h3 className="text-[13px] leading-[13px] font-bold text-[#2B425B] mb-4">Convert Point to our Token</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="convertAll"
                        checked={convertAll}
                        onChange={(e) => {
                          setConvertAll(e.target.checked);
                          if (e.target.checked) {
                            setPointsToConvert('');
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="convertAll" className="text-[12px] leading-[13px] text-[#475467] cursor-pointer">
                        Convert all my available points
                      </label>
                    </div>

                    {/* Conversion Preview */}
                    <div className="bg-[#F7F8FF80] rounded-[20px] p-4 mb-4 border border-[#E4E7EC] w-[400px]">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-1 items-center gap-3">
                          <span className="text-[13px] leading-[13px] font-semibold text-[#2B425B66] inline-flex items-center gap-2">
                            Pts 
                            <input
                              type="number"
                              placeholder="0"
                              value={pointsToConvert}
                              onChange={(e) => setPointsToConvert(e.target.value)}
                              className="bg-transparent text-[#2B425B] outline-none h-[24px]"
                              min="100"
                              max={statistics.totalPoints}
                            />
                          </span>
                        </div>
                        <Icon icon="mdi:arrow-right" className="text-[#3D83FF] text-2xl" />
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-[13px] font-semibold text-[#2B425B66] inline-flex items-center gap-2 w-[100px]">
                            ACC <span className="text-[#2B425B]">{convertAll ? Math.floor(statistics.totalPoints / 100) : Math.floor((parseInt(pointsToConvert) || 0) / 100)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[12px] text-[#2B425B] px-[16px] py-[8px] bg-[#3D83FF33] rounded-full mb-6">Conversion Rate: 100pts = 1 ACC</p>

                    <button
                      onClick={handleConvertPoints}
                      disabled={convertingPoints || (!convertAll && (!pointsToConvert || parseInt(pointsToConvert) < 100)) || statistics.totalPoints < 100}
                      className="gradient-button text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {convertingPoints ? 'Converting...' : 'Confirm'}
                    </button>
                  </div>

                  {/* Point History */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E4E7EC]">
                    <h3 className="text-xl font-bold text-[#2B425B] mb-4">Point History</h3>
                    <div className="flex flex-col gap-3">
                      {pointHistory.length === 0 ? (
                        <p className="text-center text-[#98A2B3] py-8">No point history yet</p>
                      ) : (
                        pointHistory.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E4E7EC]">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#2B425B]">{entry.description || 'Point transaction'}</p>
                              <p className="text-xs text-[#98A2B3] mt-1">
                                {new Date(entry.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className={`text-lg font-bold ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.points > 0 ? '+' : ''}{entry.points} {entry.type === 'acc_reward' ? 'ACC' : 'Pts'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "NOTIFICATIONS" && (
                <div className="flex flex-col gap-6">
                  {/* Header with Mark All As Read */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#2B425B]">
                      {notifications.length} Notification{notifications.length !== 1 ? 's' : ''}
                    </h2>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-semibold text-[#3D83FF] hover:text-[#2B5FCC] transition-colors uppercase"
                      >
                        Mark All As Read
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 border-b border-[#E4E7EC] overflow-x-auto pb-2">
                    {[
                      { key: 'all', label: 'ALL' },
                      { key: 'vote_ended', label: 'VOTE ENDED' },
                      { key: 'reward', label: 'REWARDS' },
                      { key: 'comment_reply', label: 'REPLIES' },
                      { key: 'system', label: 'SYSTEM' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setNotificationFilter(tab.key);
                          if (auth.currentUser) {
                            loadNotifications(auth.currentUser.uid, tab.key);
                          }
                        }}
                        className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 ${
                          notificationFilter === tab.key
                            ? "text-blue-700 border border-dashed border-[#2B425B40] rounded-full"
                            : "text-[#2b425b] hover:text-[#101828]"
                        }`}
                      >
                        {tab.label}
                        {notificationFilter === tab.key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Notifications List */}
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-[#2B425B]">Loading notifications...</div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Icon icon="solar:bell-off-linear" width={64} height={64} className="text-[#98A2B3] mb-4" />
                      <p className="text-[#98A2B3] text-lg">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                            notification.is_read === 0
                              ? 'bg-white border border-[#E4E7EC]'
                              : 'bg-[#F9FAFB] border border-transparent'
                          }`}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F7F8FF] flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-[#2B425B] mb-1">
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-[#475467] leading-relaxed">
                                  {notification.content}
                                </p>
                                {notification.points && (
                                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-full">
                                    <Icon icon="solar:star-linear" width={16} height={16} className="text-[#34C759]" />
                                    <span className="text-xs font-semibold text-[#2E7D32]">
                                      +{notification.points} point{notification.points > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                                <p className="text-xs text-[#98A2B3] mt-2">
                                  {formatTimeAgo(notification.created_at)}
                                </p>
                              </div>

                              {/* Unread Indicator */}
                              {notification.is_read === 0 && (
                                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-[#EF4444]"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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