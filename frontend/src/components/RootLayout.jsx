// import stuff
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../store/authStore";

// root layout component
function RootLayout() {
  // get auth stuff
  const checkAuth = useAuth((state) => state.checkAuth);
  const loading=useAuth(state=>state.loading);
  
  // check auth on load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // show loading if loading
  if(loading)
  {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e8e8ed] border-t-[#0066cc] rounded-full animate-spin"></div>
          <p className="text-lg text-[#6e6e73] font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  
  // return the layout
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 min-h-screen mx-4 sm:mx-6 lg:mx-auto lg:max-w-5xl lg:w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;