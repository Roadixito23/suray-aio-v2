import { useState } from 'react'
import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import { formatCurrency } from '../../../shared/utils/format.js'
import { todayISO } from '../../../shared/utils/date.js'
import { TALONARIO_TYPES, getTalonarioType } from '../constants.js'
import { validarTalonario } from '../utils/validation.js'
import styles from './TalonarioForm.module.css'

function TalonarioForm({ initialValue, onSubmit, onCancel }) {
  const [tipoId, setTipoId] = useState(initialValue?.tipoId ?? TALONARIO_TYPES[0].id)
  const [fecha, setFecha] = useState(initialValue?.fecha ?? todayISO())
  const [cantidad, setCantidad] = useState(initialValue?.cantidad ?? 1)
  const [errors, setErrors] = useState({})

  const tipo = getTalonarioType(tipoId)
  const valorTotal = tipo ? tipo.valorUnitario * (Number(cantidad) || 0) : 0

  function handleSubmit(event) {
    event.preventDefault()
    const data = { tipoId, fecha, cantidad: Number(cantidad) }
    const { valid, errors: nextErrors } = validarTalonario(data)
    setErrors(nextErrors)
    if (!valid) return
    onSubmit(data)
    if (!initialValue) {
      setCantidad(1)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField
        as="select"
        label="Tipo de talonario"
        value={tipoId}
        onChange={(e) => setTipoId(e.target.value)}
        error={errors.tipoId}
      >
        {TALONARIO_TYPES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </FormField>
      <FormField
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        error={errors.fecha}
      />
      <FormField
        label="Cantidad de talonarios"
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        error={errors.cantidad}
      />
      <p className={styles.preview}>Valor total: {formatCurrency(valorTotal)}</p>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" fullWidth>
          {initialValue ? 'Guardar cambios' : 'Agregar talonario'}
        </Button>
        {onCancel && (
          <Button type="button" variant="text" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

export default TalonarioForm
