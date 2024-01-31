const express = require('expressjs');
const fs = require('fs');
const app = express();
const port = 3000;

let Data = require('./routeCoods.json');

app.post('/', (req, res) => {
    const data = JSON.parse(req.query.data);
    console.log(data);
    Data.push(data);
    fs.writeFile('./routeCoods.json', JSON.stringify(Data), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.send('Hello World!');
    res.end();
}
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});