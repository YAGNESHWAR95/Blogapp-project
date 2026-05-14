// import react stuff
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from './config/baseAPI'
// import styles
import {
  pageWrapper,
  pageTitleClass,
  bodyText,
  articleGrid,
  articleCardClass,
  articleTitle,
  timestampClass,
  ghostBtn,
  loadingClass,
  errorClass,
  primaryBtn,
} from '../styles/common'

// home component
function Home() {
  // state for articles
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/common-api/articles`)
        setArticles(res.data.payload || [])   //  FIX
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  // format date
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  // handle click
  const handleArticleClick = (article) => {
    navigate(`/article/${article._id}`, { state: article })
  }

  // return the home page
  return (
    <div className="bg-white min-h-screen">
      {/* hero section */}
      <div className="bg-[#f5f5f7] py-20 px-6 border-b border-[#e8e8ed]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className={`${pageTitleClass} text-6xl mb-4`}>Welcome to MyBlog</h1>
          <p className={`${bodyText} text-lg max-w-2xl mx-auto mb-8`}>
            Discover insightful stories, expert insights, and inspiring ideas from writers around the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/register')} className={primaryBtn}>
              Get Started
            </button>
            <button
              onClick={() => navigate('/#articles')}
              className="border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2.5 rounded-full hover:bg-[#f5f5f7] hover:border-[#0066cc] transition-all cursor-pointer text-sm"
            >
              Explore Articles
            </button>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className={pageWrapper} id="articles">
        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8">Latest Articles</h2>

        {error && <p className={errorClass}>{error}</p>}

        {loading ? (
          <p className={loadingClass}>Loading articles...</p>
        ) : articles?.length === 0 ? (
          <p className="text-center text-[#a1a1a6] py-16">
            No articles available yet
          </p>
        ) : (
          <div className={articleGrid}>
            {articles?.map((article) => (
              <div className={articleCardClass} key={article._id}>
                <div className="flex flex-col h-full">
                  <div>
                    <p className={articleTitle}>{article.title}</p>
                    <p className={`${bodyText} text-sm mt-2`}>
                      {article.content?.slice(0, 60)}...
                    </p>
                    <p className={timestampClass}>
                      {formatDateIST(article.createdAt)}
                    </p>
                  </div>

                  <button
                    className={`${ghostBtn} mt-auto pt-4`}
                    onClick={() => handleArticleClick(article)}
                  >
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home