
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function BD(){
  var cliente = mysql.createClient({
    user: 'root',
    password: 'pilmee',
    host: 'localhost',
    port: 3306,
    database: 'ninjacode'
  });
  return cliente;
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/guardar', function(req, res){
  var objBD = BD();
  objBD.query("INSERT INTO `publicacion`(`contenido`) VALUES ('" + req.body.txtPublicacion + "')", function(error){
    if(error){
      console.log(error.message);
    }else{
      console.log('Insertado');
    }
  });

  res.send(req.body.txtPublicacion);
  res.end();
});

app.get('/consultar', function(req, res){
  
  var objBD = BD();
  objBD.query("SELECT * FROM publicacion", function(error, resultado, fila){
    res.render('consultar',  { title: 'Consultar', datos: resultado });
  });
  
  
  //res.end();
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
