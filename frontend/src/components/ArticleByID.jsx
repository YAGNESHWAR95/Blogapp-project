import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import BASE_URL from "./config/baseAPI.js";

import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common.js";

import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch article if not passed via state
  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/user-api/article/${id}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Delete / Restore
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    if (!window.confirm(newStatus ? "Restore this article?" : "Delete this article?")) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  // Edit
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  // Add Comment
  const addComment = async (commentObj) => {
    commentObj.articleId = article._id;

    try {
      const res = await axios.put(
        `${BASE_URL}/user-api/articles`,
        commentObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setArticle(res.data.payload);
        reset(); // clear input
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  // Safe comments
  const visibleComments =
    article?.comments?.filter(
      (c) =>
        c.user &&
        typeof c.user !== "string" &&
        (c.user.firstName || c.user.email)
    ) || [];

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>
          {article.title}
        </h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            ✍️ {article.author?.firstName || "Author"}
          </div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {/* USER Comment Form */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)} className="w-full mt-6">
            <div className="bg-[#f5f5f7] rounded-2xl p-6">
              <p className="text-sm font-semibold mb-3">
                Share your thoughts
              </p>

              <input
                type="text"
                {...register("comment", { required: true })}
                className={inputClass}
                placeholder="Write your comment here..."
              />

              <button
                type="submit"
                className="bg-[#0066cc] text-white px-6 py-2.5 rounded-full mt-4 hover:bg-[#004499]"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COMMENTS (VISIBLE TO ALL) */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">
          Comments ({visibleComments.length})
        </h3>

        {visibleComments.length === 0 ? (
          <p className="text-gray-400">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {visibleComments.map((comment) => (
              <div
                key={comment._id}
                className="bg-[#f5f5f7] p-6 rounded-2xl border hover:bg-[#ebebf0]"
              >
                <p className="text-sm font-semibold text-[#0066cc] mb-2">
                  {comment.user.firstName || comment.user.email}
                </p>

                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={articleFooter}>
        Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;