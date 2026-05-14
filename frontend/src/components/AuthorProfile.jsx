// import router and auth
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";
// import styles
import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

// author profile component
function AuthorProfile() {
  // get user
  const user = useAuth((state) => state.currentUser);

  // return profile
  return (
    <div className={pageWrapper}>
       <div className="flex flex-col items-center text-center mb-8 p-6 bg-[#f5f5f7] rounded-xl border border-[#e8e8ed]">
        <img 
          src={user?.profileImageUrl} 
          alt="Profile" 
          className="h-32 w-32 rounded-full object-cover border-4 border-[#0066cc] shadow-sm mb-4" 
        />
        <p className="text-3xl font-bold text-[#1d1d1f] mb-2">Welcome, {user.firstName}!</p>
        <p className="text-[#6e6e73]">Author Dashboard</p>
      </div>
      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>

      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;