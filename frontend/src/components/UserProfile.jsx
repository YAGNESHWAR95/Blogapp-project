// import auth and stuff
import { useAuth } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

// import styles
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
  formCard,
} from "../styles/common.js";
import BASE_URL from "./config/baseAPI.js";

// user profile component
function UserProfile() {
  // get logout
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
   const user = useAuth((state) => state.currentUser);
 

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/user-api/articles`, { withCredentials: true });

        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div>
      {error && <p className={errorClass}>{error}</p>}
       
      <div className="flex flex-col items-center text-center mb-8 p-6 bg-[#f5f5f7] rounded-xl border border-[#e8e8ed]">
        <img 
          src={user?.profileImageUrl} 
          alt="Profile" 
          className="h-32 w-32 rounded-full object-cover border-4 border-[#0066cc] shadow-sm mb-4" 
        />
        <p className="text-3xl font-bold text-[#1d1d1f] mb-2">Welcome, {user.firstName}!</p>
        <p className="text-[#6e6e73] mb-4">{user.email}</p>
        <button className="bg-[#ff3b30] text-white px-6 py-2.5 rounded-full hover:bg-[#cc2f26] transition-all font-medium text-sm shadow-sm hover:shadow-md" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className={articleGrid}>
        {articles.map((articleObj) => (
          <div className={articleCardClass} key={articleObj._id}>
            <div className="flex flex-col h-full">
              {/* Top Content */}
              <div>
                <p className={articleTitle}>{articleObj.title}</p>

                <p>{articleObj.content.slice(0, 20)}...</p>

                <p className={timestampClass}>{formatDateIST(articleObj.createdAt)}</p>
              </div>

              {/* Button at bottom */}
              <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticleByID(articleObj)}>
                Read Article →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;