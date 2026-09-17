import { TALONARIO_TYPES, getTalonarioType } from '../boletos/constants.js'

export { TALONARIO_TYPES, getTalonarioType }

export const STORAGE_KEYS = {
  talonarios: 'suray:cuaderno:talonarios',
}

export const ESTADOS = [
  { id: 'por-rendir', label: 'Por Rendir' },
  { id: 'en-sobre', label: 'En Sobre' },
  { id: 'timbrado', label: 'Timbrado' },
]

export const DEFAULT_ESTADO = ESTADOS[0].id

export function getEstado(estadoId) {
  return ESTADOS.find((estado) => estado.id === estadoId)
}
