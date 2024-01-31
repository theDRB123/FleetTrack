const express = require('express');
const cors = require('cors');



const fs = require('fs');
const app = express();
const port = 4000;

let Data = require('./data/routeCoods.json');

app.use(cors());
app.use(express.json());

app.post('/addRoute', (req, res) => {
    const data = req.body;
    console.log(data)
    Data.routeData.push(data);


    let formattedData = JSON.stringify(Data, null, 2);

    // Remove newline characters and extra spaces in arrays
    formattedData = formattedData.replace(/(\[\s*)([^\]]*?)(\s*\])/g, (match, p1, p2, p3) => {
        return '[' + p2.replace(/\s/g, '') + ']';
    });

    fs.writeFile('./data/routeCoods.json', formattedData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.send(data);
    res.end();
}
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});