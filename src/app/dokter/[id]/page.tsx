import Link from "next/link"
import { ArrowLeft, BriefcaseMedical, Users } from "lucide-react"
import { Dokter } from "@/types/dokter"
import Button from "@/components/ui/Button"

async function getDetailDokter(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/dokter/${id}`, {
    cache: "no-store" 
  })
  
  if (!res.ok) {
    throw new Error("Gagal mengambil data")
  }

  const json = await res.json()
  return json.data as Dokter
}

export default async function DetailDokterPage({ params }: { params: { id: string } }) {
  const data = await getDetailDokter(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dokter">
          <Button variant="outline" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-gray-900">Detail Dokter</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <BriefcaseMedical className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ID Dokter: {data.id}</p>
            <h3 className="text-xl font-bold text-gray-900">{data.nama_dokter}</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-500">Dibuat Pada</p>
              <p className="text-sm text-gray-900 mt-1">
                {data.created_at ? new Date(data.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Terakhir Diperbarui</p>
              <p className="text-sm text-gray-900 mt-1">
                {data.updated_at ? new Date(data.updated_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}