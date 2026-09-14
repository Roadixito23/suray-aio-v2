import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import styles from './GuiaTable.module.css'

function GuiaTable({ guias, onEdit, onDelete }) {
  if (guias.length === 0) {
    return <p className={styles.empty}>Todavía no hay guías de combustible registradas.</p>
  }

  return (
    <ul className={styles.list}>
      {guias.map((guia) => (
        <li key={guia.id} className={styles.item}>
          <div className={styles.info}>
            <p className={styles.date}>{formatDateDisplay(guia.fecha)}</p>
            <p className={styles.title}>{guia.chofer}</p>
            <p className={styles.meta}>Bus {guia.bus}</p>
          </div>
          <div className={styles.side}>
            <span className={styles.amount}>{formatCurrency(guia.monto)}</span>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Editar"
                onClick={() => onEdit(guia)}
              >
                ✎
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.deleteButton}`}
                aria-label="Eliminar"
                onClick={() => onDelete(guia.id)}
              >
                🗑
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GuiaTable
