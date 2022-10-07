import express from "express";
import Producto from "../clases/Producto.class.js";

const router = express.Router();//instancia de router

const producto = new Producto();//instancia de producto

function validarAdmin(req, res, next) {
	if (req.query.admin) {
		next();
	} else {
		res.send("usted no tiene acceso");
	}
}
//post envia por medio de body
router.post("/", validarAdmin, (req, res) => {
	console.log(req.body);//body: recibe los datos del producto nuevo
	const productoCreado = producto.guardar(req.body);//llamado a la clase guardar de producto.class.js
	res.send(productoCreado);
});

router.delete("/:id", validarAdmin, (req, res) => {
	const productoBorrado = producto.borrar(req.params.id);
	res.send(productoBorrado);
});

router.get("/", (req, res) => {
	const listaProductos = producto.listarAll();
	res.send(listaProductos);
});

router.get("/:id", (req, res) => {
	const productoBuscado = producto.listar(req.params.id);
	res.send(productoBuscado);
});
export default router;
