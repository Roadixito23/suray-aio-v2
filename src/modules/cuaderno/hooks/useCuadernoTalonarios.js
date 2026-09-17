import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS, getTalonarioType, DEFAULT_ESTADO } from '../constants.js'

export function useCuadernoTalonarios() {
  const [talonarios, setTalonarios] = useLocalStorage(STORAGE_KEYS.talonarios, [])

  function buildSnapshot({ tipoId, numeroInicio, estado }) {
    const tipo = getTalonarioType(tipoId)
    return {
      tipoId,
      numeroInicio: Number(numeroInicio),
      cantidadBoletos: tipo.cantidadBoletos,
      precioBoleto: tipo.precioBoleto,
      valorUnitario: tipo.valorUnitario,
      estado: estado ?? DEFAULT_ESTADO,
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

  function setEstado(id, estado) {
    const now = new Date().toISOString()
    setTalonarios((prev) =>
      prev.map((talonario) =>
        talonario.id === id ? { ...talonario, estado, updatedAt: now } : talonario
      )
    )
  }

  function removeTalonario(id) {
    setTalonarios((prev) => prev.filter((talonario) => talonario.id !== id))
  }

  return { talonarios, addTalonario, updateTalonario, removeTalonario, setEstado }
}
