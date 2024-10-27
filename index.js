
const app = require('./app');
const config = require('./config/config');

const PORT = config.port|| 5000;
console.log(PORT)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
