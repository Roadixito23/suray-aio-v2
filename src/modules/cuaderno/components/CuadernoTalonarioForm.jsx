import { useState } from 'react'
import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import { formatCurrency } from '../../../shared/utils/format.js'
import { TALONARIO_TYPES, ESTADOS, DEFAULT_ESTADO, getTalonarioType } from '../constants.js'
import { validarCuadernoTalonario } from '../utils/validation.js'
import { formatNumeroBoleto, calcularNumeroFin, sugerirNumeroInicio } from '../utils/numeracion.js'
import styles from './CuadernoTalonarioForm.module.css'

function CuadernoTalonarioForm({ initialValue, talonarios, onSubmit, onCancel }) {
  const [tipoId, setTipoId] = useState(initialValue?.tipoId ?? TALONARIO_TYPES[0].id)
  const [numeroInicio, setNumeroInicio] = useState(
    initialValue?.numeroInicio ?? sugerirNumeroInicio(talonarios, TALONARIO_TYPES[0].id)
  )
  const [estado, setEstado] = useState(initialValue?.estado ?? DEFAULT_ESTADO)
  const [errors, setErrors] = useState({})

  const tipo = getTalonarioType(tipoId)
  const numeroFin = tipo ? calcularNumeroFin(numeroInicio, tipo.cantidadBoletos) : null

  function handleTipoChange(nextTipoId) {
    setTipoId(nextTipoId)
    if (!initialValue) {
      setNumeroInicio(sugerirNumeroInicio(talonarios, nextTipoId))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const data = { tipoId, numeroInicio: Number(numeroInicio), estado }
    const { valid, errors: nextErrors } = validarCuadernoTalonario(data)
    setErrors(nextErrors)
    if (!valid) return
    onSubmit(data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField
        as="select"
        label="Cantidad (tipo de talonario)"
        value={tipoId}
        onChange={(e) => handleTipoChange(e.target.value)}
        error={errors.tipoId}
      >
        {TALONARIO_TYPES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </FormField>
      <FormField
        label="Número de inicio"
        type="number"
        min="1"
        value={numeroInicio}
        onChange={(e) => setNumeroInicio(e.target.value)}
        error={errors.numeroInicio}
      />
      <FormField
        as="select"
        label="Estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        error={errors.estado}
      >
        {ESTADOS.map((e) => (
          <option key={e.id} value={e.id}>
            {e.label}
          </option>
        ))}
      </FormField>
      <p className={styles.preview}>
        Boletos {formatNumeroBoleto(numeroInicio)} — {formatNumeroBoleto(numeroFin)}
        <br />
        Valor total: {tipo ? formatCurrency(tipo.valorUnitario) : '-'}
      </p>
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

export default CuadernoTalonarioForm
