import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import { totalizarResumen } from '../utils/calculos.js'
import styles from './ResumenPanel.module.css'

function ResumenPanel({ resumen }) {
  if (resumen.length === 0) {
    return (
      <div className={styles.panel}>
        <p className={styles.label}>Efectivo a rendir</p>
        <p className={styles.empty}>No hay registros en el rango seleccionado.</p>
      </div>
    )
  }

  const totales = totalizarResumen(resumen)

  if (resumen.length === 1) {
    const dia = resumen[0]
    return (
      <div className={styles.panel}>
        <p className={styles.label}>{formatDateDisplay(dia.fecha)}</p>
        <p className={`${styles.total} ${dia.efectivo < 0 ? styles.negative : ''}`}>
          {formatCurrency(dia.efectivo)}
        </p>
        <ul className={styles.breakdown}>
          <li>
            <span>Talonarios</span>
            <span>{formatCurrency(dia.totalTalonarios)}</span>
          </li>
          <li>
            <span>− Vouchers</span>
            <span>{formatCurrency(dia.totalVouchers)}</span>
          </li>
          <li>
            <span>− Guías de combustible</span>
            <span>{formatCurrency(dia.totalGuias)}</span>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <p className={styles.label}>Efectivo total del rango</p>
      <p className={`${styles.total} ${totales.efectivo < 0 ? styles.negative : ''}`}>
        {formatCurrency(totales.efectivo)}
      </p>
      <div className={styles.days}>
        {resumen.map((dia) => (
          <div key={dia.fecha} className={styles.day}>
            <span className={styles.dayDate}>{formatDateDisplay(dia.fecha)}</span>
            <span className={styles.dayEfectivo}>{formatCurrency(dia.efectivo)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResumenPanel
