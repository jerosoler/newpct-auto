# Discontinued
Nuevo proyecto https://github.com/jerosoler/newpct-total 

# Newpct auto
Automatiza descargas de newpct a transmission. Notificaciones por telegram.

## Descargar
`git clone https://github.com/jerosoler/newpct-auto.git`

## Configurar Telegram
No hace falta configurar, solamente es para recibir notificaciones.

Crear un bot con BotFhater https://core.telegram.org/bots/

Consigue tu API TOKEN

Y consigue tu usuario enviando un mensage y busca el chat id en: https://api.telegram.org/botYOU_API_TOKEN/getUpdates

Modifica el fichero `config.js` con los datos obtenidos

## Instalación
Entramos al directorio

`cd newpct-auto`

Instalamos dependencias

`npm install`

Ejecutamos 

`node app.js`


## Configurar lista de descargas
No hace falta reiniciar la aplicación. 

Hay que modificar el archivo `busqueda.js` como muestran los ejemplos. 


