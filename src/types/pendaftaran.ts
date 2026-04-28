import { Poli } from "./poli";
import { Pasien } from "./pasien"; 
import { Dokter } from "./dokter";

export interface Pendaftaran {
  id: number;
  pasien_id: number;
  poli_id: number;
  dokter_id: number;
  tanggal_daftar: string;
  created_at?: string;
  updated_at?: string;
  
  pasien?: Pasien;
  poli?: Poli;
  dokter?: Dokter;
}