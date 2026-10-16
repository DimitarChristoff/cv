// dates in data.tsx are 'MMM YYYY' strings, or 'date' meaning present
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export const isPresent = (value: string) => value.trim() === 'date'

const toMonthIndex = (value: string) => {
  if (isPresent(value)) {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  const [month, year] = value.trim().split(/\s+/)
  return Number(year) * 12 + MONTHS.indexOf(month.slice(0, 3).toLowerCase())
}

// inclusive, so Jan 2020 - Jan 2020 is one month
export const monthsBetween = (from: string, until: string) => toMonthIndex(until) - toMonthIndex(from) + 1

export const formatDuration = (months: number) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}

export const formatPeriod = (from: string, until: string) =>
  `${from.trim()} — ${isPresent(until) ? 'Present' : until.trim()}`

export const yearOf = (value: string) => Math.floor(toMonthIndex(value) / 12)
