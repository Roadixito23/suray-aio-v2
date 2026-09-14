import styles from './FormField.module.css'

function FormField({ label, error, as = 'input', children, className = '', ...inputProps }) {
  const inputClassName = `${styles.input} ${error ? styles.invalid : ''}`.trim()

  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}</span>
      {as === 'select' ? (
        <select className={inputClassName} {...inputProps}>
          {children}
        </select>
      ) : (
        <input className={inputClassName} {...inputProps} />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}

export default FormField
