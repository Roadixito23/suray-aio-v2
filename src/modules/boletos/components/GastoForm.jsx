import { useState } from 'react'
import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import { todayISO } from '../../../shared/utils/date.js'
import { CATEGORIAS_GASTO } from '../constants.js'
import { validarGasto } from '../utils/validation.js'
import styles from './GastoForm.module.css'

function GastoForm({ initialValue, onSubmit, onCancel }) {
  const [categoria, setCategoria] = useState(initialValue?.categoria ?? CATEGORIAS_GASTO[0])
  const [fecha, setFecha] = useState(initialValue?.fecha ?? todayISO())
  const [monto, setMonto] = useState(initialValue?.monto ?? '')
  const [nota, setNota] = useState(initialValue?.nota ?? '')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const data = { categoria, fecha, monto: Number(monto), nota }
    const { valid, errors: nextErrors } = validarGasto(data)
    setErrors(nextErrors)
    if (!valid) return
    onSubmit(data)
    if (!initialValue) {
      setMonto('')
      setNota('')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField
        as="select"
        label="Tipo de gasto"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        error={errors.categoria}
      >
        {CATEGORIAS_GASTO.map((c) => (
          <option key={c} value={c}>
            {c}
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
        label="Monto"
        type="number"
        min="0"
        step="0.01"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        error={errors.monto}
      />
      <FormField
        label="Nota (opcional)"
        type="text"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
      />
      <div className={styles.actions}>
        <Button type="submit" variant="primary" fullWidth>
          {initialValue ? 'Guardar cambios' : 'Agregar gasto'}
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

export default GastoForm
