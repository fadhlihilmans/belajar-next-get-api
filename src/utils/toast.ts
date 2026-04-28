import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const toastSuccess = (message: string) => {
  MySwal.fire({
    toast: true,
    position: 'top',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: 'linear-gradient(135deg, #76d275, #4caf50)',
    color: '#fff',
    iconColor: '#fff',
    customClass: {
      popup: 'colored-toast'
    }
  })
}

export const toastError = (message: string) => {
  MySwal.fire({
    toast: true,
    position: 'top',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: 'linear-gradient(135deg, #e53935, #c62828)',
    color: '#fff',
    iconColor: '#fff',
    customClass: {
      popup: 'colored-toast'
    }
  })
}

export const modalWarning = (message: string) => {
  MySwal.fire({
    title: 'Peringatan!',
    text: message,
    icon: 'warning',
    iconColor: '#c62828',
    confirmButtonText: 'Mengerti',
    confirmButtonColor: '#051240',
    allowEscapeKey: true,
    backdrop: `rgba(17,24,39,.55)` 
  })
}