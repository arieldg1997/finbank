const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Auth Service running on http://localhost:${PORT}`);
});

// node index.js
