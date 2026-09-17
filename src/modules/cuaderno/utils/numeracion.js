export function formatNumeroBoleto(numero) {
  const value = Number(numero)
  if (!Number.isFinite(value) || value < 0) return ''
  return String(Math.trunc(value)).padStart(6, '0')
}

export function calcularNumeroFin(numeroInicio, cantidadBoletos) {
  return Number(numeroInicio) + Number(cantidadBoletos) - 1
}

export function sugerirNumeroInicio(talonarios, tipoId) {
  const maxFin = talonarios
    .filter((t) => t.tipoId === tipoId)
    .reduce((max, t) => Math.max(max, calcularNumeroFin(t.numeroInicio, t.cantidadBoletos)), 0)
  return maxFin + 1
}
