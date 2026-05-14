import { useForm } from "react-hook-form";
import BASE_URL from "./config/baseAPI.js";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  // Added 'watch' to monitor the selected role for UI highlighting
  const { register, handleSubmit, watch } = useForm();
  const { onChange: hookFormOnChange, ...profileImageRegister } = register("profileImageUrl");
  
  const watchRole = watch("role"); // Watch the value of the radio buttons

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    if (!newUser.role) {
      setError("Please select an account type (User or Author)");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    let { role, profileImageUrl, ...userObj } = newUser;

    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });

    if (profileImageUrl && profileImageUrl.length > 0) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }

    try {
      let resObj;
      if (role === "user") {
        resObj = await axios.post(`${BASE_URL}/user-api/users`, formData);
      } else if (role === "author") {
        resObj = await axios.post(`${BASE_URL}/author-api/users`, formData);
      }

      if (resObj && resObj.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join our community and start sharing your thoughts.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-6">
          
          {/* Custom Role Selection (Card Style) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I want to register as a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* User Role Card */}
              <label 
                className={`relative flex cursor-pointer rounded-xl border-2 p-4 focus:outline-none transition-all duration-200 ${
                  watchRole === "user" 
                    ? "bg-indigo-50 border-indigo-600" 
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="sr-only"
                />
                <span className="flex flex-col text-center w-full">
                  <span className={`block text-sm font-bold ${watchRole === "user" ? "text-indigo-900" : "text-gray-900"}`}>
                    Reader
                  </span>
                  <span className={`block text-xs mt-1 ${watchRole === "user" ? "text-indigo-700" : "text-gray-500"}`}>
                    I want to read & comment
                  </span>
                </span>
              </label>

              {/* Author Role Card */}
              <label 
                className={`relative flex cursor-pointer rounded-xl border-2 p-4 focus:outline-none transition-all duration-200 ${
                  watchRole === "author" 
                    ? "bg-purple-50 border-purple-600" 
                    : "border-gray-200 hover:border-purple-200"
                }`}
              >
                <input
                  type="radio"
                  {...register("role")}
                  value="author"
                  className="sr-only"
                />
                <span className="flex flex-col text-center w-full">
                  <span className={`block text-sm font-bold ${watchRole === "author" ? "text-purple-900" : "text-gray-900"}`}>
                    Author
                  </span>
                  <span className={`block text-xs mt-1 ${watchRole === "author" ? "text-purple-700" : "text-gray-500"}`}>
                    I want to write articles
                  </span>
                </span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
              <input 
                type="text" 
                {...register("firstName")} 
                placeholder="John" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm text-gray-800" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
              <input 
                type="text" 
                {...register("lastName")} 
                placeholder="Doe" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm text-gray-800" 
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              {...register("email")} 
              placeholder="you@example.com" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm text-gray-800" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              {...register("password")} 
              placeholder="Min. 8 characters" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm text-gray-800" 
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Picture</label>
            <div className="mt-1 flex items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-full border-2 border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
              
              <div className="flex-1">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 transition-colors inline-block">
                  <span>Choose Image</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/png, image/jpeg"
                    {...profileImageRegister}
                    onChange={(e) => {
                      hookFormOnChange(e);
                      const file = e.target.files[0];
                      if (file) {
                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          setError("Only JPG or PNG allowed");
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          setError("File size must be less than 2MB");
                          return;
                        }
                        const previewUrl = URL.createObjectURL(file);
                        setPreview(previewUrl);
                        setError(null);
                      }
                    }}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">JPG or PNG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in here
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;