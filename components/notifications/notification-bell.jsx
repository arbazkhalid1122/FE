"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import NotificationService, { NOTIFICATION_TYPES } from "@/lib/notification-service"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"

export default function NotificationBell() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
      fetchUnreadCount()
      
      // Set up real-time notifications
      const cleanup = NotificationService.setupWebSocket(session.user.id, handleNewNotification)
      return cleanup
    }
  }, [session?.user?.id])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    if (!session?.user?.id) return
    
    try {
      setLoading(true)
      const data = await NotificationService.getNotifications(session.user.id)
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    if (!session?.user?.id) return
    
    try {
      const count = await NotificationService.getUnreadCount(session.user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleNewNotification = (notification) => {
    if (notification.type === 'new_notification') {
      setUnreadCount(notification.count)
      fetchNotifications() // Refresh the list
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!session?.user?.id) return
    
    try {
      await NotificationService.markAllAsRead(session.user.id)
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationConfig = (type) => {
    return NOTIFICATION_TYPES[type] || {
      title: 'Notification',
      message: 'You have a new notification',
      icon: '🔔',
      color: 'blue',
      priority: 'medium'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-blue-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-[#ffcb37] bg-white h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="fill-[#ffcb37] stroke-[#ffcb37]" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 z-50 shadow-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="max-h-80">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const config = getNotificationConfig(notification.type)
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 ${getPriorityColor(config.priority)} ${
                          !notification.isRead ? 'bg-blue-50' : 'bg-white'
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{config.icon}</span>
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title || config.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message || config.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-6 w-6"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
