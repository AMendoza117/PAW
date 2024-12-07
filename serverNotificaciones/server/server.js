const bodyparser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const rutas = require("./routes");
app.use("/api", rutas);

const puerto = 3001;
app.listen(puerto, error => {
    if(error) throw new Error( error );

    console.log(`Servidor esta corriendo en el puerto ${puerto}`)
});