export const STORAGE_KEYS = {
  talonarios: 'suray:boletos:talonarios',
  vouchers: 'suray:boletos:vouchers',
  guias: 'suray:boletos:guias',
}

const RAW_TYPES = [
  { id: 'T50-3600', cantidadBoletos: 50, precioBoleto: 3600 },
  { id: 'T50-3000', cantidadBoletos: 50, precioBoleto: 3000 },
  { id: 'T50-2500', cantidadBoletos: 50, precioBoleto: 2500 },
  { id: 'T50-1800', cantidadBoletos: 50, precioBoleto: 1800 },
  { id: 'T25-6000', cantidadBoletos: 25, precioBoleto: 6000 },
]

export const TALONARIO_TYPES = RAW_TYPES.map((tipo) => ({
  ...tipo,
  valorUnitario: tipo.cantidadBoletos * tipo.precioBoleto,
  label: `${tipo.cantidadBoletos} x ${tipo.precioBoleto}`,
}))

export function getTalonarioType(tipoId) {
  return TALONARIO_TYPES.find((tipo) => tipo.id === tipoId)
}

export const BUS_NAME_MAX_LENGTH = 4
