import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS } from '../constants.js'

export function useGastos() {
  const [gastos, setGastos] = useLocalStorage(STORAGE_KEYS.gastos, [])

  function addGasto({ categoria, fecha, monto, nota = '' }) {
    const now = new Date().toISOString()
    const gasto = {
      id: generateId(),
      categoria: categoria.trim(),
      fecha,
      monto: Number(monto),
      nota,
      sobreId: null,
      createdAt: now,
      updatedAt: now,
    }
    setGastos((prev) => [...prev, gasto])
    return gasto
  }

  function updateGasto(id, { categoria, fecha, monto, nota = '' }) {
    const now = new Date().toISOString()
    setGastos((prev) =>
      prev.map((gasto) =>
        gasto.id === id
          ? { ...gasto, categoria: categoria.trim(), fecha, monto: Number(monto), nota, updatedAt: now }
          : gasto
      )
    )
  }

  function removeGasto(id) {
    setGastos((prev) => prev.filter((gasto) => gasto.id !== id))
  }

  function marcarSobre(ids, sobreId) {
    const now = new Date().toISOString()
    setGastos((prev) =>
      prev.map((gasto) => (ids.includes(gasto.id) ? { ...gasto, sobreId, updatedAt: now } : gasto))
    )
  }

  return { gastos, addGasto, updateGasto, removeGasto, marcarSobre }
}
