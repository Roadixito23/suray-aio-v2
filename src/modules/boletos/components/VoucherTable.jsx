import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import styles from './VoucherTable.module.css'

function VoucherTable({ vouchers, onEdit, onDelete }) {
  if (vouchers.length === 0) {
    return <p className={styles.empty}>Todavía no hay vouchers registrados.</p>
  }

  return (
    <ul className={styles.list}>
      {vouchers.map((voucher) => (
        <li key={voucher.id} className={styles.item}>
          <div className={styles.info}>
            <p className={styles.date}>{formatDateDisplay(voucher.fecha)}</p>
            <p className={styles.title}>Voucher</p>
            {voucher.nota && <p className={styles.meta}>{voucher.nota}</p>}
            <span className={`${styles.estadoBadge} ${voucher.sobreId ? styles.estadoEnSobre : ''}`}>
              {voucher.sobreId ? 'En sobre' : 'Pendiente'}
            </span>
          </div>
          <div className={styles.side}>
            <span className={styles.amount}>{formatCurrency(voucher.monto)}</span>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Editar"
                onClick={() => onEdit(voucher)}
              >
                ✎
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.deleteButton}`}
                aria-label="Eliminar"
                onClick={() => onDelete(voucher.id)}
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

export default VoucherTable
