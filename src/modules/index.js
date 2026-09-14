import BoletosCalculadora from './boletos/BoletosCalculadora.jsx'

export const MODULES = [
  {
    id: 'boletos',
    title: 'Calculadora de Boletos',
    description:
      'Registrá talonarios, vouchers y guías de combustible, y calculá el efectivo a rendir por fecha.',
    icon: '🎟️',
    Component: BoletosCalculadora,
  },
]
