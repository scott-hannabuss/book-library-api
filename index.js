const app = require('./src/app');

const APP_PORT = 3306;

app.listen(APP_PORT, () => {
    console.log(`Now serving your Express app at http://localhost:${APP_PORT}`); // eslint-disable-line
});