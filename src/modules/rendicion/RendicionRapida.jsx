import { useMemo, useState } from 'react'
import AppBar from '../../shared/components/AppBar.jsx'
import Button from '../../shared/components/Button.jsx'
import FormField from '../../shared/components/FormField.jsx'
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { formatCurrency } from '../../shared/utils/format.js'
import { formatDateDisplay } from '../../shared/utils/date.js'
import VoucherForm from '../boletos/components/VoucherForm.jsx'
import GuiaForm from '../boletos/components/GuiaForm.jsx'
import { TALONARIO_TYPES } from './constants.js'
import { useRendiciones } from './hooks/useRendiciones.js'
import styles from './RendicionRapida.module.css'

function calcular(cantidades, vouchers, guias) {
  const lineas = TALONARIO_TYPES.map((tipo) => {
    const cantidad = cantidades[tipo.id] ?? 0
    return { tipo, cantidad, subtotal: cantidad * tipo.valorUnitario }
  })
  const totalTalonarios = lineas.reduce((sum, l) => sum + l.subtotal, 0)
  const totalVouchers = vouchers.reduce((sum, v) => sum + v.monto, 0)
  const totalGuias = guias.reduce((sum, g) => sum + g.monto, 0)
  return {
    lineas,
    totalTalonarios,
    totalVouchers,
    totalGuias,
    efectivo: totalTalonarios - totalVouchers - totalGuias,
  }
}

function Resumen({ totalTalonarios, totalVouchers, totalGuias, efectivo }) {
  return (
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
        <span>Efectivo a rendir</span>
        <span>{formatCurrency(efectivo)}</span>
      </div>
    </div>
  )
}

