import styles from './AppBar.module.css'

function AppBar({ title, subtitle, onBack, trailing }) {
  return (
    <header className={styles.appBar}>
      {onBack && (
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="Volver">
          ←
        </button>
      )}
      <div className={styles.titles}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </header>
  )
}

export default AppBar
