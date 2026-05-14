// import react and navlink
import React from 'react'
import { NavLink } from 'react-router-dom'

// footer component
function Footer() {
  // get current year
  const currentYear = new Date().getFullYear()

  // return footer
  return (
    <footer className="bg-[#1d1d1f] text-[#f5f5f7] border-t border-[#424245]">
      {/* footer content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">MyBlog</h3>
            <p className="text-sm text-[#a1a1a6] leading-relaxed">
              A platform for sharing stories, insights, and ideas with the world.
            </p>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Writing Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Best Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest text-white">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a1a1a6] hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#424245] pt-8">
          <p className="text-center text-sm text-[#a1a1a6]">
            © {currentYear} MyBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer