import ModuleCard from './ModuleCard.jsx'
import styles from './Dashboard.module.css'

function Dashboard({ modules, onOpenModule }) {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Suray</p>
      <h1 className={styles.title}>Panel principal</h1>
      <div className={styles.grid}>
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
    </main>
  )
}

export default Dashboard
