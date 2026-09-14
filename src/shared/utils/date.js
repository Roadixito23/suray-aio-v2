const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export function isValidISODate(value) {
  if (typeof value !== 'string' || !ISO_DATE_RE.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

export function formatDateDisplay(isoDate) {
  if (!isValidISODate(isoDate)) return isoDate ?? ''
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function isWithinRange(isoDate, { desde, hasta } = {}) {
  if (!isValidISODate(isoDate)) return false
  if (desde && isoDate < desde) return false
  if (hasta && isoDate > hasta) return false
  return true
}
