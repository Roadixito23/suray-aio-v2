import { formatCurrency } from '../../../shared/utils/format.js'
import { ESTADOS, getTalonarioType } from '../constants.js'
import { formatNumeroBoleto, calcularNumeroFin } from '../utils/numeracion.js'
import styles from './CuadernoTalonarioTable.module.css'

function CuadernoTalonarioTable({ talonarios, onEdit, onDelete, onEstadoChange }) {
  if (talonarios.length === 0) {
    return <p className={styles.empty}>Todavía no hay talonarios registrados.</p>
  }

  return (
    <ul className={styles.list}>
      {talonarios.map((talonario) => {
        const tipo = getTalonarioType(talonario.tipoId)
        const numeroFin = calcularNumeroFin(talonario.numeroInicio, talonario.cantidadBoletos)

        return (
          <li key={talonario.id} className={styles.item}>
            <div className={styles.info}>
              <p className={styles.title}>{tipo?.label ?? talonario.tipoId}</p>
              <p className={styles.meta}>
                {formatNumeroBoleto(talonario.numeroInicio)} — {formatNumeroBoleto(numeroFin)}
              </p>
              <select
                className={`${styles.estadoBadge} ${styles[`estado-${talonario.estado}`] ?? ''}`}
                value={talonario.estado}
                onChange={(e) => onEstadoChange(talonario.id, e.target.value)}
                aria-label="Estado del talonario"
              >
                {ESTADOS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.side}>
              <span className={styles.amount}>{formatCurrency(talonario.valorUnitario)}</span>
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
        )
      })}
    </ul>
  )
}

export default CuadernoTalonarioTable
