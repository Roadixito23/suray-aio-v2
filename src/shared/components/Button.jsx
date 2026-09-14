import styles from './Button.module.css'

function Button({ variant = 'secondary', className = '', ...props }) {
  const variantClass = styles[variant] ?? styles.secondary
  return <button className={`${styles.button} ${variantClass} ${className}`} {...props} />
}

export default Button
