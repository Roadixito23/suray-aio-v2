import { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import { formatCurrency } from '../../../shared/utils/format.js'
import { getTalonarioType } from '../constants.js'
import { formatNumeroBoleto, calcularNumeroFin } from '../../cuaderno/utils/numeracion.js'
import VoucherForm from './VoucherForm.jsx'
import GuiaForm from './GuiaForm.jsx'
import styles from './NuevoSobreForm.module.css'

function NuevoSobreForm({
  talonariosDisponibles,
  vouchersDisponibles,
  guiasDisponibles,
  onAddVoucher,
  onAddGuia,
  onSubmit,
  onCancel,
}) {
  const [talonarioIds, setTalonarioIds] = useState([])
  const [voucherIds, setVoucherIds] = useState([])
  const [guiaIds, setGuiaIds] = useState([])
  const [addingVoucher, setAddingVoucher] = useState(false)
  const [addingGuia, setAddingGuia] = useState(false)

  function toggle(setIds, id) {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const talonariosSeleccionados = talonariosDisponibles.filter((t) => talonarioIds.includes(t.id))
  const vouchersSeleccionados = vouchersDisponibles.filter((v) => voucherIds.includes(v.id))
  const guiasSeleccionadas = guiasDisponibles.filter((g) => guiaIds.includes(g.id))

  const totalTalonarios = talonariosSeleccionados.reduce((sum, t) => sum + t.valorUnitario, 0)
  const totalVouchers = vouchersSeleccionados.reduce((sum, v) => sum + v.monto, 0)
  const totalGuias = guiasSeleccionadas.reduce((sum, g) => sum + g.monto, 0)
  const efectivo = totalTalonarios - totalVouchers - totalGuias

  function handleAddVoucher(data) {
    const voucher = onAddVoucher(data)
    setVoucherIds((prev) => [...prev, voucher.id])
    setAddingVoucher(false)
  }

  function handleAddGuia(data) {
    const guia = onAddGuia(data)
    setGuiaIds((prev) => [...prev, guia.id])
    setAddingGuia(false)
  }

  function handleCerrarSobre() {
    if (talonariosSeleccionados.length === 0) return
    onSubmit({
      talonarios: talonariosSeleccionados,
      vouchers: vouchersSeleccionados,
      guias: guiasSeleccionadas,
    })
  }

  if (talonariosDisponibles.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay talonarios "Por Rendir" en el Cuaderno para armar un sobre.</p>
        <Button type="button" variant="text" fullWidth onClick={onCancel}>
          Cerrar
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Talonarios "Por Rendir"</p>
        <ul className={styles.list}>
          {talonariosDisponibles.map((t) => {
            const tipo = getTalonarioType(t.tipoId)
            const numeroFin = calcularNumeroFin(t.numeroInicio, t.cantidadBoletos)
            return (
              <li key={t.id} className={styles.item}>
                <label className={styles.itemLabel}>
                  <input
                    type="checkbox"
                    checked={talonarioIds.includes(t.id)}
                    onChange={() => toggle(setTalonarioIds, t.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{tipo?.label ?? t.tipoId}</span>
                    <span className={styles.itemMeta}>
                      {formatNumeroBoleto(t.numeroInicio)} — {formatNumeroBoleto(numeroFin)}
                    </span>
                  </span>
                  <span className={styles.itemAmount}>{formatCurrency(t.valorUnitario)}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Vouchers</p>
          {!addingVoucher && (
            <button type="button" className={styles.addLink} onClick={() => setAddingVoucher(true)}>
              + Agregar voucher
            </button>
          )}
        </div>
        {addingVoucher && (
          <VoucherForm onSubmit={handleAddVoucher} onCancel={() => setAddingVoucher(false)} />
        )}
        {vouchersDisponibles.length === 0 ? (
          <p className={styles.emptySection}>No hay vouchers pendientes.</p>
        ) : (
          <ul className={styles.list}>
            {vouchersDisponibles.map((v) => (
              <li key={v.id} className={styles.item}>
                <label className={styles.itemLabel}>
                  <input
                    type="checkbox"
                    checked={voucherIds.includes(v.id)}
                    onChange={() => toggle(setVoucherIds, v.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{v.nota || 'Voucher'}</span>
                    <span className={styles.itemMeta}>{v.fecha}</span>
                  </span>
                  <span className={styles.itemAmount}>{formatCurrency(v.monto)}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Guías de combustible</p>
          {!addingGuia && (
            <button type="button" className={styles.addLink} onClick={() => setAddingGuia(true)}>
              + Agregar guía
            </button>
          )}
        </div>
        {addingGuia && <GuiaForm onSubmit={handleAddGuia} onCancel={() => setAddingGuia(false)} />}
        {guiasDisponibles.length === 0 ? (
          <p className={styles.emptySection}>No hay guías pendientes.</p>
        ) : (
          <ul className={styles.list}>
            {guiasDisponibles.map((g) => (
              <li key={g.id} className={styles.item}>
                <label className={styles.itemLabel}>
                  <input
                    type="checkbox"
                    checked={guiaIds.includes(g.id)}
                    onChange={() => toggle(setGuiaIds, g.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{g.chofer}</span>
                    <span className={styles.itemMeta}>Bus {g.bus}</span>
                  </span>
                  <span className={styles.itemAmount}>{formatCurrency(g.monto)}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

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
          <span>Efectivo restante</span>
          <span>{formatCurrency(efectivo)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={talonariosSeleccionados.length === 0}
          onClick={handleCerrarSobre}
        >
          Cerrar sobre
        </Button>
        <Button type="button" variant="text" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export default NuevoSobreForm
