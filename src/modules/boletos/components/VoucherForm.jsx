import { useState } from 'react'
import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import { todayISO } from '../../../shared/utils/date.js'
import { validarVoucher } from '../utils/validation.js'
import styles from './VoucherForm.module.css'

function VoucherForm({ initialValue, onSubmit, onCancel }) {
  const [fecha, setFecha] = useState(initialValue?.fecha ?? todayISO())
  const [monto, setMonto] = useState(initialValue?.monto ?? '')
  const [nota, setNota] = useState(initialValue?.nota ?? '')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const data = { fecha, monto: Number(monto), nota }
    const { valid, errors: nextErrors } = validarVoucher(data)
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
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initialValue ? 'Guardar cambios' : 'Agregar voucher'}
        </Button>
      </div>
    </form>
  )
}

export default VoucherForm
