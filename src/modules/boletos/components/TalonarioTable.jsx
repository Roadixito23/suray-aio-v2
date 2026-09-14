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
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th className={styles.numeric}>Cantidad</th>
          <th className={styles.numeric}>Valor total</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {talonarios.map((talonario) => (
          <tr key={talonario.id}>
            <td>{formatDateDisplay(talonario.fecha)}</td>
            <td>{getTalonarioType(talonario.tipoId)?.label ?? talonario.tipoId}</td>
            <td className={styles.numeric}>{talonario.cantidad}</td>
            <td className={styles.numeric}>{formatCurrency(valorTotalTalonario(talonario))}</td>
            <td>
              <div className={styles.actions}>
                <button className={styles.iconButton} onClick={() => onEdit(talonario)}>
                  Editar
                </button>
                <button className={styles.iconButton} onClick={() => onDelete(talonario.id)}>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TalonarioTable
