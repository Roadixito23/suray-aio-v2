import CuadernoModule from './cuaderno/CuadernoModule.jsx'
import BoletosCalculadora from './boletos/BoletosCalculadora.jsx'

export const MODULES = [
  {
    id: 'cuaderno',
    title: 'Cuaderno',
    description: 'Registrá talonarios por número de inicio y seguí su estado: Por Rendir, En Sobre o Timbrado.',
    icon: '📒',
    Component: CuadernoModule,
  },
  {
    id: 'boletos',
    title: 'Calculadora de Boletos',
    description:
      'Registrá talonarios, vouchers y guías de combustible, y calculá el efectivo a rendir por fecha.',
    icon: '🎟️',
    Component: BoletosCalculadora,
  },
]
