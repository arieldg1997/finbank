const app = require('./src/app')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.log(`Collector Service running on http://localhost:${PORT}`)

  require('./src/task/inbound')
})

// node index.js
