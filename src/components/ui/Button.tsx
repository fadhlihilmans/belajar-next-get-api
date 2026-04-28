import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger"
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseClass = "px-4 py-2 text-sm font-medium rounded-lg inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
  }
  return (
    <button className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}