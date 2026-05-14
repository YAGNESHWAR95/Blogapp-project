// import router and auth
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
// import styles
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

// header component
function Header() {
  // get auth state
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  // logout function
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // get profile path based on role
  const getProfilePath = () => {
    if (!user || !user.role) return "/";

    console.log("current user", user);

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  // return the header nav
  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* logo */}
        <NavLink to="/" className={navBrandClass}>
          <span className="text-lg font-bold tracking-tight">MyBlog</span>
        </NavLink>

        <ul className={navLinksClass}>
          {/* Always visible */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
            >
              Home
            </NavLink>
          </li>

          {/* Not logged in */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* Logged in */}
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  <span className="flex items-center gap-1">
                    <span className="text-md">👤</span>
                    Profile
                  </span>
                </NavLink>
              </li>

              <li>
                <button
                  className={`${navLinkClass} hover:text-[#ff3b30] font-medium`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;