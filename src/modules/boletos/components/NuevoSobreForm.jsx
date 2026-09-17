import { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import { formatCurrency } from '../../../shared/utils/format.js'
import { getTalonarioType } from '../constants.js'
import { formatNumeroBoleto, calcularNumeroFin } from '../../cuaderno/utils/numeracion.js'
import styles from './NuevoSobreForm.module.css'

function NuevoSobreForm({ talonarios, onSubmit, onCancel }) {
  const [selectedIds, setSelectedIds] = useState([])

  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const seleccionados = talonarios.filter((t) => selectedIds.includes(t.id))
  const valorTotal = seleccionados.reduce((sum, t) => sum + t.valorUnitario, 0)

  function handleSubmit(event) {
    event.preventDefault()
    if (seleccionados.length === 0) return
    onSubmit(seleccionados)
  }

  if (talonarios.length === 0) {
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <ul className={styles.list}>
        {talonarios.map((t) => {
          const tipo = getTalonarioType(t.tipoId)
          const numeroFin = calcularNumeroFin(t.numeroInicio, t.cantidadBoletos)
          const checked = selectedIds.includes(t.id)
          return (
            <li key={t.id} className={styles.item}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(t.id)}
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
      <p className={styles.preview}>
        {seleccionados.length} talonario(s) seleccionados — Total: {formatCurrency(valorTotal)}
      </p>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" fullWidth disabled={seleccionados.length === 0}>
          Cerrar sobre
        </Button>
        <Button type="button" variant="text" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default NuevoSobreForm
