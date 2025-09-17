import axios from './axios'

export class NotificationService {
  static async getNotifications(userId) {
    try {
      const response = await axios.get(`/notifications?userId=${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  static async markAsRead(notificationId) {
    try {
      const response = await axios.patch(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  static async markAllAsRead(userId) {
    try {
      const response = await axios.patch(`/notifications/mark-all-read?userId=${userId}`)
      return response.data
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  static async getUnreadCount(userId) {
    try {
      const response = await axios.get(`/notifications/unread-count?userId=${userId}`)
      return response.data.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  }

  // Real-time notification handling
  static setupWebSocket(userId, onNotification) {
    // This would typically connect to a WebSocket server
    // For now, we'll use polling as a fallback
    const pollInterval = setInterval(async () => {
      try {
        const count = await this.getUnreadCount(userId)
        if (count > 0) {
          onNotification({ type: 'new_notification', count })
        }
      } catch (error) {
        console.error('Error polling notifications:', error)
      }
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(pollInterval)
  }
}

// Notification types and their configurations
export const NOTIFICATION_TYPES = {
  FINANCING_APPROVED: {
    title: 'Financing Request Approved',
    message: 'Your financing request has been approved',
    icon: '✅',
    color: 'green',
    priority: 'high'
  },
  FINANCING_REJECTED: {
    title: 'Financing Request Rejected',
    message: 'Your financing request has been rejected',
    icon: '❌',
    color: 'red',
    priority: 'high'
  },
  DISBURSEMENT_MADE: {
    title: 'Disbursement Made',
    message: 'Funds have been disbursed to your account',
    icon: '💰',
    color: 'green',
    priority: 'high'
  },
  REPAYMENT_RECEIVED: {
    title: 'Repayment Received',
    message: 'A repayment has been received',
    icon: '💳',
    color: 'blue',
    priority: 'medium'
  },
  CLAIM_FLAGGED: {
    title: 'Claim Flagged',
    message: 'One of your claims has been flagged for review',
    icon: '⚠️',
    color: 'yellow',
    priority: 'high'
  },
  INVOICE_PROCESSED: {
    title: 'Invoice Processed',
    message: 'Your invoice has been processed successfully',
    icon: '📄',
    color: 'blue',
    priority: 'medium'
  },
  TEAM_MEMBER_ADDED: {
    title: 'Team Member Added',
    message: 'A new team member has been added to your account',
    icon: '👥',
    color: 'blue',
    priority: 'low'
  },
  SYSTEM_UPDATE: {
    title: 'System Update',
    message: 'System maintenance scheduled',
    icon: '🔧',
    color: 'gray',
    priority: 'low'
  }
}

export default NotificationService
