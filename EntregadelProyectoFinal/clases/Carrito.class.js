import Producto from "./Producto.class.js";
//instancia de producto
export default class Carrito {
	constructor() {
		this.producto = new Producto(); //inicializamos y de esa forma carrito tiene acceso a producto
		this.carritos = [];
		this.id = 1;
	}
//carrito especifico
	listar(id) {
		let prod = this.carritos.find((carr) => carr.id == id);
		return prod || { error: "carrito no encontrado" };
	}
//trae todos los carritos
	listarAll() {
		return this.carritos.length
			? this.carritos
			: { error: "no hay carritos cargados" };
	}

	crearCarrito() {
		const carr = { id: this.id++, timeStamp: Date.now(), productos: [] };//productos: [] : arreglo de productos individual para el carrito 
		this.carritos.push(carr);
		return carr;
	}
//recibe un id de producto(idProd) y de carrito(idCarrito)
	guardarProductoEnCarrito(idProd, idCarrito) {
		console.log(idProd);
		const producto = this.producto.listar(idProd);//uso de la intancia producto para el uso de sus metodos(listar)
		this.carritos.forEach((carro) => {//recorre el arreglo y compara el carro.id al id que recibe
			carro.id == idCarrito ? carro.productos.push(producto) : null;
		});
		return this.carritos;
	}

	actualizar(carr, id) {
		carr.id = Number(id);
		let index = this.carritos.findIndex((carr) => carr.id == id);
		this.productos.splice(index, 1, carr);
	}

	borrar(id) {
		let index = this.carritos.findIndex((carr) => carr.id == id);
		return this.carritos.splice(index, 1);
	}
}