const FeedMe = require('feedme');
const fs = require('fs');
const http = require('http');
const crontab = require('node-crontab');
const request = require('request');
const cheerio = require('cheerio');
var exec = require('child_process').exec;

const config = require('./config');



telegram("Auto Downloader Start")




// INICIAMOS CRON
var jobId = crontab.scheduleJob("*/30 * * * *", function(){


var item_count = 0;
var next_item = true;
var last_item_feed = '';

//Borramos y volvemos a cargar fichero de nuevo
delete require.cache[require.resolve('./busqueda.js')]
var busqueda = require('./busqueda.js');


//Leemos el último feed leido
var lastitem =  fs.readFileSync("./lastitem.txt", 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
   return data;
});


//Funcion para buscar si existe la concidencia: Si existe devuelve True, si no false.
function SearchInList(lastitem) {
  var encontrado = false;
  for(i in busqueda) {
      var palabras_buscar = busqueda[i].length;
      var palabras_encontradas = 0;
      busqueda2 = busqueda[i]
      for (n in busqueda2) {
          var x = lastitem.indexOf(busqueda[i][n])
          if(x >= 0){
            palabras_encontradas++;
          }
      }
      if(palabras_buscar === palabras_encontradas) {
        encontrado = true;
      }
  }
  return encontrado;
}


//Leemos fichero
http.get('http://www.newpct.com/feed', function(res) {
      var parser = new FeedMe();


      parser.on('item', function(item) {
        next_item_item = true;
        // El primer item lo guardamos en variable
        if(item_count === 0) {
          last_item_feed = item.pubdate;
          }
        //Sumamos item
        item_count++;

        //Comprobamos si el Guardado en el archivo es igual que el actual
        if(new Date(lastitem).getTime() >= new Date(item.pubdate).getTime()) {

          next_item = false;
          next_item_item = false;
          //Dejamos de leer el feed para ir al Archivo END
          parser.emit("close");

        } else {
          // Comprobamos que no se ha cerrado el parseado ya que aveces devuelve algun valor más.
            if(next_item && next_item_item){
              console.log("LOG:" + lastitem + " - " + item.pubdate + "-" + new Date().getHours() + ":"+ new Date().getMinutes());
              //buscamos si esta entre los nuestros.
              var searchtrue = SearchInList(item.title);
              if(searchtrue) {
                //enviamos a torrent
                telegram("Encontrado: " + item.title);
                addtorrent(item.link, item.title);
              }
            }
        }

      });

      //Parseamos
      res.pipe(parser);

      //Fin de parsear
      parser.on('end', function() {
        //Guadamos el item en el archivo
        fs.writeFile("./lastitem.txt", last_item_feed, function (err) {
            if (err) {
              return console.log(err);
            }
          });

      });

      parser.on('close', function() {
        //Guadamos el item en el archivo
        fs.writeFile("./lastitem.txt", last_item_feed, function (err) {
            if (err) {
              return console.log(err);
            }
          });

      });

    });

}); // FIN crontab

function telegram(message) {
  if(config.telegram_enable){
    request('https://api.telegram.org/bot'+config.telegram_api_token+'/sendMessage?chat_id='+config.telegram_user+'&text='+message+'', function (error, response, body) {
      if(error){
        console.log('error:', error)
      }
    });
  }
}


function addtorrent(url, name) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);
      //var urltorrent = $("#content-torrent > a").attr("href");
      var textofiltrar = $("#tab1 script").html();
      var urltorrent = textofiltrar.match(/http:\/\/.*?\.html/);
      console.log(urltorrent);
      exec('transmission-remote -a ' + urltorrent, function (error, stdout, stderr) {
          if(error) {
           telegram("ERROR: "+name + " Type Error1:" + error);
         } else if(stderr) {
            telegram("ERROR: "+name + " Type Error2:" + stderr);
         } else if(stdout) {
            telegram("Descargando: "+name);
          }
      });
    }
  });
}
