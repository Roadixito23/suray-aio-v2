import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS } from '../constants.js'

export function useSobres() {
  const [sobres, setSobres] = useLocalStorage(STORAGE_KEYS.sobres, [])

  function crearSobre(talonarios) {
    const now = new Date().toISOString()
    const sobre = {
      id: generateId(),
      detalle: talonarios.map((t) => ({
        talonarioId: t.id,
        tipoId: t.tipoId,
        cantidadBoletos: t.cantidadBoletos,
        precioBoleto: t.precioBoleto,
        valorUnitario: t.valorUnitario,
        numeroInicio: t.numeroInicio,
      })),
      valorTotal: talonarios.reduce((sum, t) => sum + t.valorUnitario, 0),
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
