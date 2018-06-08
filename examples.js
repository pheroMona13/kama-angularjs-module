const path = require('path')
	, express = require('express')
	, app = express()
	, staticPath = path.join(__dirname, '/');

app.use(express.static(staticPath));
app.listen(3000, function() { console.log('listening') });