function RendicionRapida({ onBack }) {
  const {
    rendiciones,
    draft,
    setFecha,
    setCantidad,
    addVoucher,
    addGuia,
    removeVoucher,
    removeGuia,
    limpiarBorrador,
    guardarRendicion,
    eliminarRendicion,
  } = useRendiciones()

  const [addingVoucher, setAddingVoucher] = useState(false)
  const [addingGuia, setAddingGuia] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmingClear, setConfirmingClear] = useState(false)

  const totales = useMemo(
    () => calcular(draft.cantidades, draft.vouchers, draft.guias),
    [draft.cantidades, draft.vouchers, draft.guias]
  )
  const hayDatos = totales.totalTalonarios > 0 || draft.vouchers.length > 0 || draft.guias.length > 0
  const puedeGuardar = totales.totalTalonarios > 0

  function handleGuardar() {
    if (!puedeGuardar) return
    guardarRendicion({
      fecha: draft.fecha,
      talonarios: totales.lineas
        .filter((l) => l.cantidad > 0)
        .map((l) => ({
          tipoId: l.tipo.id,
          label: l.tipo.label,
          cantidad: l.cantidad,
          valorUnitario: l.tipo.valorUnitario,
          subtotal: l.subtotal,
        })),
      vouchers: draft.vouchers,
      guias: draft.guias,
      totalTalonarios: totales.totalTalonarios,
      totalVouchers: totales.totalVouchers,
      totalGuias: totales.totalGuias,
      efectivo: totales.efectivo,
    })
  }

  const historial = [...rendiciones].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className={styles.page}>
      <AppBar title="Rendición rápida" subtitle="Sin número de inicio" onBack={onBack} />

      <div className={styles.content}>
        <FormField
          label="Fecha de rendición"
          type="date"
          value={draft.fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Talonarios</h2>
          <ul className={styles.list}>
            {totales.lineas.map(({ tipo, cantidad, subtotal }) => (
              <li key={tipo.id} className={styles.row}>
                <span className={styles.rowInfo}>
                  <span className={styles.rowTitle}>{tipo.label}</span>
                  <span className={styles.rowMeta}>{formatCurrency(tipo.valorUnitario)} c/u</span>
                </span>
                <span className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    aria-label={`Quitar uno de ${tipo.label}`}
                    disabled={cantidad === 0}
                    onClick={() => setCantidad(tipo.id, cantidad - 1)}
                  >
                    −
                  </button>
                  <input
                    className={styles.stepInput}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    aria-label={`Cantidad de ${tipo.label}`}
                    value={cantidad === 0 ? '' : cantidad}
                    placeholder="0"
                    onChange={(e) => setCantidad(tipo.id, e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.stepBtn}
                    aria-label={`Agregar uno de ${tipo.label}`}
                    onClick={() => setCantidad(tipo.id, cantidad + 1)}
                  >
                    +
                  </button>
                </span>
                <span className={styles.rowAmount}>{formatCurrency(subtotal)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Vouchers</h2>
            {!addingVoucher && (
              <button type="button" className={styles.addLink} onClick={() => setAddingVoucher(true)}>
                + Agregar voucher
              </button>
            )}
          </div>
          {addingVoucher && (
            <VoucherForm
              onSubmit={(data) => {
                addVoucher(data)
                setAddingVoucher(false)
              }}
              onCancel={() => setAddingVoucher(false)}
            />
          )}
          {draft.vouchers.length === 0 && !addingVoucher ? (
            <p className={styles.emptySection}>Sin vouchers.</p>
          ) : (
            <ul className={styles.list}>
              {draft.vouchers.map((v) => (
                <li key={v.id} className={styles.row}>
                  <span className={styles.rowInfo}>
                    <span className={styles.rowTitle}>{v.nota || 'Voucher'}</span>
                    <span className={styles.rowMeta}>{formatDateDisplay(v.fecha)}</span>
                  </span>
                  <span className={styles.rowAmount}>− {formatCurrency(v.monto)}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    aria-label="Quitar voucher"
                    onClick={() => removeVoucher(v.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Guías de combustible</h2>
            {!addingGuia && (
              <button type="button" className={styles.addLink} onClick={() => setAddingGuia(true)}>
                + Agregar guía
              </button>
            )}
          </div>
          {addingGuia && (
            <GuiaForm
              onSubmit={(data) => {
                addGuia(data)
                setAddingGuia(false)
              }}
              onCancel={() => setAddingGuia(false)}
            />
          )}
          {draft.guias.length === 0 && !addingGuia ? (
            <p className={styles.emptySection}>Sin guías.</p>
          ) : (
            <ul className={styles.list}>
              {draft.guias.map((g) => (
                <li key={g.id} className={styles.row}>
                  <span className={styles.rowInfo}>
                    <span className={styles.rowTitle}>{g.chofer}</span>
                    <span className={styles.rowMeta}>
                      Bus {g.bus} · {formatDateDisplay(g.fecha)}
                    </span>
                  </span>
                  <span className={styles.rowAmount}>− {formatCurrency(g.monto)}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    aria-label="Quitar guía"
                    onClick={() => removeGuia(g.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Resumen {...totales} />

        <div className={styles.actions}>
          <Button variant="primary" fullWidth disabled={!puedeGuardar} onClick={handleGuardar}>
            Guardar rendición
          </Button>
          {hayDatos && (
            <Button variant="text" fullWidth onClick={() => setConfirmingClear(true)}>
              Limpiar
            </Button>
          )}
        </div>

        <section className={styles.historial}>
          <h2 className={styles.sectionTitle}>Rendiciones guardadas</h2>
          {historial.length === 0 ? (
            <p className={styles.emptySection}>Todavía no hay rendiciones guardadas.</p>
          ) : (
            <ul className={styles.list}>
              {historial.map((r) => (
                <li key={r.id} className={styles.histItem}>
                  <div className={styles.histHeader}>
                    <div>
                      <p className={styles.rowMeta}>{formatDateDisplay(r.fecha)}</p>
                      <p className={styles.rowTitle}>
                        {r.talonarios.reduce((sum, t) => sum + t.cantidad, 0)} talonario(s)
                      </p>
                    </div>
                    <span className={`${styles.histAmount} ${r.efectivo < 0 ? styles.negativo : ''}`}>
                      {formatCurrency(r.efectivo)}
                    </span>
                  </div>
                  <ul className={styles.detalle}>
                    {r.talonarios.map((t) => (
                      <li key={t.tipoId} className={styles.detalleItem}>
                        <span>
                          {t.cantidad} × {t.label}
                        </span>
                        <span>{formatCurrency(t.subtotal)}</span>
                      </li>
                    ))}
                    {r.vouchers.map((v) => (
                      <li key={v.id} className={styles.detalleItem}>
                        <span>{v.nota || 'Voucher'}</span>
                        <span>− {formatCurrency(v.monto)}</span>
                      </li>
                    ))}
                    {r.guias.map((g) => (
                      <li key={g.id} className={styles.detalleItem}>
                        <span>
                          {g.chofer} · Bus {g.bus}
                        </span>
                        <span>− {formatCurrency(g.monto)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="text" fullWidth onClick={() => setDeletingId(r.id)}>
                    Eliminar rendición
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {deletingId && (
        <ConfirmDialog
          title="Eliminar rendición"
          message="¿Seguro que querés eliminar esta rendición? Esta acción no se puede deshacer."
          onConfirm={() => {
            eliminarRendicion(deletingId)
            setDeletingId(null)
          }}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {confirmingClear && (
        <ConfirmDialog
          title="Limpiar rendición"
          message="Se van a borrar los talonarios, vouchers y guías cargados. ¿Continuar?"
          onConfirm={() => {
            limpiarBorrador()
            setConfirmingClear(false)
          }}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  )
}

export default RendicionRapida
