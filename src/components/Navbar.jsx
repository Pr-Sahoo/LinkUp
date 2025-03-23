import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {        // remove the toggleChat from this props now recently toogleSidebar
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // if(location.pathname.startsWith("/private-chat/")) {
  //   return null;
  // }
  // if(["/private-chat", "/", "/register", "/login","/choice"].includes(location.pathname)) {
  //   return null;
  // }
  if(location.pathname.startsWith("/private-chat") || ["/", "/register", "/login", "/choice"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white shadow dark:bg-gray-800 fixed top-0 left-0 w-full z-50">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="flex items-center justify-between">
            <a href="/">
              <img
                className="w-auto h-6 sm:h-7"
                src="https://merakiui.com/images/full-logo.svg"
                alt="Logo"
              />
            </a>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                aria-label="toggle menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Navbar Links */}
          <div
            className={`absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:flex lg:items-center lg:justify-between ${
              isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0"
            }`}
          >
            <div className="flex flex-col text-gray-600 capitalize dark:text-gray-300 lg:flex-row lg:items-center">
              <a href="/register" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                SignUp
              </a>
              <a href="/forgot" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                Reset Password
              </a>
              <a href="/login" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                Login
              </a>
              <a href="#" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                Support
              </a>
              {/* <a href="/private-chat" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                Private-chat
              </a> */}
              <Link to="/private-chat" className="mt-2 lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">Private-chat</Link>

              {/* Search Box */}
              <div className="relative mt-4 lg:mt-0 lg:mx-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full py-1 pl-10 pr-4 text-gray-700 placeholder-gray-600 bg-white border-b border-gray-600 dark:placeholder-gray-300 focus:border-gray-600 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
