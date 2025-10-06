"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`h-full bg-gray-900 text-white transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-2xl font-bold mb-8">Menu</h2>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/parts"
                  className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Parts
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
