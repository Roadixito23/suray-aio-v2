import styles from './ModuleCard.module.css'

function ModuleCard({ title, description, icon, onOpen }) {
  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.body}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <span className={styles.chevron} aria-hidden="true">
        ›
      </span>
    </button>
  )
}

export default ModuleCard
