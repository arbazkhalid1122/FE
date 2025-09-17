'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Bell, Check, Trash2, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NotificationService, { NOTIFICATION_TYPES } from "@/lib/notification-service"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [session?.user?.id])

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

  const filteredNotifications = notifications.filter(notification => {
    const config = getNotificationConfig(notification.type)
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'unread' && !notification.isRead) ||
                         (statusFilter === 'read' && notification.isRead)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const unreadNotifications = filteredNotifications.filter(n => !n.isRead)
  const readNotifications = filteredNotifications.filter(n => n.isRead)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
        <p className="text-gray-600 text-sm">Stay updated with your account activity</p>
      </div>
<div className="max-w-4xl mx-auto">      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FINANCING_APPROVED">Financing Approved</SelectItem>
            <SelectItem value="FINANCING_REJECTED">Financing Rejected</SelectItem>
            <SelectItem value="DISBURSEMENT_MADE">Disbursement Made</SelectItem>
            <SelectItem value="REPAYMENT_RECEIVED">Repayment Received</SelectItem>
            <SelectItem value="CLAIM_FLAGGED">Claim Flagged</SelectItem>
            <SelectItem value="INVOICE_PROCESSED">Invoice Processed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            getNotificationConfig={getNotificationConfig}
            getPriorityColor={getPriorityColor}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <NotificationList 
            notifications={unreadNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            getNotificationConfig={getNotificationConfig}
            getPriorityColor={getPriorityColor}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <NotificationList 
            notifications={readNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            getNotificationConfig={getNotificationConfig}
            getPriorityColor={getPriorityColor}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
      </div>
      </div>
  )
}

function NotificationList({ notifications, onMarkAsRead, onDelete, getNotificationConfig, getPriorityColor, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p className="text-gray-500">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const config = getNotificationConfig(notification.type)
        return (
          <Card key={notification.id} className={`border-l-4 ${getPriorityColor(config.priority)} ${
            !notification.isRead ? 'bg-blue-50' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {notification.title || config.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {notification.message || config.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notification.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
