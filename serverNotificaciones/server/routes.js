const express = require("express");
const router = express.Router();
const push = require("./push");

router.get("/key", (req, res ) => {
    const llave = push.getKey();

    res.send(llave);
});

router.post("/suscribe", (req, res) => {
    const suscripcion = req.body;
    console.log("Suscripcion: ", suscripcion);
    push.addSuscripcion(suscripcion);
    res.json("Metodo suscribirse");
});

router.post("/push", (req, res) => {
    const notificacion = {
        titulo: req.body.titulo,
        cuerpo: req.body.contenido,
        usuario: req.body.usuario
    }
    push.sendNotificationPush(notificacion);
        
    res.json("Metodo push");
});

module.exports = router;