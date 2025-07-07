import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';

const MySwal = withReactContent(Swal);

type PopupIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

interface PopupOptions {
  icon?: PopupIcon;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  allowOutsideClick?: boolean;
}

export const showPopup = ({
  icon = 'success',
  title,
  message,
  confirmText = 'OK',
  onConfirm = () => {},
  allowOutsideClick = false
}: PopupOptions): void => {
  MySwal.fire({
    icon,
    title: `<strong>${title}</strong>`,
    html: `<p>${message}</p>`,
    confirmButtonText: confirmText,
    customClass: {
      popup: 'rounded-2xl p-6',
      title: 'text-cyberred text-2xl font-bold',
      htmlContainer: 'text-gray-600 mt-2',
      confirmButton: 'bg-cyberred text-white px-6 py-2 rounded-full mt-4'
    },
    buttonsStyling: false,
    allowOutsideClick,
    allowEscapeKey: false
  }).then(result => {
    if (result.isConfirmed) {
      onConfirm?.();
    }
  });
};
