import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"

interface Option {
  value: number | string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
}

export default function SearchableSelect({ options, value, onChange, placeholder = "Pilih data..." }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${selectedOption ? "text-gray-900" : "text-gray-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-2 border-b border-gray-100 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400 ml-1" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                    setSearchTerm("")
                  }}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 text-center">Data tidak ditemukan</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}