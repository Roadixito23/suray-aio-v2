import styles from './Modal.module.css'

function Modal({ title, onClose, children, variant = 'sheet' }) {
  const isSheet = variant === 'sheet'
  const overlayClass = isSheet ? styles.sheetOverlay : styles.dialogOverlay
  const panelClass = isSheet ? styles.sheet : styles.dialogVariant

  return (
    <div className={`${styles.overlay} ${overlayClass}`} onClick={onClose}>
      <div
        className={`${styles.dialog} ${panelClass}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        {isSheet && <div className={styles.grabber} />}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
