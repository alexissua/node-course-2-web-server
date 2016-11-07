const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

// ENV almacena todas las variables globales del sistema.
// En este caso solo necesitamos obtener el puerto. PORT::
const port = process.env.PORT || 3100;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");

// Configuramos Express para que use como gestor de templates a HBS::
app.set("View engine", "hbs");

// Así es como se inician los Middleware::
// Si hacemos algo asincrono, el Middleware no finalizará al menos que se le indique NEXT::
// Esto se ejecutará solo al hacer el request del app::
app.use(function(request, response, next){
	
	var now = new Date().toString();
	var log = `${now}: ${request.method} ${request.url}`;
	console.log(log);
	fs.appendFile("server.log", log + "\n", function(error){
		if (error){
			console.log("Unable to append to server log.");
		}
	});

	next();
});

// Si en el middleware no usamos el next el app solo ejecutará hasta esta función
// lo que resta del código no será ejecutado al menos que usemos next()::
/* 
app.use(function(request, response, next){

	response.render("maintenance.hbs", {
		pageTitle: "We'll be right back.",
		pageText: "This site is currently updated..."
	});

});
*/

// Indicamos a Node que este dominio lo puede mostrar y ejecutar::
app.use(express.static(__dirname + "/public"));


// Los helpers son funciones que se ejecutan dentro de los templates HBS::
// De esta forma el año por ejemplo, lo calculamos acá y lo visualizamos en cada template::
hbs.registerHelper('getCurrentYear', function(){
	return new Date().getFullYear();
});

hbs.registerHelper("screamIt", function(text){
	return text.toUpperCase();
});

app.get('/', function(request, response){

	//Esto es lo que verán los usuarios al hacer un http request o al hacer un request del API (body)::
	/*response.send("<h1>Hello express</h1>");
	response.send({
		name: "Alexis",
		likes: [
			"Swimming",
			"Running"
		]
	});*/

	response.render("home.hbs", {
		pageTitle: "Home page",
		welcomeMessage: "Hello World.. This is my brand new website!!"
	});
});

app.get("/about", function(request, response){
	// Le indicamos a Node que el url /about hará el render de about.hbs::
	response.render("about.hbs", {
		pageTitle: "About page"
	});
});

app.get("/bad", function(request, response){
	response.send({
		errorMessage: "Fuck!! Something went wrong."
	});
});


// Indicamos el puerto que usará el servidor::
app.listen(port, function(){
	console.log(`Server is up on port ${port}`);
});