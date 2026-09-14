import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { useTalonarios } from './hooks/useTalonarios.js'
import { useVouchers } from './hooks/useVouchers.js'
import { useGuiasCombustible } from './hooks/useGuiasCombustible.js'
import { calcularResumenPorRango } from './utils/calculos.js'
import DateRangeFilter from './components/DateRangeFilter.jsx'
import ResumenPanel from './components/ResumenPanel.jsx'
import TalonarioForm from './components/TalonarioForm.jsx'
import TalonarioTable from './components/TalonarioTable.jsx'
import VoucherForm from './components/VoucherForm.jsx'
import VoucherTable from './components/VoucherTable.jsx'
import GuiaForm from './components/GuiaForm.jsx'
import GuiaTable from './components/GuiaTable.jsx'
import styles from './BoletosCalculadora.module.css'

const FORM_CONFIG = {
  talonario: { title: 'Editar talonario', Form: TalonarioForm },
  voucher: { title: 'Editar voucher', Form: VoucherForm },
  guia: { title: 'Editar guía de combustible', Form: GuiaForm },
}

function BoletosCalculadora({ onBack }) {
  const { talonarios, addTalonario, updateTalonario, removeTalonario } = useTalonarios()
  const { vouchers, addVoucher, updateVoucher, removeVoucher } = useVouchers()
  const { guias, addGuia, updateGuia, removeGuia } = useGuiasCombustible()

  const [rango, setRango] = useState({ desde: '', hasta: '' })
  const [editing, setEditing] = useState(null) // { type, item }
  const [deleting, setDeleting] = useState(null) // { type, id }

  const resumen = useMemo(
    () => calcularResumenPorRango(talonarios, vouchers, guias, rango),
    [talonarios, vouchers, guias, rango]
  )

  function handleUpdate(data) {
    if (editing.type === 'talonario') updateTalonario(editing.item.id, data)
    if (editing.type === 'voucher') updateVoucher(editing.item.id, data)
    if (editing.type === 'guia') updateGuia(editing.item.id, data)
    setEditing(null)
  }

  function confirmDelete() {
    if (deleting.type === 'talonario') removeTalonario(deleting.id)
    if (deleting.type === 'voucher') removeVoucher(deleting.id)
    if (deleting.type === 'guia') removeGuia(deleting.id)
    setDeleting(null)
  }

  const editConfig = editing ? FORM_CONFIG[editing.type] : null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button variant="secondary" onClick={onBack}>
          ← Volver
        </Button>
        <h1 className={styles.title}>Calculadora de Boletos</h1>
      </header>

      <div className={styles.layout}>
        <div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Talonarios</h2>
            <TalonarioForm onSubmit={addTalonario} />
            <TalonarioTable
              talonarios={talonarios}
              onEdit={(item) => setEditing({ type: 'talonario', item })}
              onDelete={(id) => setDeleting({ type: 'talonario', id })}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vouchers</h2>
            <VoucherForm onSubmit={addVoucher} />
            <VoucherTable
              vouchers={vouchers}
              onEdit={(item) => setEditing({ type: 'voucher', item })}
              onDelete={(id) => setDeleting({ type: 'voucher', id })}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Guías de combustible</h2>
            <GuiaForm onSubmit={addGuia} />
            <GuiaTable
              guias={guias}
              onEdit={(item) => setEditing({ type: 'guia', item })}
              onDelete={(id) => setDeleting({ type: 'guia', id })}
            />
          </section>
        </div>

        <div className={styles.sticky}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Rango de fechas</h2>
            <DateRangeFilter value={rango} onChange={setRango} />
          </section>
          <ResumenPanel resumen={resumen} />
        </div>
      </div>

      {editConfig && (
        <Modal title={editConfig.title} onClose={() => setEditing(null)}>
          <editConfig.Form
            initialValue={editing.item}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar registro"
          message="¿Seguro que querés eliminar este registro? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default BoletosCalculadora
