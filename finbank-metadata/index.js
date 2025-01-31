const app = require('./src/app')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 4002

app.listen(PORT, () => {
  console.log(`Metadata Service running on http://localhost:${PORT}`)
})

// node index.js
