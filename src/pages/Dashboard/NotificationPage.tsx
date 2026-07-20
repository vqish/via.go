import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './NotificationPage.css';

interface TravelNotification {
  id: string;
  title: string;
  message: string;
  category: 'Trip' | 'Packing' | 'Visa' | 'Weather' | 'Flight' | 'Currency';
  time: string;
  read: boolean;
}

const mockNotifications: TravelNotification[] = [
  { id: 'n1', title: 'Upcoming Trip Countdown', message: 'Your Japan Cherry Blossom Tour begins in 264 days! Start organizing your documents.', category: 'Trip', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Flight Delay Alert', message: 'Flight LH 430 to Chicago is delayed by 45 mins due to air traffic control.', category: 'Flight', time: '1 day ago', read: false },
  { id: 'n3', title: 'Visa Expiry Warning', message: 'Your eVisa application for India must be submitted at least 4 days in advance.', category: 'Visa', time: '2 days ago', read: true },
  { id: 'n4', title: 'Severe Weather Warning', message: 'Heavy rain warnings are currently active for Kyoto, Japan. Pack an umbrella.', category: 'Weather', time: '3 days ago', read: true }
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<TravelNotification[]>(mockNotifications);

  // Load notifications from local storage if present
  useEffect(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
    toast.success('Notification removed');
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-page container">
      <header className="notification-header">
        <div>
          <h1 className="font-display">Travel Notifications</h1>
          <p className="text-secondary text-sm">Receive smart notifications for flight delays, upcoming countdowns, visa advice, and weather alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-ghost text-xs flex items-center gap-2" onClick={handleMarkAllRead}>
            <Check size={16} /> Mark all read
          </button>
        )}
      </header>

      {/* Notifications list */}
      <div className="notifications-list-wrapper mt-6 flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className={`notification-item-card glass ${n.read ? 'read-state' : 'unread-state'}`}>
              <div className="notification-card-inner">
                <div className={`notification-icon-indicator ${n.category.toLowerCase()}`}>
                  <Bell size={16} />
                </div>
                
                <div className="notification-text-col">
                  <div className="notification-title-row">
                    <h4>{n.title}</h4>
                    <span className="time-badge text-secondary text-xs">{n.time}</span>
                  </div>
                  <p className="message-text text-secondary text-sm mt-1">{n.message}</p>
                  
                  <div className="notification-actions-row mt-3">
                    <button className="btn-text-action text-xs" onClick={() => handleToggleRead(n.id)}>
                      {n.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <span className="dot-divider" />
                    <button className="btn-text-action text-xs delete-action text-warm" onClick={() => handleDelete(n.id)}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notifications-state text-center glass">
            <Bell size={40} className="text-tertiary" />
            <h4>No notifications found</h4>
            <p className="text-secondary">We will alert you when flight statuses, weather warnings, or packing lists update.</p>
          </div>
        )}
      </div>
    </div>
  );
}
