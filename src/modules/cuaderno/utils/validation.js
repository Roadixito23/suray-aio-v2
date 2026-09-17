import { getTalonarioType, getEstado } from '../constants.js'

function validate(checks) {
  const errors = {}
  checks.forEach(([field, condition, message]) => {
    if (!condition) errors[field] = message
  })
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validarCuadernoTalonario({ tipoId, numeroInicio, estado }) {
  const tipo = getTalonarioType(tipoId)
  const numero = Number(numeroInicio)
  const numeroValido =
    tipo && Number.isInteger(numero) && numero >= 1 && (numero - 1) % tipo.cantidadBoletos === 0

  return validate([
    ['tipoId', Boolean(tipo), 'Seleccioná un tipo de talonario válido'],
    [
      'numeroInicio',
      numeroValido,
      tipo
        ? `El número de inicio debe ser 1 o avanzar de a ${tipo.cantidadBoletos} (ej: 1, ${
            tipo.cantidadBoletos + 1
          }, ${2 * tipo.cantidadBoletos + 1}...)`
        : 'Seleccioná primero un tipo de talonario válido',
    ],
    ['estado', Boolean(getEstado(estado)), 'Seleccioná un estado válido'],
  ])
}
