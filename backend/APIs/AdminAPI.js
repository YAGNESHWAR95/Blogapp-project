import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const adminRoute = exp.Router()

// Get all articles (including inactive ones) - Admin only
adminRoute.get('/articles', verifyToken('ADMIN'), async (req, res) => {
  try {
    const articles = await ArticleModel.find({})
      .populate('author', 'firstName lastName email isActive')
      .populate('comments.user', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'All articles retrieved successfully',
      payload: articles
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving articles', error: error.message })
  }
})

// Get all users - Admin only
adminRoute.get('/users', verifyToken('ADMIN'), async (req, res) => {
  try {
    const users = await UserTypeModel.find({})
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'All users retrieved successfully',
      payload: users
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message })
  }
})

// Block user - Admin only
adminRoute.put('/users/block/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { userId } = req.params

    // Prevent admin from blocking themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot block yourself' })
    }

    const user = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      message: 'User blocked successfully',
      payload: user
    })
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error: error.message })
  }
})

// Unblock user - Admin only
adminRoute.put('/users/unblock/:userId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { userId } = req.params

    const user = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      message: 'User unblocked successfully',
      payload: user
    })
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking user', error: error.message })
  }
})

// Activate article - Admin only
adminRoute.put('/articles/activate/:articleId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { articleId } = req.params

    const article = await ArticleModel.findByIdAndUpdate(
      articleId,
      { isArticleActive: true },
      { new: true }
    ).populate('author', 'firstName lastName email')
     .populate('comments.user', 'firstName lastName email')

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.status(200).json({
      message: 'Article activated successfully',
      payload: article
    })
  } catch (error) {
    res.status(500).json({ message: 'Error activating article', error: error.message })
  }
})

// Deactivate article - Admin only
adminRoute.put('/articles/deactivate/:articleId', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { articleId } = req.params

    const article = await ArticleModel.findByIdAndUpdate(
      articleId,
      { isArticleActive: false },
      { new: true }
    ).populate('author', 'firstName lastName email')
     .populate('comments.user', 'firstName lastName email')

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.status(200).json({
      message: 'Article deactivated successfully',
      payload: article
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating article', error: error.message })
  }
})

// Get dashboard statistics - Admin only
adminRoute.get('/dashboard/stats', verifyToken('ADMIN'), async (req, res) => {
  try {
    const totalUsers = await UserTypeModel.countDocuments()
    const activeUsers = await UserTypeModel.countDocuments({ isActive: true })
    const blockedUsers = await UserTypeModel.countDocuments({ isActive: false })

    const totalArticles = await ArticleModel.countDocuments()
    const activeArticles = await ArticleModel.countDocuments({ isArticleActive: true })
    const inactiveArticles = await ArticleModel.countDocuments({ isArticleActive: false })

    const authors = await UserTypeModel.countDocuments({ role: 'AUTHOR' })
    const regularUsers = await UserTypeModel.countDocuments({ role: 'USER' })
    const admins = await UserTypeModel.countDocuments({ role: 'ADMIN' })

    res.status(200).json({
      message: 'Dashboard statistics retrieved successfully',
      payload: {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers,
          breakdown: {
            authors,
            regularUsers,
            admins
          }
        },
        articles: {
          total: totalArticles,
          active: activeArticles,
          inactive: inactiveArticles
        }
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard statistics', error: error.message })
  }
})