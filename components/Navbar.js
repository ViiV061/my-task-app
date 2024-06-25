"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-300 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-primary hover:font-bold hover:scale-105 text-xl font-bold"
        >
          Task Management App
        </Link>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-primary-dark focus:outline-none"
          >
            {isOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
        <ul
          className={`lg:flex space-x-4 lg:space-x-4 ${
            isOpen ? "block" : "hidden"
          } lg:block`}
        >
          <li>
            <Link
              href="/"
              className="text-gray-600 hover:text-primary-dark hover:font-bold hover:scale-105 block lg:inline-block py-2 lg:py-0"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/boards"
              className="text-gray-600 hover:text-primary-dark hover:font-bold hover:scale-105 block lg:inline-block py-2 lg:py-0"
            >
              Boards
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary-dark hover:font-bold hover:scale-105 block lg:inline-block py-2 lg:py-0"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up"
              className="text-gray-600 hover:text-primary-dark hover:font-bold hover:scale-105 hover:bg-blue-100 hover:rounded-md hover:border-spacing-1 block lg:inline-block py-2 lg:py-0"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
