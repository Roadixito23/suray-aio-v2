import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import styles from './GuiaTable.module.css'

function GuiaTable({ guias, onEdit, onDelete }) {
  if (guias.length === 0) {
    return <p className={styles.empty}>Todavía no hay guías de combustible registradas.</p>
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Chofer</th>
          <th>Bus</th>
          <th className={styles.numeric}>Monto</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {guias.map((guia) => (
          <tr key={guia.id}>
            <td>{formatDateDisplay(guia.fecha)}</td>
            <td>{guia.chofer}</td>
            <td>{guia.bus}</td>
            <td className={styles.numeric}>{formatCurrency(guia.monto)}</td>
            <td>
              <div className={styles.actions}>
                <button className={styles.iconButton} onClick={() => onEdit(guia)}>
                  Editar
                </button>
                <button className={styles.iconButton} onClick={() => onDelete(guia.id)}>
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

export default GuiaTable
