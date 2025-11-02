"use client"

import { toast } from "react-toastify"

/**
 * Muestra un toast de confirmación similar a window.confirm
 * @param {string} message - Mensaje a mostrar
 * @param {function} onConfirm - Callback cuando se confirma
 * @param {function} onCancel - Callback opcional cuando se cancela
 */
export const showConfirmToast = (message, onConfirm, onCancel = null) => {
  const ConfirmToastContent = () => (
    <div className="confirm-toast-content">
      <p>{message}</p>
      <div className="confirm-toast-buttons">
        <button
          className="confirm-btn-yes"
          onClick={() => {
            toast.dismiss()
            onConfirm()
          }}
        >
          Confirmar
        </button>
        <button
          className="confirm-btn-no"
          onClick={() => {
            toast.dismiss()
            if (onCancel) onCancel()
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )

  toast(<ConfirmToastContent />, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    closeButton: false,
    className: "confirm-toast",
  })
}