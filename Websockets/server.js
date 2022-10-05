const express = require("express");// importamos express para levantar el servidor
const router = express.Router();//router de express para hacer uso de sus funciones
const app = express();// inicializamos y asignamos su funciones a la variable app
const { Server: IOServer } = require ("socket.io");// traemos el objeto Server y lo llamamos IOServer, el cual (Server) proviene de la librería socket.io.
const { Server: HttpServer } = require ("http");// con http. Módulo nativo el cual permite crear servidores
const httpServer = new HttpServer(app);//instanciamos la clase que trabaja con dicho protocol
const io = new IOServer(httpServer);// instanciamos el server para que trabajen en conjunto el protocolo socket + http (por debajo)
const PORT = 8080;
//const handlebars = require("express-handlebars");//importamos handlebars framework web de datos en plantillas
const Contenedor = require("./api/productos.js");

app.use(express.json());//middleware, metodo para reconocer el objeto de solicitud entrante como un objeto JSON 
app.use(express.urlencoded({ extended: true }));//middleware, metodo para reconocer el objeto de solicitud entrante como cadenas o matrices

const messages = [];//arreglos vacíos para inyectarles información (se guardan los mensajes)
const productos = new Contenedor();//arreglos vacíos para inyectarles información (Método)
//--------------------------------------------
//config de ejs

app.set("view engine", "ejs");
app.set("views", "./views");
//--------------------------------------------

//recurso estatico
app.use(express.static("public"));
// invocacion router de express
app.use("/", router);
//definir a dónde y a qué pegarle cuando se haga un POST
router.post("/", (req, res) => {
	const producto = req.body;
	productos.post(producto);
	res.redirect("/");
});

// io.on = definimos todo lo relacionado al servidor del soctket (exponemos su ID ,  indicamos dónde van a estar los mensajes, pusheamos la data para que despues sea renderizada)
io.on("connection", (socket) => {
	console.log('Usuario con id: ', socket.id, ' se ha conectado');

	// Socket chat
	socket.emit("messages", messages);

	socket.on("new-message", (data) => {
		data.date = new Date().toLocaleDateString()
		messages.push(data);

		
		io.sockets.emit("messages", messages);

	});

	// Socket productos

	socket.emit("productList", productos.itemList )

	socket.on("newProduct", (data) => {
		let producto = productos.getAll();
		productos.post(producto)
		io.sockets.emit("productList", productos.itemList)
	})

})

httpServer.listen(PORT, () => console.log("server levantado"))