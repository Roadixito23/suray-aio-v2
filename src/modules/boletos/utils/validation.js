import { isValidISODate } from '../../../shared/utils/date.js'
import { getTalonarioType, BUS_NAME_MAX_LENGTH } from '../constants.js'

function validate(checks) {
  const errors = {}
  checks.forEach(([field, condition, message]) => {
    if (!condition) errors[field] = message
  })
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validarTalonario({ tipoId, fecha, cantidad }) {
  return validate([
    ['tipoId', Boolean(getTalonarioType(tipoId)), 'Seleccioná un tipo de talonario válido'],
    ['fecha', isValidISODate(fecha), 'Ingresá una fecha válida'],
    ['cantidad', Number.isInteger(Number(cantidad)) && Number(cantidad) >= 1, 'La cantidad debe ser un entero mayor o igual a 1'],
  ])
}

export function validarVoucher({ fecha, monto }) {
  return validate([
    ['fecha', isValidISODate(fecha), 'Ingresá una fecha válida'],
    ['monto', Number(monto) > 0, 'El monto debe ser mayor a 0'],
  ])
}

export function validarGuia({ chofer, bus, fecha, monto }) {
  const choferValido = typeof chofer === 'string' && chofer.trim().length > 0
  const busValido =
    typeof bus === 'string' && bus.trim().length > 0 && bus.trim().length <= BUS_NAME_MAX_LENGTH

  return validate([
    ['chofer', choferValido, 'El nombre del chofer es obligatorio'],
    ['bus', busValido, `El nombre del bus es obligatorio (máximo ${BUS_NAME_MAX_LENGTH} caracteres)`],
    ['fecha', isValidISODate(fecha), 'Ingresá una fecha válida'],
    ['monto', Number(monto) > 0, 'El monto debe ser mayor a 0'],
  ])
}
