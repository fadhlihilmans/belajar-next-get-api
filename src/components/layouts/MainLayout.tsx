"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex bg-gray-50 min-h-screen overflow-hidden text-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-0 relative overflow-hidden">
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="pt-[80px] px-6 pb-6 h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}