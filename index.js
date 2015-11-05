var app = require('./server.js');

 var port = process.env.PORT || 4568;

app.listen(port);

console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_URL);
console.log('Server now listening on port ' + port);

app.get('env') // 'development'



