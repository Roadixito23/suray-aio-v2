import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS } from '../constants.js'

export function useGuiasCombustible() {
  const [guias, setGuias] = useLocalStorage(STORAGE_KEYS.guias, [])

  function addGuia({ chofer, bus, fecha, monto }) {
    const now = new Date().toISOString()
    const guia = {
      id: generateId(),
      chofer: chofer.trim(),
      bus: bus.trim().toUpperCase(),
      fecha,
      monto: Number(monto),
      sobreId: null,
      createdAt: now,
      updatedAt: now,
    }
    setGuias((prev) => [...prev, guia])
    return guia
  }

  function updateGuia(id, { chofer, bus, fecha, monto }) {
    const now = new Date().toISOString()
    setGuias((prev) =>
      prev.map((guia) =>
        guia.id === id
          ? {
              ...guia,
              chofer: chofer.trim(),
              bus: bus.trim().toUpperCase(),
              fecha,
              monto: Number(monto),
              updatedAt: now,
            }
          : guia
      )
    )
  }

  function removeGuia(id) {
    setGuias((prev) => prev.filter((guia) => guia.id !== id))
  }

  function marcarSobre(ids, sobreId) {
    const now = new Date().toISOString()
    setGuias((prev) =>
      prev.map((guia) => (ids.includes(guia.id) ? { ...guia, sobreId, updatedAt: now } : guia))
    )
  }

  return { guias, addGuia, updateGuia, removeGuia, marcarSobre }
}
