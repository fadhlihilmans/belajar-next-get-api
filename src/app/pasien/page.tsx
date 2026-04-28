"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Loader2, AlertOctagon, X, Eye } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Modal from "@/components/ui/Modal"
import { Pasien } from "@/types/pasien"
import Link from "next/link"

export default function PasienPage() {
  const [data, setData] = useState<Pasien[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nama_pasien: "", nomor_rm: "", alamat: "" })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/pasien")
      const json = await res.json()
      if (json.success) setData(json.data)
      console.log(res)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = selectedId ? `http://localhost:8000/api/pasien/${selectedId}` : "http://localhost:8000/api/pasien"
      const method = selectedId ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json", 
        },
        body: JSON.stringify({ nama_pasien: formData.nama_pasien, nomor_rm: formData.nomor_rm, alamat:formData.alamat })
      })
      const resText = await res.text();
      console.log("Respon dari Laravel:", resText);
      const json = JSON.parse(resText);
      // const json = await res.json()
      if (json.success) {
        setIsModalOpen(false)
        setFormData({ nama_pasien: "", nomor_rm: "", alamat: "" })
        setSelectedId(null)
        fetchData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/pasien/${selectedId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        setIsDeleteOpen(false)
        setSelectedId(null)
        fetchData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const openEdit = (pasien: Pasien) => {
    setSelectedId(pasien.id)
    setFormData({ nama_pasien: pasien.nama_pasien, nomor_rm: pasien.nomor_rm, alamat: pasien.alamat })
    setIsModalOpen(true)
  }

  const openDelete = (id: number) => {
    setSelectedId(id)
    setIsDeleteOpen(true)
  }

  const filteredData = data.filter(item => item.nama_pasien.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold">Data Pasien</h3>
            <Button onClick={() => {
              setSelectedId(null)
              setFormData({ nama_pasien: "", nomor_rm: "", alamat: "" })
              setIsModalOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Data
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Cari..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor RM</th> 
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th> 
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opsi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nama_pasien}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nomor_rm}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.alamat}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex-items-center">
                        <Link href={`/pasien/${item.id}`} className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 p-1 mr-2 bg-white border border-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openEdit(item)} className="inline-flex items-center justify-center text-gray-500 hover:text-gray-900 p-1 mr-2 bg-white border border-gray-200 rounded">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDelete(item.id)} className="inline-flex items-center justify-center text-red-500 hover:text-red-700 p-1 bg-white border border-gray-200 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      Tidak Ada Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? "Edit Data Pasien" : "Tambah Data Pasien"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nomor RM</label>
            <Input 
              type="text" 
              required 
              value={formData.nomor_rm} 
              onChange={(e) => setFormData({...formData, nomor_rm: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Pasien</label>
            <Input 
              required 
              value={formData.nama_pasien} 
              onChange={(e) => setFormData({...formData, nama_pasien: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <Textarea 
              value={formData.alamat} 
              onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mt-2">
            <AlertOctagon className="text-red-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hapus Data</h3>
          <p className="text-sm text-gray-500 mb-6">Apakah Anda Yakin Ingin Menghapus Data Ini?</p>
          <div className="flex space-x-3 w-full">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="danger" className="flex-1" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}