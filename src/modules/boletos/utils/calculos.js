import { isWithinRange } from '../../../shared/utils/date.js'

export function valorTotalTalonario(talonario) {
  return talonario.cantidad * talonario.valorUnitario
}

export function calcularResumenPorRango(talonarios, vouchers, guias, rango = {}) {
  const totales = new Map()

  function ensureFecha(fecha) {
    if (!totales.has(fecha)) {
      totales.set(fecha, { fecha, totalTalonarios: 0, totalVouchers: 0, totalGuias: 0 })
    }
    return totales.get(fecha)
  }

  talonarios
    .filter((t) => isWithinRange(t.fecha, rango))
    .forEach((t) => {
      ensureFecha(t.fecha).totalTalonarios += valorTotalTalonario(t)
    })

  vouchers
    .filter((v) => isWithinRange(v.fecha, rango))
    .forEach((v) => {
      ensureFecha(v.fecha).totalVouchers += v.monto
    })

  guias
    .filter((g) => isWithinRange(g.fecha, rango))
    .forEach((g) => {
      ensureFecha(g.fecha).totalGuias += g.monto
    })

  return Array.from(totales.values())
    .map((item) => ({
      ...item,
      efectivo: item.totalTalonarios - item.totalVouchers - item.totalGuias,
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export function totalizarResumen(resumen) {
  return resumen.reduce(
    (acc, item) => ({
      totalTalonarios: acc.totalTalonarios + item.totalTalonarios,
      totalVouchers: acc.totalVouchers + item.totalVouchers,
      totalGuias: acc.totalGuias + item.totalGuias,
      efectivo: acc.efectivo + item.efectivo,
    }),
    { totalTalonarios: 0, totalVouchers: 0, totalGuias: 0, efectivo: 0 }
  )
}
