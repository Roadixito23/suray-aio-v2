import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.js'
import { generateId } from '../../../shared/utils/id.js'
import { STORAGE_KEYS } from '../constants.js'

export function useVouchers() {
  const [vouchers, setVouchers] = useLocalStorage(STORAGE_KEYS.vouchers, [])

  function addVoucher({ fecha, monto, nota = '' }) {
    const now = new Date().toISOString()
    const voucher = {
      id: generateId(),
      fecha,
      monto: Number(monto),
      nota,
      createdAt: now,
      updatedAt: now,
    }
    setVouchers((prev) => [...prev, voucher])
  }

  function updateVoucher(id, { fecha, monto, nota = '' }) {
    const now = new Date().toISOString()
    setVouchers((prev) =>
      prev.map((voucher) =>
        voucher.id === id
          ? { ...voucher, fecha, monto: Number(monto), nota, updatedAt: now }
          : voucher
      )
    )
  }

  function removeVoucher(id) {
    setVouchers((prev) => prev.filter((voucher) => voucher.id !== id))
  }

  return { vouchers, addVoucher, updateVoucher, removeVoucher }
}
