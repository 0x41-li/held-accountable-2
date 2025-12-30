'use client';
import { useEffect, useState } from 'react';
import { auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'vote_ended', 'reward', 'system'
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
        return;
      }
      await loadNotifications(currentUser.uid);
    });

    return () => unsubscribe();
  }, [router, filter]);

  const loadNotifications = async (userId) => {
    try {
      setLoading(true);
      let url = `/api/notifications?user_id=${userId}`;
      if (filter !== 'all') {
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
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: currentUser.uid }),
      });

      if (response.ok) {
        // Reload notifications
        await loadNotifications(currentUser.uid);
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
        // Update local state
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: 1 } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
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

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (notification.is_read === 0) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to poll if poll_id exists
    if (notification.poll_id) {
      router.push(`/app/polls/${notification.poll_id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-[#2B425B]">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b border-[#E4E7EC]">
        <div className="flex items-start flex-1 justify-between gap-4">
          <div className="flex items-end gap-3 mt-4 flex-col md:flex-row">
            <div className="flex gap-[16px] items-center">
              <h1 className="text-3xl font-bold text-[#2b425b]">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-[#3D83FF] text-white text-sm font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              className="hidden md:block text-[#3D83FF] text-sm font-semibold hover:text-[#2B5FCC] transition-colors uppercase"
              onClick={handleMarkAllAsRead}
            >
              Mark All As Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-[#E4E7EC] overflow-x-auto">
        {[
          { key: 'all', label: 'ALL' },
          { key: 'vote_ended', label: 'VOTE ENDED' },
          { key: 'reward', label: 'REWARDS' },
          { key: 'comment_reply', label: 'REPLIES' },
          { key: 'system', label: 'SYSTEM' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              filter === tab.key
                ? "text-blue-700 md:border border-dashed border-[#2B425B40] rounded-full px-4 py-2"
                : "text-[#2b425b] hover:text-[#101828]"
            }`}
          >
            {tab.label}
            {filter === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <Icon icon="solar:bell-off-linear" width={64} height={64} className="text-[#98A2B3] mb-4" />
            <p className="text-[#98A2B3] text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
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

      {/* Footer - Show All Button */}
      {notifications.length > 0 && (
        <div className="p-6 border-t border-[#E4E7EC]">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/app/home"
              className="block w-full gradient-button text-white font-bold py-4 rounded-full text-center hover:opacity-90 transition-opacity"
            >
              Show All Notification
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Mark All As Read Button */}
      {unreadCount > 0 && (
        <div className="md:hidden fixed bottom-20 right-6 z-10">
          <button
            className="bg-[#3D83FF] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-[#2B5FCC] transition-colors"
            onClick={handleMarkAllAsRead}
          >
            Mark All Read
          </button>
        </div>
      )}
    </div>
  );
}

