const express = require("express");
const Contenedor = require('./models/productsModel')
const Mensajes = require('./models/messageModel')
const {options} = require('./connection');
const startTable = require('./models/tables');
const router = express.Router();
const app = express();


const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;


let prod = new Contenedor("productos", options.mysql);
let msg = new Mensajes("mensajes", options.sqlite3)

// Conectamos websocket
io.on("connection", async (socket) => {
    console.log('Usuario con id: ', socket.id, ' se ha conectado')

    let productos = await prod.getAll();
    let mensajes = await msg.getAll();
    // Socket Chat
    socket.emit('messages', mensajes);

    // Mensajes mostrados correctamente.
	socket.on("new-message", async (data) => {
		data.date = new Date().toLocaleDateString()
		mensajes.push(data);
        msg.addMessage(data);

        console.log(data)
		
		io.sockets.emit("messages", mensajes);
});

    // Socket productos
    socket.emit("productList", productos);


	socket.on("newProduct", async (data) => {
        await prod.addProduct(data);       

		io.sockets.emit("productList", productos)
	})

})

//establecemos la configuración de ejs

app.set("view engine", "ejs");
app.set("views", "./views");
//--------------------------------------------



app.use(express.static("./public"));
app.set("socketio", io);


app.use("/", router);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Agrega el producto a la base de datos mysql
router.post("/", (req, res) => {
	const producto = req.body;
	prod.addProduct(producto);
	res.redirect("/");
});

async function start(){
    const inicio =  new startTable();

    let prod = await inicio.prod();
    let mess = await inicio.mess();
}

// Crear las tablas
start();

httpServer.listen(PORT, () => console.log("servidor Levantado"));