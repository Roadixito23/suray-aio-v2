import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { todayISO } from '../../../shared/utils/date.js'
import { STORAGE_KEYS } from '../constants.js'

const EMPTY_DRAFT = { fecha: null, cantidades: {}, vouchers: [], guias: [] }

export function useRendiciones() {
  const [rendiciones, setRendiciones] = useLocalStorage(STORAGE_KEYS.rendiciones, [])
  const [draft, setDraft] = useLocalStorage(STORAGE_KEYS.borrador, EMPTY_DRAFT)

  function setFecha(fecha) {
    setDraft((prev) => ({ ...prev, fecha }))
  }

  function setCantidad(tipoId, cantidad) {
    const next = Math.max(0, Math.floor(Number(cantidad) || 0))
    setDraft((prev) => ({ ...prev, cantidades: { ...prev.cantidades, [tipoId]: next } }))
  }

  function addVoucher({ fecha, monto, nota = '' }) {
    setDraft((prev) => ({
      ...prev,
      vouchers: [...prev.vouchers, { id: generateId(), fecha, monto: Number(monto), nota }],
    }))
  }

  function addGuia({ chofer, bus, fecha, monto }) {
    setDraft((prev) => ({
      ...prev,
      guias: [...prev.guias, { id: generateId(), chofer, bus, fecha, monto: Number(monto) }],
    }))
  }

  function removeVoucher(id) {
    setDraft((prev) => ({ ...prev, vouchers: prev.vouchers.filter((v) => v.id !== id) }))
  }

  function removeGuia(id) {
    setDraft((prev) => ({ ...prev, guias: prev.guias.filter((g) => g.id !== id) }))
  }

  function limpiarBorrador() {
    setDraft(EMPTY_DRAFT)
  }

  function guardarRendicion(data) {
    const now = new Date().toISOString()
    const rendicion = { id: generateId(), ...data, createdAt: now }
    setRendiciones((prev) => [...prev, rendicion])
    setDraft(EMPTY_DRAFT)
    return rendicion
  }

  function eliminarRendicion(id) {
    setRendiciones((prev) => prev.filter((r) => r.id !== id))
  }

  return {
    rendiciones,
    draft: { ...EMPTY_DRAFT, ...draft, fecha: draft.fecha ?? todayISO() },
    setFecha,
    setCantidad,
    addVoucher,
    addGuia,
    removeVoucher,
    removeGuia,
    limpiarBorrador,
    guardarRendicion,
    eliminarRendicion,
  }
}
