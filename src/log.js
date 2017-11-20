const now = () => (Math.round(performance.now() * 100) / 100).toString()

const createLogger = (print, timePad = 14) => {
  return (msg, obj) => {
    const entry = `${now().padEnd(timePad)} | `

    if (typeof msg === 'string') {
      const text = entry + msg
      if (typeof obj === 'undefined') {
        print(text)
      } else {
        print(text, obj)
      }
    } else {
      print(entry, obj)
    }
  }
}

const log = createLogger(console.log.bind(console))
const error = createLogger(console.error.bind(console), 12)

log.error = error

export { log, error }
export default log
