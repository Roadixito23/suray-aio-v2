import { useMemo, useState } from 'react'
import AppBar from '../../shared/components/AppBar.jsx'
import Fab from '../../shared/components/Fab.jsx'
import Modal from '../../shared/components/Modal.jsx'
import ConfirmDialog from '../../shared/components/ConfirmDialog.jsx'
import { useCuadernoTalonarios } from './hooks/useCuadernoTalonarios.js'
import { ESTADOS } from './constants.js'
import CuadernoTalonarioForm from './components/CuadernoTalonarioForm.jsx'
import CuadernoTalonarioTable from './components/CuadernoTalonarioTable.jsx'
import styles from './CuadernoModule.module.css'

const FILTROS = [{ id: 'todos', label: 'Todos' }, ...ESTADOS]

function CuadernoModule({ onBack }) {
  const { talonarios, addTalonario, updateTalonario, removeTalonario, setEstado } =
    useCuadernoTalonarios()

  const [filtro, setFiltro] = useState('todos')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const talonariosFiltrados = useMemo(() => {
    const ordenados = [...talonarios].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (filtro === 'todos') return ordenados
    return ordenados.filter((t) => t.estado === filtro)
  }, [talonarios, filtro])

  function handleCreate(data) {
    addTalonario(data)
    setCreating(false)
  }

  function handleUpdate(data) {
    updateTalonario(editing.id, data)
    setEditing(null)
  }

  function confirmDelete() {
    removeTalonario(deleting)
    setDeleting(null)
  }

  return (
    <div className={styles.page}>
      <AppBar title="Cuaderno" subtitle="Talonarios registrados" onBack={onBack} />

      <div className={styles.content}>
        <nav className={styles.tabs} role="tablist" aria-label="Filtrar por estado">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filtro === f.id}
              className={`${styles.tab} ${filtro === f.id ? styles.tabActive : ''}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        <section className={styles.listSection}>
          <CuadernoTalonarioTable
            talonarios={talonariosFiltrados}
            onEdit={setEditing}
            onDelete={setDeleting}
            onEstadoChange={setEstado}
          />
        </section>
      </div>

      <Fab label="Agregar talonario" onClick={() => setCreating(true)} />

      {creating && (
        <Modal title="Nuevo talonario" onClose={() => setCreating(false)}>
          <CuadernoTalonarioForm
            talonarios={talonarios}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Editar talonario" onClose={() => setEditing(null)}>
          <CuadernoTalonarioForm
            initialValue={editing}
            talonarios={talonarios}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar talonario"
          message="¿Seguro que querés eliminar este talonario? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default CuadernoModule
