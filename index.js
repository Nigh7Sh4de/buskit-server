var app = require('./src/app')

app(app.GetDefaultInjection(true)).listen(3000);
console.log('Listening on 3000')

