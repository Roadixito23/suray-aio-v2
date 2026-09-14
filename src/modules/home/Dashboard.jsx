import ModuleCard from './ModuleCard.jsx'
import styles from './Dashboard.module.css'

function Dashboard({ modules, onOpenModule }) {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Suray</p>
          <h1 className={styles.title}>Hola 👋</h1>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.sectionLabel}>Módulos</p>
        <div className={styles.list}>
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onOpen={() => onOpenModule(module.id)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Dashboard
