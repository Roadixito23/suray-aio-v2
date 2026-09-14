import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import { getTalonarioType } from '../constants.js'
import { valorTotalTalonario } from '../utils/calculos.js'
import styles from './TalonarioTable.module.css'

function TalonarioTable({ talonarios, onEdit, onDelete }) {
  if (talonarios.length === 0) {
    return <p className={styles.empty}>Todavía no hay talonarios registrados.</p>
  }

  return (
    <ul className={styles.list}>
      {talonarios.map((talonario) => (
        <li key={talonario.id} className={styles.item}>
          <div className={styles.info}>
            <p className={styles.date}>{formatDateDisplay(talonario.fecha)}</p>
            <p className={styles.title}>
              {getTalonarioType(talonario.tipoId)?.label ?? talonario.tipoId}
            </p>
            <p className={styles.meta}>{talonario.cantidad} talonario(s)</p>
          </div>
          <div className={styles.side}>
            <span className={styles.amount}>{formatCurrency(valorTotalTalonario(talonario))}</span>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Editar"
                onClick={() => onEdit(talonario)}
              >
                ✎
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.deleteButton}`}
                aria-label="Eliminar"
                onClick={() => onDelete(talonario.id)}
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

export default TalonarioTable
