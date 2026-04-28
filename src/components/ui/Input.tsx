import { InputHTMLAttributes } from "react"

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 ${className}`} 
      {...props} 
    />
  )
}