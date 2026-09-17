import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS } from '../constants.js'

export function useSobres() {
  const [sobres, setSobres] = useLocalStorage(STORAGE_KEYS.sobres, [])

  function crearSobre({ talonarios, vouchers, guias, gastos }) {
    const now = new Date().toISOString()
    const totalTalonarios = talonarios.reduce((sum, t) => sum + t.valorUnitario, 0)
    const totalVouchers = vouchers.reduce((sum, v) => sum + v.monto, 0)
    const totalGuias = guias.reduce((sum, g) => sum + g.monto, 0)
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)

    const sobre = {
      id: generateId(),
      detalleTalonarios: talonarios.map((t) => ({
        talonarioId: t.id,
        tipoId: t.tipoId,
        cantidadBoletos: t.cantidadBoletos,
        precioBoleto: t.precioBoleto,
        valorUnitario: t.valorUnitario,
        numeroInicio: t.numeroInicio,
      })),
      detalleVouchers: vouchers.map((v) => ({ voucherId: v.id, fecha: v.fecha, monto: v.monto, nota: v.nota })),
      detalleGuias: guias.map((g) => ({
        guiaId: g.id,
        chofer: g.chofer,
        bus: g.bus,
        fecha: g.fecha,
        monto: g.monto,
      })),
      detalleGastos: gastos.map((g) => ({
        gastoId: g.id,
        categoria: g.categoria,
        fecha: g.fecha,
        monto: g.monto,
        nota: g.nota,
      })),
      totalTalonarios,
      totalVouchers,
      totalGuias,
      totalGastos,
      efectivo: totalTalonarios - totalVouchers - totalGuias - totalGastos,
      estado: 'en-sobre',
      createdAt: now,
      updatedAt: now,
      timbradoAt: null,
    }
    setSobres((prev) => [...prev, sobre])
    return sobre
  }

  function marcarTimbrado(id) {
    const now = new Date().toISOString()
    setSobres((prev) =>
      prev.map((sobre) =>
        sobre.id === id ? { ...sobre, estado: 'timbrado', timbradoAt: now, updatedAt: now } : sobre
      )
    )
  }

  function eliminarSobre(id) {
    setSobres((prev) => prev.filter((sobre) => sobre.id !== id))
  }

  return { sobres, crearSobre, marcarTimbrado, eliminarSobre }
}
