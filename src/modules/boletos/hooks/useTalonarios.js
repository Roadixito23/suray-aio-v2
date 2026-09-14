import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS, getTalonarioType } from '../constants.js'

export function useTalonarios() {
  const [talonarios, setTalonarios] = useLocalStorage(STORAGE_KEYS.talonarios, [])

  function buildSnapshot({ tipoId, fecha, cantidad }) {
    const tipo = getTalonarioType(tipoId)
    return {
      tipoId,
      fecha,
      cantidad: Number(cantidad),
      cantidadBoletos: tipo.cantidadBoletos,
      precioBoleto: tipo.precioBoleto,
      valorUnitario: tipo.valorUnitario,
    }
  }

  function addTalonario(input) {
    const now = new Date().toISOString()
    const talonario = {
      id: generateId(),
      ...buildSnapshot(input),
      createdAt: now,
      updatedAt: now,
    }
    setTalonarios((prev) => [...prev, talonario])
  }

  function updateTalonario(id, input) {
    const now = new Date().toISOString()
    setTalonarios((prev) =>
      prev.map((talonario) =>
        talonario.id === id
          ? { ...talonario, ...buildSnapshot(input), updatedAt: now }
          : talonario
      )
    )
  }

  function removeTalonario(id) {
    setTalonarios((prev) => prev.filter((talonario) => talonario.id !== id))
  }

  return { talonarios, addTalonario, updateTalonario, removeTalonario }
}
