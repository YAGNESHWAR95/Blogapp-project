// import react and stuff
import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import BASE_URL from './config/baseAPI.js'

import axios from 'axios'
// import styles
import {
  pageBackground,
  pageWrapper,
  cardClass,
  headingClass,
  subHeadingClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
  errorClass,
  loadingClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
  timestampClass
} from '../styles/common.js'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  // Logout function
  const onLogout = async () => {
    await logout()
    toast.success('Logout successful')
    navigate('/login')
  }

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-api/dashboard/stats`, { withCredentials: true })
      setStats(res.data.payload)
    } catch (err) {
      console.error('Error fetching stats:', err)
      toast.error('Failed to load dashboard statistics')
    }
  }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-api/users`, { withCredentials: true })
      setUsers(res.data.payload)
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error('Failed to load users')
    }
  }

  // Fetch all articles
  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-api/articles`, { withCredentials: true })
      setArticles(res.data.payload)
    } catch (err) {
      console.error('Error fetching articles:', err)
      toast.error('Failed to load articles')
    }
  }

  // Block user
  const blockUser = async (userId) => {
    try {
      await axios.put(`${BASE_URL}/admin-api/users/block/${userId}`, {}, { withCredentials: true })
      toast.success('User blocked successfully')
      fetchUsers() // Refresh users list
      fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error blocking user:', err)
      toast.error('Failed to block user')
    }
  }

  // Unblock user
  const unblockUser = async (userId) => {
    try {
      await axios.put(`${BASE_URL}/admin-api/users/unblock/${userId}`, {}, { withCredentials: true })
      toast.success('User unblocked successfully')
      fetchUsers() // Refresh users list
      fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error unblocking user:', err)
      toast.error('Failed to unblock user')
    }
  }

  // Activate article
  const activateArticle = async (articleId) => {
    try {
      await axios.put(`${BASE_URL}/admin-api/articles/activate/${articleId}`, {}, { withCredentials: true })
      toast.success('Article activated successfully')
      fetchArticles() // Refresh articles list
      fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error activating article:', err)
      toast.error('Failed to activate article')
    }
  }

  // Deactivate article
  const deactivateArticle = async (articleId) => {
    try {
      await axios.put(`${BASE_URL}/admin-api/articles/deactivate/${articleId}`, {}, { withCredentials: true })
      toast.success('Article deactivated successfully')
      fetchArticles() // Refresh articles list
      fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error deactivating article:', err)
      toast.error('Failed to deactivate article')
    }
  }

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (activeTab === 'dashboard') {
          await fetchStats()
        } else if (activeTab === 'users') {
          await fetchUsers()
        } else if (activeTab === 'articles') {
          await fetchArticles()
        }
      } catch {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeTab])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'articles', label: 'Articles', icon: '📝' }
  ]

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={headingClass}>Admin Dashboard</h1>
            <p className={bodyText}>Welcome back, {currentUser?.firstName}!</p>
          </div>
          <button className={primaryBtn} onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0066cc] text-white'
                  : 'text-gray-600 hover:text-[#0066cc] hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className={loadingClass}>Loading...</div>
        ) : error ? (
          <div className={errorClass}>{error}</div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Stats */}
                <div className={cardClass}>
                  <h3 className={subHeadingClass}>Users</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className={bodyText}>Total:</span>
                      <span className="font-semibold">{stats.users.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Active:</span>
                      <span className="font-semibold text-green-600">{stats.users.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Blocked:</span>
                      <span className="font-semibold text-red-600">{stats.users.blocked}</span>
                    </div>
                  </div>
                </div>

                {/* User Roles Breakdown */}
                <div className={cardClass}>
                  <h3 className={subHeadingClass}>User Roles</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className={bodyText}>Authors:</span>
                      <span className="font-semibold">{stats.users.breakdown.authors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Users:</span>
                      <span className="font-semibold">{stats.users.breakdown.regularUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Admins:</span>
                      <span className="font-semibold">{stats.users.breakdown.admins}</span>
                    </div>
                  </div>
                </div>

                {/* Articles Stats */}
                <div className={cardClass}>
                  <h3 className={subHeadingClass}>Articles</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className={bodyText}>Total:</span>
                      <span className="font-semibold">{stats.articles.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Active:</span>
                      <span className="font-semibold text-green-600">{stats.articles.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={bodyText}>Inactive:</span>
                      <span className="font-semibold text-red-600">{stats.articles.inactive}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={cardClass}>
                  <h3 className={subHeadingClass}>Quick Actions</h3>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => setActiveTab('users')}
                      className={secondaryBtn}
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => setActiveTab('articles')}
                      className={secondaryBtn}
                    >
                      Manage Articles
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className={subHeadingClass + ' mb-6'}>User Management</h2>
                {users.length === 0 ? (
                  <div className={emptyStateClass}>No users found</div>
                ) : (
                  <div className="space-y-4">
                    {users.map(user => (
                      <div key={user._id} className={cardClass + ' flex justify-between items-center'}>
                        <div>
                          <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                          <p className={bodyText}>{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'AUTHOR' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Blocked'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.isActive ? (
                            <button
                              onClick={() => blockUser(user._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => unblockUser(user._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div>
                <h2 className={subHeadingClass + ' mb-6'}>Article Management</h2>
                {articles.length === 0 ? (
                  <div className={emptyStateClass}>No articles found</div>
                ) : (
                  <div className="space-y-4">
                    {articles.map(article => (
                      <div key={article._id} className={cardClass + ' relative'}>
                        <div className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
                          {article.isArticleActive ? 'Active' : 'Inactive'}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                        <p className={bodyText + ' mb-2'}>{article.content.substring(0, 200)}...</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className={bodyText}>By: {article.author?.firstName} {article.author?.lastName}</span>
                            <span className={bodyText}>Category: {article.category}</span>
                            <span className={timestampClass}>
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {article.isArticleActive ? (
                              <button
                                onClick={() => deactivateArticle(article._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => activateArticle(article._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard