const currencyFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  const number = Number(value) || 0
  return currencyFormatter.format(number)
}
