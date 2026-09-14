import { useMemo, useState } from 'react'
import AppBar from '../../shared/components/AppBar.jsx'
import Fab from '../../shared/components/Fab.jsx'
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

const TABS = [
  { id: 'talonario', label: 'Talonarios', singular: 'talonario', icon: '🎟️' },
  { id: 'voucher', label: 'Vouchers', singular: 'voucher', icon: '🧾' },
  { id: 'guia', label: 'Guías', singular: 'guía', icon: '⛽' },
]

const TYPE_CONFIG = {
  talonario: { addTitle: 'Nuevo talonario', editTitle: 'Editar talonario', Form: TalonarioForm },
  voucher: { addTitle: 'Nuevo voucher', editTitle: 'Editar voucher', Form: VoucherForm },
  guia: {
    addTitle: 'Nueva guía de combustible',
    editTitle: 'Editar guía de combustible',
    Form: GuiaForm,
  },
}

function BoletosCalculadora({ onBack }) {
  const { talonarios, addTalonario, updateTalonario, removeTalonario } = useTalonarios()
  const { vouchers, addVoucher, updateVoucher, removeVoucher } = useVouchers()
  const { guias, addGuia, updateGuia, removeGuia } = useGuiasCombustible()

  const [activeTab, setActiveTab] = useState('talonario')
  const [rango, setRango] = useState({ desde: '', hasta: '' })
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null) // { type, item }
  const [deleting, setDeleting] = useState(null) // { type, id }

  const resumen = useMemo(
    () => calcularResumenPorRango(talonarios, vouchers, guias, rango),
    [talonarios, vouchers, guias, rango]
  )

  function handleCreate(data) {
    if (activeTab === 'talonario') addTalonario(data)
    if (activeTab === 'voucher') addVoucher(data)
    if (activeTab === 'guia') addGuia(data)
    setCreating(false)
  }

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

  const activeConfig = TYPE_CONFIG[activeTab]
  const editConfig = editing ? TYPE_CONFIG[editing.type] : null

  return (
    <div className={styles.page}>
      <AppBar title="Boletos" subtitle="Cierre de caja diario" onBack={onBack} />

      <div className={styles.content}>
        <section className={styles.summarySection}>
          <DateRangeFilter value={rango} onChange={setRango} />
          <ResumenPanel resumen={resumen} />
        </section>

        <nav className={styles.tabs} role="tablist" aria-label="Tipo de registro">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className={styles.listSection}>
          {activeTab === 'talonario' && (
            <TalonarioTable
              talonarios={talonarios}
              onEdit={(item) => setEditing({ type: 'talonario', item })}
              onDelete={(id) => setDeleting({ type: 'talonario', id })}
            />
          )}
          {activeTab === 'voucher' && (
            <VoucherTable
              vouchers={vouchers}
              onEdit={(item) => setEditing({ type: 'voucher', item })}
              onDelete={(id) => setDeleting({ type: 'voucher', id })}
            />
          )}
          {activeTab === 'guia' && (
            <GuiaTable
              guias={guias}
              onEdit={(item) => setEditing({ type: 'guia', item })}
              onDelete={(id) => setDeleting({ type: 'guia', id })}
            />
          )}
        </section>
      </div>

      <Fab
        label={`Agregar ${TABS.find((t) => t.id === activeTab).singular}`}
        onClick={() => setCreating(true)}
      />

      {creating && (
        <Modal title={activeConfig.addTitle} onClose={() => setCreating(false)}>
          <activeConfig.Form onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </Modal>
      )}

      {editConfig && (
        <Modal title={editConfig.editTitle} onClose={() => setEditing(null)}>
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
