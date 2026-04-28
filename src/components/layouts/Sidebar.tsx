"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, ArrowLeft } from "lucide-react"

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname()

  return (
    <>
      <aside className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 transition-transform duration-300 transform fixed lg:relative z-40 h-screen overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">App Name</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-wider my-3 text-gray-500">Main</p>
              <Link href="/" className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${pathname === '/' ? 'text-white bg-gray-900' : 'hover:bg-gray-50'}`}>
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
              <Link href="/poli" className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname === '/poli' ? 'text-white bg-gray-900' : 'hover:bg-gray-50'}`}>
                <Users className="w-4 h-4 mr-3" />
                Data Poli
              </Link>
            </div>
          </nav>
        </div>
      </aside>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  )
}