import styles from './Fab.module.css'

function Fab({ label, icon = '+', ...props }) {
  return (
    <button type="button" className={styles.fab} {...props}>
      <span className={styles.icon}>{icon}</span>
      {label && <span>{label}</span>}
    </button>
  )
}

export default Fab
