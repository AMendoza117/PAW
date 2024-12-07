const vapid = require("./vapid.json");
const urlsafe = require("urlsafe-base64");
const fs = require("fs");
const webpush = require("web-push")

module.exports.getKey = () => {
    return urlsafe.decode(vapid.publicKey);
    
}

let suscripciones = require("./suscripciones-db.json") //[];
module.exports.addSuscripcion = (suscripcion) => {
    suscripciones.push( suscripcion);
    fs.writeFileSync(`${__dirname}/suscripciones-db.json`, JSON.stringify(suscripciones));
}

webpush.setVapidDetails(
    "mailto:alanmendozaa117@gmail.com",
    vapid.publicKey,
    vapid.privateKey
);
module.exports.sendNotificationPush = (post) => {
    suscripciones.forEach( (suscripcion, i) => {
        webpush.sendNotification(suscripcion, JSON.stringify(post))
    })
}