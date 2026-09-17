import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import styles from './GastoTable.module.css'

function GastoTable({ gastos, onEdit, onDelete }) {
  if (gastos.length === 0) {
    return <p className={styles.empty}>Todavía no hay otros gastos registrados.</p>
  }

  return (
    <ul className={styles.list}>
      {gastos.map((gasto) => (
        <li key={gasto.id} className={styles.item}>
          <div className={styles.info}>
            <p className={styles.date}>{formatDateDisplay(gasto.fecha)}</p>
            <p className={styles.title}>{gasto.categoria}</p>
            {gasto.nota && <p className={styles.meta}>{gasto.nota}</p>}
            <span className={`${styles.estadoBadge} ${gasto.sobreId ? styles.estadoEnSobre : ''}`}>
              {gasto.sobreId ? 'En sobre' : 'Pendiente'}
            </span>
          </div>
          <div className={styles.side}>
            <span className={styles.amount}>{formatCurrency(gasto.monto)}</span>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Editar"
                onClick={() => onEdit(gasto)}
              >
                ✎
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.deleteButton}`}
                aria-label="Eliminar"
                onClick={() => onDelete(gasto.id)}
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

export default GastoTable
