// import react and stuff
import React, { useEffect, useState } from 'react'
import {useAuth} from "../store/authStore"
import { useNavigate } from 'react-router-dom'
import {toast} from "react-hot-toast"
import axios from 'axios'
// import styles
import {articleCardClass,articleTitle,secondaryBtn,primaryBtn} from "../styles/common.js"
import BASE_URL from './config/baseAPI.js'

// user dashboard component
function UserDashboard() {
  // state for articles
  const [articles,setArticles]=useState([])
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(true)
  // logout function from auth store
  const logout=useAuth(state=>state.logout)
  const navigate=useNavigate()
  // goto article function
  const gotoArticle = (article) => {
    // Navigate to article details using the article ID and pass the article object in state
    navigate(`/article/${article._id}`, {
      state: article,
    });
  } 

  //perform logout and make is to navigate to login
  const onLogout=async()=>{
    //logout
    await logout();
     toast.success("Logout successfull")
    navigate("/login")
  }
 useEffect(()=>{
  setLoading(true)
  const getArticles=async()=>{
     try{
    let resObj=await axios.get(`${BASE_URL}/user-api/articles`,{withCredentials:true})
    setArticles(resObj.data.payload)
    }
    catch(err){
       setError(err.response?.data?.error)
    }
    finally{
      setLoading(false)
    }
  }
  getArticles();
 

 },[])


   

  if (loading) {
    return <p className="text-center py-10">Loading articles...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }

  return (
    <div>
      <button className={primaryBtn} onClick={onLogout}>
        Logout
      </button>
         
        
      <div>
        {articles?.map((article, index) => (
          <div key={index} className={articleCardClass}>
            <p className={articleTitle}>{article.title}</p>
            <p>{article.category}</p>
            <p>{article.content}</p>
            <button className={secondaryBtn} onClick={() => gotoArticle(article)}>
              Read More..
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard