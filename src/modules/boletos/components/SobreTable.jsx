import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import Button from '../../../shared/components/Button.jsx'
import { getTalonarioType } from '../constants.js'
import { formatNumeroBoleto, calcularNumeroFin } from '../../cuaderno/utils/numeracion.js'
import styles from './SobreTable.module.css'

const ESTADO_LABEL = {
  'en-sobre': 'En Sobre',
  timbrado: 'Timbrado',
}

function SobreTable({ sobres, onMarcarTimbrado, onDelete }) {
  if (sobres.length === 0) {
    return <p className={styles.empty}>Todavía no hay sobres creados.</p>
  }

  const ordenados = [...sobres].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <ul className={styles.list}>
      {ordenados.map((sobre) => {
        const detalleTalonarios = sobre.detalleTalonarios ?? sobre.detalle ?? []
        const detalleVouchers = sobre.detalleVouchers ?? []
        const detalleGuias = sobre.detalleGuias ?? []
        const totalTalonarios = sobre.totalTalonarios ?? sobre.valorTotal ?? 0
        const totalVouchers = sobre.totalVouchers ?? 0
        const totalGuias = sobre.totalGuias ?? 0
        const efectivo = sobre.efectivo ?? totalTalonarios - totalVouchers - totalGuias

        return (
          <li key={sobre.id} className={styles.item}>
            <div className={styles.header}>
              <div>
                <p className={styles.date}>{formatDateDisplay(sobre.createdAt.slice(0, 10))}</p>
                <p className={styles.title}>{detalleTalonarios.length} talonario(s)</p>
              </div>
              <div className={styles.headerSide}>
                <span className={styles.amount}>{formatCurrency(efectivo)}</span>
                <span className={`${styles.estadoBadge} ${styles[`estado-${sobre.estado}`] ?? ''}`}>
                  {ESTADO_LABEL[sobre.estado] ?? sobre.estado}
                </span>
              </div>
            </div>

            <ul className={styles.detalle}>
              {detalleTalonarios.map((d) => {
                const tipo = getTalonarioType(d.tipoId)
                const numeroFin = calcularNumeroFin(d.numeroInicio, d.cantidadBoletos)
                return (
                  <li key={d.talonarioId} className={styles.detalleItem}>
                    <span>{tipo?.label ?? d.tipoId}</span>
                    <span>
                      {formatNumeroBoleto(d.numeroInicio)} — {formatNumeroBoleto(numeroFin)}
                    </span>
                    <span>{formatCurrency(d.valorUnitario)}</span>
                  </li>
                )
              })}
              {detalleVouchers.map((d) => (
                <li key={d.voucherId} className={styles.detalleItem}>
                  <span>{d.nota || 'Voucher'}</span>
                  <span>{formatDateDisplay(d.fecha)}</span>
                  <span>− {formatCurrency(d.monto)}</span>
                </li>
              ))}
              {detalleGuias.map((d) => (
                <li key={d.guiaId} className={styles.detalleItem}>
                  <span>{d.chofer}</span>
                  <span>Bus {d.bus}</span>
                  <span>− {formatCurrency(d.monto)}</span>
                </li>
              ))}
            </ul>

            <div className={styles.resumen}>
              <div className={styles.resumenRow}>
                <span>Total talonarios</span>
                <span>{formatCurrency(totalTalonarios)}</span>
              </div>
              <div className={styles.resumenRow}>
                <span>Vouchers</span>
                <span>− {formatCurrency(totalVouchers)}</span>
              </div>
              <div className={styles.resumenRow}>
                <span>Guías</span>
                <span>− {formatCurrency(totalGuias)}</span>
              </div>
              <div className={`${styles.resumenRow} ${styles.resumenTotal} ${efectivo < 0 ? styles.negativo : ''}`}>
                <span>Efectivo</span>
                <span>{formatCurrency(efectivo)}</span>
              </div>
            </div>

            {sobre.estado === 'en-sobre' && (
              <div className={styles.actions}>
                <Button variant="primary" fullWidth onClick={() => onMarcarTimbrado(sobre.id)}>
                  Marcar como Timbrado
                </Button>
                <Button variant="text" fullWidth onClick={() => onDelete(sobre.id)}>
                  Eliminar sobre
                </Button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default SobreTable
