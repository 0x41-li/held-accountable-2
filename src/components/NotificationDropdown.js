'use client';
import { useEffect, useState, useRef } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        await loadNotifications(currentUser.uid);
      } else {
        setUserId(null);
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown/modal when clicking outside (desktop only) or on escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      if (!isMobile) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open on mobile
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        if (!isMobile) {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isMobile]);

  const loadNotifications = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?user_id=${uid}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'vote_ended':
        return <Icon icon="solar:clock-circle-linear" width={20} height={20} className="text-[#2B425B]" />;
      case 'reward':
        return <Icon icon="solar:gift-linear" width={20} height={20} className="text-[#34C759]" />;
      case 'comment_reply':
        return <Icon icon="solar:chat-round-call-linear" width={20} height={20} className="text-[#3D83FF]" />;
      case 'system':
        return <Icon icon="solar:settings-linear" width={20} height={20} className="text-[#3D83FF]" />;
      default:
        return <Icon icon="solar:bell-linear" width={20} height={20} className="text-[#2B425B]" />;
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      await loadNotifications(userId);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    setIsOpen(false);
    
    // Mark as read if unread
    if (notification.is_read === 0) {
      try {
        await fetch(`/api/notifications/${notification.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true }),
        });
        // Reload notifications
        if (userId) await loadNotifications(userId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to poll if poll_id exists
    if (notification.poll_id) {
      router.push(`/app/polls/${notification.poll_id}`);
    }
  };

  if (!userId) {
    return null;
  }

  const notificationContent = (
    <div 
      className={`${isMobile ? 'fixed inset-0 z-50 flex flex-col' : 'absolute right-0 mt-2 w-[450px] card-item z-50'} backdrop-blur-md flex flex-col`} 
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h3 className="text-[30px] font-semibold text-[#2B425B]">Notifications</h3>
        <div className="flex items-center gap-3">
          {isMobile && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold text-[#3D83FF] hover:text-[#2B5FCC] transition-colors"
            >
              MARK ALL AS READ
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#98A2B3] hover:text-[#2B425B] transition-colors"
          >
            <Icon icon="mdi:close" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className={`flex-1 ${isMobile ? 'px-4 py-2' : 'p-4'}`}>
        {loading ? (
          <div className="p-8 text-center text-[#98A2B3]">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[#98A2B3]">
            <Icon icon="solar:bell-off-linear" width={48} height={48} className="mx-auto mb-2 text-[#98A2B3]" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 cursor-pointer rounded-xl hover:shadow-md transition-all relative ${
                  notification.is_read === 0 ? 'bg-[#F7F8FF80]' : 'bg-[#C3C7E380]'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F7F8FF] flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#2B425B] mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-[#475467] line-clamp-2 mb-2">
                      {notification.content}
                    </p>
                    {notification.points && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F5E9] rounded-full mb-2">
                        <Icon icon="solar:star-linear" width={12} height={12} className="text-[#34C759]" />
                        <span className="text-xs font-semibold text-[#2E7D32]">
                          +{notification.points} point{notification.points > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-[#98A2B3]">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  {notification.is_read === 0 && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#EF4444]"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 ${isMobile ? 'sticky bottom-0' : ''}`}>
        <Link
          href="/app/profile?tab=NOTIFICATIONS"
          onClick={() => setIsOpen(false)}
          className="block w-full gradient-button text-white font-bold py-3 rounded-full text-center hover:opacity-90 transition-opacity text-sm"
        >
          Show All Notification
        </Link>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#2B425B] hover:text-[#3D83FF] transition-colors"
      >
        <Icon icon="solar:bell-linear" width={24} height={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-[#EF4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {isMobile ? (
            // Mobile: Full screen modal with overlay
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              {notificationContent}
            </>
          ) : (
            // Desktop: Dropdown
            notificationContent
          )}
        </>
      )}
    </div>
  );
}
