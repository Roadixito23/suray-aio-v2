import Modal from './Modal.jsx'
import Button from './Button.jsx'

function ConfirmDialog({ title = 'Confirmar', message, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} variant="dialog">
      <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.4rem' }}>
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm}>
          Eliminar
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
