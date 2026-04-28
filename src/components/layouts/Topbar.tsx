"use client"

import { useState } from "react"
import { Menu, User, LogOut, ChevronDown } from "lucide-react"

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 px-6 py-4 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-50">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=000&color=fff" alt="Profile" />
              </div>
              <span className="text-xs font-medium">Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>
             */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <hr className="my-1 border-gray-100" />
                <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}