const express = require("express");
const Contenedor = require('./models/productsModel')
const Mensajes = require('./models/messageModel')
const ProductDao = require("./DAOs/Product.dao.class");
const MessageDao = require("./DAOs/Message.dao.class");
const prodRouter = require("./routes/prodRouter");
const { faker } = require("@faker-js/faker");

const router = express.Router();
const app = express();
require("dotenv").config();


const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

const prod = new ProductDao();
const msg = new MessageDao();

// Conectamos websocket
io.on("connection", async (socket) => {
    console.log('Usuario con id: ', socket.id, ' se ha conectado')

    let productos = await prod.getAll();
    let mensajes = await msg.normalize();
    // Socket Chat
    socket.emit('messages', mensajes);

    // Mensajes mostrados correctamente.
    socket.on("new-message", async (data) => {
        await msg.createData(data);
        console.log(data)

        io.sockets.emit("messages", mensajes);
    });

    // Socket productos
    socket.emit("productList", productos);


    socket.on("newProduct", async (data) => {
        await prod.createData(data);

        io.sockets.emit("productList", productos)
    })
    socket.on("randomProduct", async (data) => {
        await prod.createData(data);

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
app.use("/api/productos-test", prodRouter);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/api/productos-test", (req, res) => {
    let response = [];
    for (let index = 0; index <= 5; index++) {
        response.push({
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image()
        });
    }

    res.render('test.ejs', { response: response })
})
router.post("/", (req, res) => {
    const producto = req.body;
    prod.createData(producto);
    console.log(`Router ${producto}`);
    res.redirect("/");
});

prodRouter.post("/", async (req, res) => {
    let response = [];
    for (let index = 0; index <= 5; index++) {
        response.push({
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image()
        });
    }
    console.log(response)
    prod.createData(response)
    res.redirect("/api/productos-test");
});

httpServer.listen(PORT, () => console.log("servidor Levantado"));