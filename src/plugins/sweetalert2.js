import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

function alert(icon, title, text) {
  return Toast.fire({
    icon,
    title,
    text,
  });
}
export function errorAlert(res) {
  const error = {
    icon: 'error',
    title: '發生錯誤，請稍後再試。',
  };
  if (res && res.data && res.data.error_description) {
    error.title = res.status;
    error.text = res.data.error_description;
  }
  return Toast.fire(error);
}

export default alert;
