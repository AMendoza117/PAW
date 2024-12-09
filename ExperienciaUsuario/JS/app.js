if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registrado con éxito:", registration);
    })
    .catch((error) => {
      console.log("Error al registrar el Service Worker:", error);
    });
}


const enviarNotificaciones =()=>{
    const notificationOpts = {
        body: "Notificacion Instrumento de evaluación",
        icon: "img/icono.png"
    }

    const n = new Notification("Nueva Notificacion", notificationOpts);
    n.onclick =() => {
        console.log("Le dieron clic a la notificacion");
    }
}

const mostrarNotificaciones = () => {
    if(!window.Notification){
        console.log("El navegador no soporta notificaciones")
        return;
    }
    if(Notification.permission === "granted"){
        //new Notification("Hola, si soporta las notificaciones");
        enviarNotificaciones();

    }else if(Notification.permission !== "denied" || Notification.permission === "default"){
        Notification.requestPermission(resultado => {
            console.log("Permiso: ", resultado);
            if(resultado === "granted"){
                // new Notification("Hola, si tenemos permisos")
                enviarNotificaciones();
            }
        })
    }
}

mostrarNotificaciones();

const obtenerLlaves = () => {
    return fetch("http://localhost:3001/api/key")
        .then(res => res.arrayBuffer())
        .then( llave => new Uint8Array( llave))
}
obtenerLlaves().then( console.log);

const verificarSuscripcion = (estanActivadas) => {
    if(estanActivadas){
        console.log("Notificaciones activadas");
        document.querySelector("#btnActivar").disabled = true;
        document.querySelector("#btnDesactivar").disabled = false;
    }else{
        console.log("Notificaciones desactivadas");
        
        document.querySelector("#btnActivar").disabled = false;
        document.querySelector("#btnDesactivar").disabled = true;
    }
}

const activarSuscripcion = () => {
    navigator.serviceWorker.ready.then( swRegistrado => {
        obtenerLlaves().then(llave => {
            swRegistrado.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: llave
            })
            .then( respuesta => respuesta.toJSON())
            .then( suscripcion => {
                console.log("Suscripcion: ", suscripcion);
                //verificarSuscripcion( suscripcion );
                fetch("http://localhost:3001/api/suscribe", {
                    method: "POST",
                    body: JSON.stringify(suscripcion),
                    headers: {
                        "Content-Type":"application/json"
                    }
                })
                .then( verificarSuscripcion )
                .catch( desactivarSuscripcion )
            })
            .catch(error => {
                console.log("Fallo activar suscripcion: ", error);
                desactivarSuscripcion();
            })
        })
    })
}

const desactivarSuscripcion = () => {
    navigator.serviceWorker.ready.then( swRegistrado =>{
        swRegistrado.pushManager.getSubscription().then( suscripcion => {
            suscripcion.unsubscribe().then(() => verificarSuscripcion(false))
        })
    })
}