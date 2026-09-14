import { useState } from 'react'
import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import { todayISO } from '../../../shared/utils/date.js'
import { BUS_NAME_MAX_LENGTH } from '../constants.js'
import { validarGuia } from '../utils/validation.js'
import styles from './GuiaForm.module.css'

function GuiaForm({ initialValue, onSubmit, onCancel }) {
  const [chofer, setChofer] = useState(initialValue?.chofer ?? '')
  const [bus, setBus] = useState(initialValue?.bus ?? '')
  const [fecha, setFecha] = useState(initialValue?.fecha ?? todayISO())
  const [monto, setMonto] = useState(initialValue?.monto ?? '')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const data = { chofer, bus, fecha, monto: Number(monto) }
    const { valid, errors: nextErrors } = validarGuia(data)
    setErrors(nextErrors)
    if (!valid) return
    onSubmit(data)
    if (!initialValue) {
      setChofer('')
      setBus('')
      setMonto('')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField
        label="Chofer"
        type="text"
        value={chofer}
        onChange={(e) => setChofer(e.target.value)}
        error={errors.chofer}
      />
      <FormField
        label={`Bus (máx. ${BUS_NAME_MAX_LENGTH})`}
        type="text"
        maxLength={BUS_NAME_MAX_LENGTH}
        value={bus}
        onChange={(e) => setBus(e.target.value.toUpperCase())}
        error={errors.bus}
      />
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
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initialValue ? 'Guardar cambios' : 'Agregar guía'}
        </Button>
      </div>
    </form>
  )
}

export default GuiaForm
