import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import { totalizarResumen } from '../utils/calculos.js'
import styles from './ResumenPanel.module.css'

function ResumenPanel({ resumen }) {
  if (resumen.length === 0) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>No hay registros en el rango seleccionado.</p>
      </div>
    )
  }

  const totales = totalizarResumen(resumen)

  if (resumen.length === 1) {
    const dia = resumen[0]
    return (
      <div className={styles.panel}>
        <h3>{formatDateDisplay(dia.fecha)}</h3>
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
        <div className={`${styles.total} ${dia.efectivo < 0 ? styles.negative : ''}`}>
          <span>Efectivo a rendir</span>
          <span>{formatCurrency(dia.efectivo)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Talonarios</th>
            <th>Vouchers</th>
            <th>Guías</th>
            <th>Efectivo</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((dia) => (
            <tr key={dia.fecha}>
              <td>{formatDateDisplay(dia.fecha)}</td>
              <td>{formatCurrency(dia.totalTalonarios)}</td>
              <td>{formatCurrency(dia.totalVouchers)}</td>
              <td>{formatCurrency(dia.totalGuias)}</td>
              <td>{formatCurrency(dia.efectivo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`${styles.total} ${totales.efectivo < 0 ? styles.negative : ''}`}>
        <span>Efectivo total del rango</span>
        <span>{formatCurrency(totales.efectivo)}</span>
      </div>
    </div>
  )
}

export default ResumenPanel
