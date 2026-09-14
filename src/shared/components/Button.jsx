import styles from './Button.module.css'

function Button({ variant = 'secondary', fullWidth = false, className = '', ...props }) {
  const variantClass = styles[variant] ?? styles.secondary
  const widthClass = fullWidth ? styles.fullWidth : ''
  return (
    <button className={`${styles.button} ${variantClass} ${widthClass} ${className}`} {...props} />
  )
}

export default Button
