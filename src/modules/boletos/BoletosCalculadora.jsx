import { useMemo, useState } from 'react'
import AppBar from '../../shared/components/AppBar.jsx'
import Fab from '../../shared/components/Fab.jsx'
import Modal from '../../shared/components/Modal.jsx'
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { useCuadernoTalonarios } from '../cuaderno/hooks/useCuadernoTalonarios.js'
import { useSobres } from './hooks/useSobres.js'
import { useVouchers } from './hooks/useVouchers.js'
import { useGuiasCombustible } from './hooks/useGuiasCombustible.js'
import NuevoSobreForm from './components/NuevoSobreForm.jsx'
import SobreTable from './components/SobreTable.jsx'
import VoucherForm from './components/VoucherForm.jsx'
import VoucherTable from './components/VoucherTable.jsx'
import GuiaForm from './components/GuiaForm.jsx'
import GuiaTable from './components/GuiaTable.jsx'
import styles from './BoletosCalculadora.module.css'

const TABS = [
  { id: 'sobre', label: 'Sobres', singular: 'sobre', icon: '✉️' },
  { id: 'voucher', label: 'Vouchers', singular: 'voucher', icon: '🧾' },
  { id: 'guia', label: 'Guías', singular: 'guía', icon: '⛽' },
]

const TYPE_CONFIG = {
  voucher: { addTitle: 'Nuevo voucher', editTitle: 'Editar voucher', Form: VoucherForm },
  guia: {
    addTitle: 'Nueva guía de combustible',
    editTitle: 'Editar guía de combustible',
    Form: GuiaForm,
  },
}

function BoletosCalculadora({ onBack }) {
  const { talonarios: talonariosCuaderno, setEstado: setEstadoCuaderno } = useCuadernoTalonarios()
  const { sobres, crearSobre, marcarTimbrado, eliminarSobre } = useSobres()
  const { vouchers, addVoucher, updateVoucher, removeVoucher, marcarSobre: marcarSobreVoucher } =
    useVouchers()
  const { guias, addGuia, updateGuia, removeGuia, marcarSobre: marcarSobreGuia } =
    useGuiasCombustible()

  const [activeTab, setActiveTab] = useState('sobre')
  const [creating, setCreating] = useState(false)
  const [creatingSobre, setCreatingSobre] = useState(false)
  const [editing, setEditing] = useState(null) // { type, item }
  const [deleting, setDeleting] = useState(null) // { type, id }
  const [deletingSobreId, setDeletingSobreId] = useState(null)

  const talonariosPorRendir = useMemo(
    () => talonariosCuaderno.filter((t) => t.estado === 'por-rendir'),
    [talonariosCuaderno]
  )
  const vouchersPendientes = useMemo(() => vouchers.filter((v) => !v.sobreId), [vouchers])
  const guiasPendientes = useMemo(() => guias.filter((g) => !g.sobreId), [guias])

  function handleCreate(data) {
    if (activeTab === 'voucher') addVoucher(data)
    if (activeTab === 'guia') addGuia(data)
    setCreating(false)
  }

  function handleUpdate(data) {
    if (editing.type === 'voucher') updateVoucher(editing.item.id, data)
    if (editing.type === 'guia') updateGuia(editing.item.id, data)
    setEditing(null)
  }

  function confirmDelete() {
    if (deleting.type === 'voucher') removeVoucher(deleting.id)
    if (deleting.type === 'guia') removeGuia(deleting.id)
    setDeleting(null)
  }

  function handleCerrarSobre({ talonarios, vouchers: vouchersSeleccionados, guias: guiasSeleccionadas }) {
    const sobre = crearSobre({ talonarios, vouchers: vouchersSeleccionados, guias: guiasSeleccionadas })
    talonarios.forEach((t) => setEstadoCuaderno(t.id, 'en-sobre'))
    if (vouchersSeleccionados.length > 0) {
      marcarSobreVoucher(vouchersSeleccionados.map((v) => v.id), sobre.id)
    }
    if (guiasSeleccionadas.length > 0) {
      marcarSobreGuia(guiasSeleccionadas.map((g) => g.id), sobre.id)
    }
    setCreatingSobre(false)
  }

  function handleMarcarTimbrado(sobreId) {
    const sobre = sobres.find((s) => s.id === sobreId)
    if (!sobre) return
    marcarTimbrado(sobreId)
    const detalleTalonarios = sobre.detalleTalonarios ?? sobre.detalle ?? []
    detalleTalonarios.forEach((d) => setEstadoCuaderno(d.talonarioId, 'timbrado'))
  }

  function confirmDeleteSobre() {
    const sobre = sobres.find((s) => s.id === deletingSobreId)
    if (sobre) {
      eliminarSobre(sobre.id)
      const detalleTalonarios = sobre.detalleTalonarios ?? sobre.detalle ?? []
      detalleTalonarios.forEach((d) => setEstadoCuaderno(d.talonarioId, 'por-rendir'))
      const voucherIds = (sobre.detalleVouchers ?? []).map((d) => d.voucherId)
      if (voucherIds.length > 0) marcarSobreVoucher(voucherIds, null)
      const guiaIds = (sobre.detalleGuias ?? []).map((d) => d.guiaId)
      if (guiaIds.length > 0) marcarSobreGuia(guiaIds, null)
    }
    setDeletingSobreId(null)
  }

  const activeConfig = TYPE_CONFIG[activeTab]
  const editConfig = editing ? TYPE_CONFIG[editing.type] : null

  return (
    <div className={styles.page}>
      <AppBar title="Boletos" subtitle="Cierre de caja diario" onBack={onBack} />

      <div className={styles.content}>
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
          {activeTab === 'sobre' && (
            <SobreTable
              sobres={sobres}
              onMarcarTimbrado={handleMarcarTimbrado}
              onDelete={setDeletingSobreId}
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

      {activeTab === 'sobre' ? (
        <Fab label="Nuevo sobre" onClick={() => setCreatingSobre(true)} />
      ) : (
        <Fab
          label={`Agregar ${TABS.find((t) => t.id === activeTab).singular}`}
          onClick={() => setCreating(true)}
        />
      )}

      {creatingSobre && (
        <Modal title="Nuevo sobre" onClose={() => setCreatingSobre(false)}>
          <NuevoSobreForm
            talonariosDisponibles={talonariosPorRendir}
            vouchersDisponibles={vouchersPendientes}
            guiasDisponibles={guiasPendientes}
            onAddVoucher={addVoucher}
            onAddGuia={addGuia}
            onSubmit={handleCerrarSobre}
            onCancel={() => setCreatingSobre(false)}
          />
        </Modal>
      )}

      {creating && activeConfig && (
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

      {deletingSobreId && (
        <ConfirmDialog
          title="Eliminar sobre"
          message="Los talonarios de este sobre volverán a estar Por Rendir en el Cuaderno. ¿Continuar?"
          onConfirm={confirmDeleteSobre}
          onCancel={() => setDeletingSobreId(null)}
        />
      )}
    </div>
  )
}

export default BoletosCalculadora
