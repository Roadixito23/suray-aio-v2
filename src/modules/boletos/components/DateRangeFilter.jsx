import FormField from '../../../shared/components/FormField.jsx'
import Button from '../../../shared/components/Button.jsx'
import styles from './DateRangeFilter.module.css'

function DateRangeFilter({ value, onChange }) {
  return (
    <div className={styles.filter}>
      <FormField
        label="Desde"
        type="date"
        value={value.desde}
        onChange={(e) => onChange({ ...value, desde: e.target.value })}
      />
      <FormField
        label="Hasta"
        type="date"
        value={value.hasta}
        onChange={(e) => onChange({ ...value, hasta: e.target.value })}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange({ desde: '', hasta: '' })}
      >
        Ver todo
      </Button>
    </div>
  )
}

export default DateRangeFilter
