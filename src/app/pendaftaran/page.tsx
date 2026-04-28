"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Eye, Calendar } from "lucide-react"
import { toastSuccess, toastError, modalWarning } from "@/utils/toast"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Input from "@/components/ui/Input"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { Pendaftaran } from "@/types/pendaftaran"

export default function PendaftaranPage() {
  const [data, setData] = useState<Pendaftaran[]>([])
  const [listPasien, setListPasien] = useState([])
  const [listPoli, setListPoli] = useState([])
  const [listDokter, setListDokter] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    pasien_id: "",
    poli_id: "",
    dokter_id: "",
    tanggal_daftar: ""
  })

  const [errors, setErrors] = useState({
    pasien_id: "",
    poli_id: "",
    dokter_id: "",
    tanggal_daftar: ""
  })
  
  const fetchPendaftaran = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pendaftaran")
      const json = await res.json()
      setData(json.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelationalData = async () => {
    try {
      const [resPasien, resPoli, resDokter] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/pasien").then(r => r.json()),
        fetch("http://127.0.0.1:8000/api/poli").then(r => r.json()),
        fetch("http://127.0.0.1:8000/api/dokter").then(r => r.json())
      ])
      
      setListPasien(resPasien.data.map((p: any) => ({ value: p.id, label: p.nama_pasien })))
      setListPoli(resPoli.data.map((p: any) => ({ value: p.id, label: p.nama_poli })))
      setListDokter(resDokter.data.map((d: any) => ({ value: d.id, label: d.nama_dokter })))
    } catch (error) {
      console.error("Gagal menarik data relasi", error)
    }
  }

  useEffect(() => {
    fetchPendaftaran()
    fetchRelationalData()
  }, [])


  const handleInputValidation = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    let errorMessage = "";

    switch (field) {
      case 'tanggal_daftar':
        if (!value) {
          errorMessage = "Tanggal daftar tidak boleh kosong!";
        } else {
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          
          if (inputDate < today) {
            errorMessage = "Tanggal daftar tidak boleh lewat dari hari ini!";
          }
        }
        break;
        
      case 'pasien_id':
        if (!value || value === "") {
          errorMessage = "Pasien wajib dipilih!";
        }
        break;
      case 'poli_id':
        if (!value || value === "") {
          errorMessage = "Poli wajib dipilih!";
        }
        break;
      case 'dokter_id':
        if (!value || value === "") {
          errorMessage = "Dokter wajib dipilih!";
        }
        break;
        
      
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = selectedId ? `http://127.0.0.1:8000/api/pendaftaran/${selectedId}` : "http://127.0.0.1:8000/api/pendaftaran"
      const method = selectedId ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          pasien_id: Number(formData.pasien_id),
          poli_id: Number(formData.poli_id),
          dokter_id: Number(formData.dokter_id),
          tanggal_daftar: formData.tanggal_daftar
        })
      })

      const json = await res.json()
      if (json.success) {
        setIsModalOpen(false)
        setFormData({ pasien_id: "", poli_id: "", dokter_id: "", tanggal_daftar: "" })
        setSelectedId(null)
        fetchPendaftaran()
        toastSuccess(selectedId ? "Pendaftaran berhasil diperbarui!" : "Pendaftaran baru berhasil dibuat!")
      } else {
        toastError("Gagal menyimpan data ke.")
        alert("Gagal menyimpan data!")
      }
    } catch (error) {
      modalWarning("Terjadi kesalahan jaringan. Silakan coba lagi. : " + error)
      console.error(error)
    }
  }

  const openAdd = () => {
    setSelectedId(null)
    setFormData({ pasien_id: "", poli_id: "", dokter_id: "", tanggal_daftar: "" })
    setIsModalOpen(true)
  }

  const openEdit = (item: Pendaftaran) => {
    setSelectedId(item.id)
    setFormData({
      pasien_id: item.pasien_id.toString(),
      poli_id: item.poli_id.toString(),
      dokter_id: item.dokter_id.toString(),
      tanggal_daftar: item.tanggal_daftar.split(' ')[0] 
    })
    setIsModalOpen(true)
  }

  const openDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      await fetch(`http://127.0.0.1:8000/api/pendaftaran/${id}`, { method: "DELETE" })
      fetchPendaftaran()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Data Pendaftaran</h2>
        <Button onClick={openAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Daftar Baru</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Daftar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poli</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opsi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Memuat data...</td></tr>
              ) : data.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{item.tanggal_daftar}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pasien?.nama_pasien || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.poli?.nama_poli || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dokter?.nama_dokter || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/pendaftaran/${item.id}`} className="inline-flex p-1 text-blue-500 border rounded">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openEdit(item)} className="inline-flex p-1 text-gray-500 border rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDelete(item.id)} className="inline-flex p-1 text-red-500 border rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? "Edit Pendaftaran" : "Tambah Pendaftaran"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pasien</label>
            <SearchableSelect 
              options={listPasien} 
              value={formData.pasien_id ? Number(formData.pasien_id) : ""} 
              placeholder="Ketik nama pasien..."
              onChange={(val) => handleInputValidation('pasien_id', val.toString())} 
            />
              {errors.pasien_id && (
                <p className="text-red-500 text-xs mt-1">{errors.pasien_id}</p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Poli</label>
            <SearchableSelect 
              options={listPoli} 
              value={formData.poli_id ? Number(formData.poli_id) : ""} 
              onChange={(val) => setFormData({...formData, poli_id: val.toString()})} 
              placeholder="Pilih poli tujuan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Dokter</label>
            <SearchableSelect 
              options={listDokter} 
              value={formData.dokter_id ? Number(formData.dokter_id) : ""} 
              // onChange={(val) => setFormData({...formData, dokter_id: val.toString()})} 
              placeholder="Ketik nama dokter..."
              onChange={(val) => handleInputValidation('dokter_id', val.toString())} 
              />
              {errors.dokter_id && (
                <p className="text-red-500 text-xs mt-1">{errors.dokter_id}</p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Daftar</label>
            <Input 
              type="date" 
              required 
              value={formData.tanggal_daftar} 
              // onChange={(e) => setFormData({...formData, tanggal_daftar: e.target.value})} 
              onChange={(e) => handleInputValidation('tanggal_daftar', e.target.value)}
              className={errors.tanggal_daftar ? "border-red-500 focus:ring-red-500/20" : ""}
            />
            {errors.tanggal_daftar && (
              <p className="text-red-500 text-xs mt-1">{errors.tanggal_daftar}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit">Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}