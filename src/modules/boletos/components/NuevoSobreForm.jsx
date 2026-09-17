import { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import { formatCurrency } from '../../../shared/utils/format.js'
import { formatDateDisplay } from '../../../shared/utils/date.js'
import { getTalonarioType } from '../constants.js'
import { formatNumeroBoleto, calcularNumeroFin } from '../../cuaderno/utils/numeracion.js'
import VoucherForm from './VoucherForm.jsx'
import GuiaForm from './GuiaForm.jsx'
import GastoForm from './GastoForm.jsx'
import styles from './NuevoSobreForm.module.css'

function SeccionSeleccionable({
  title,
  items,
  selectedIds,
  onToggle,
  renderItem,
  emptyText,
  addLabel,
  AddForm,
  onAdded,
}) {
  const [adding, setAdding] = useState(false)

  function handleAdded(data) {
    const created = onAdded(data)
    onToggle(created.id, true)
    setAdding(false)
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>{title}</p>
        {AddForm && !adding && (
          <button type="button" className={styles.addLink} onClick={() => setAdding(true)}>
            {addLabel}
          </button>
        )}
      </div>
      {adding && AddForm && <AddForm onSubmit={handleAdded} onCancel={() => setAdding(false)} />}
      {items.length === 0 ? (
        <p className={styles.emptySection}>{emptyText}</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => {
            const info = renderItem(item)
            return (
              <li key={item.id} className={styles.item}>
                <label className={styles.itemLabel}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{info.title}</span>
                    <span className={styles.itemMeta}>{info.meta}</span>
                  </span>
                  <span className={styles.itemAmount}>{info.amount}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function NuevoSobreForm({
  talonariosDisponibles,
  vouchersDisponibles,
  guiasDisponibles,
  gastosDisponibles,
  onAddVoucher,
  onAddGuia,
  onAddGasto,
  onSubmit,
  onCancel,
}) {
  const [talonarioIds, setTalonarioIds] = useState([])
  const [voucherIds, setVoucherIds] = useState([])
  const [guiaIds, setGuiaIds] = useState([])
  const [gastoIds, setGastoIds] = useState([])

  function makeToggle(setIds) {
    return (id, forceSelect = false) => {
      setIds((prev) => {
        if (forceSelect) return prev.includes(id) ? prev : [...prev, id]
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      })
    }
  }

  const talonariosSeleccionados = talonariosDisponibles.filter((t) => talonarioIds.includes(t.id))
  const vouchersSeleccionados = vouchersDisponibles.filter((v) => voucherIds.includes(v.id))
  const guiasSeleccionadas = guiasDisponibles.filter((g) => guiaIds.includes(g.id))
  const gastosSeleccionados = gastosDisponibles.filter((g) => gastoIds.includes(g.id))

  const totalTalonarios = talonariosSeleccionados.reduce((sum, t) => sum + t.valorUnitario, 0)
  const totalVouchers = vouchersSeleccionados.reduce((sum, v) => sum + v.monto, 0)
  const totalGuias = guiasSeleccionadas.reduce((sum, g) => sum + g.monto, 0)
  const totalGastos = gastosSeleccionados.reduce((sum, g) => sum + g.monto, 0)
  const efectivo = totalTalonarios - totalVouchers - totalGuias - totalGastos

  function handleCerrarSobre() {
    if (talonariosSeleccionados.length === 0) return
    onSubmit({
      talonarios: talonariosSeleccionados,
      vouchers: vouchersSeleccionados,
      guias: guiasSeleccionadas,
      gastos: gastosSeleccionados,
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
      <SeccionSeleccionable
        title='Talonarios "Por Rendir"'
        items={talonariosDisponibles}
        selectedIds={talonarioIds}
        onToggle={makeToggle(setTalonarioIds)}
        emptyText="No hay talonarios pendientes."
        renderItem={(t) => {
          const tipo = getTalonarioType(t.tipoId)
          const numeroFin = calcularNumeroFin(t.numeroInicio, t.cantidadBoletos)
          return {
            title: tipo?.label ?? t.tipoId,
            meta: `${formatNumeroBoleto(t.numeroInicio)} — ${formatNumeroBoleto(numeroFin)}`,
            amount: formatCurrency(t.valorUnitario),
          }
        }}
      />

      <SeccionSeleccionable
        title="Vouchers"
        items={vouchersDisponibles}
        selectedIds={voucherIds}
        onToggle={makeToggle(setVoucherIds)}
        emptyText="No hay vouchers pendientes."
        addLabel="+ Agregar voucher"
        AddForm={VoucherForm}
        onAdded={onAddVoucher}
        renderItem={(v) => ({
          title: v.nota || 'Voucher',
          meta: formatDateDisplay(v.fecha),
          amount: formatCurrency(v.monto),
        })}
      />

      <SeccionSeleccionable
        title="Guías de combustible"
        items={guiasDisponibles}
        selectedIds={guiaIds}
        onToggle={makeToggle(setGuiaIds)}
        emptyText="No hay guías pendientes."
        addLabel="+ Agregar guía"
        AddForm={GuiaForm}
        onAdded={onAddGuia}
        renderItem={(g) => ({
          title: g.chofer,
          meta: `Bus ${g.bus}`,
          amount: formatCurrency(g.monto),
        })}
      />

      <SeccionSeleccionable
        title="Otros gastos"
        items={gastosDisponibles}
        selectedIds={gastoIds}
        onToggle={makeToggle(setGastoIds)}
        emptyText="No hay otros gastos pendientes."
        addLabel="+ Agregar gasto"
        AddForm={GastoForm}
        onAdded={onAddGasto}
        renderItem={(g) => ({
          title: g.categoria,
          meta: formatDateDisplay(g.fecha),
          amount: formatCurrency(g.monto),
        })}
      />

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
        <div className={styles.resumenRow}>
          <span>Otros gastos</span>
          <span>− {formatCurrency(totalGastos)}</span>
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
