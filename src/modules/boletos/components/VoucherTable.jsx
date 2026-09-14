import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import styles from './VoucherTable.module.css'

function VoucherTable({ vouchers, onEdit, onDelete }) {
  if (vouchers.length === 0) {
    return <p className={styles.empty}>Todavía no hay vouchers registrados.</p>
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th className={styles.numeric}>Monto</th>
          <th>Nota</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {vouchers.map((voucher) => (
          <tr key={voucher.id}>
            <td>{formatDateDisplay(voucher.fecha)}</td>
            <td className={styles.numeric}>{formatCurrency(voucher.monto)}</td>
            <td>{voucher.nota}</td>
            <td>
              <div className={styles.actions}>
                <button className={styles.iconButton} onClick={() => onEdit(voucher)}>
                  Editar
                </button>
                <button className={styles.iconButton} onClick={() => onDelete(voucher.id)}>
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

export default VoucherTable
