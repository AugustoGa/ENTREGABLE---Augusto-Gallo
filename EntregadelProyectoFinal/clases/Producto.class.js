export default class Producto {
	static productos = [];
	constructor() {
		this.id = 0 ;
	}
//lista por ID buscando en el array productos y devuelve el id del producto
	listar(id) {
		let producto = Producto.productos.find((prod) => prod.id == id);
		return producto || { error: "producto no encontrado" };
	}

	listarAll() {
		return Producto.productos.length
			? Producto.productos
			: { error: "no hay productos cargados" };
	}
//guarda un producto y le genera un id
	guardar(prod) {
		prod.id = ++this.id;
		prod.timeStamp = Date.now();//devuelve una indicación de fecha y hora a partir de un valor o par de valores
		Producto.productos.push(prod);
		return prod;
	}

	actualizar(prod, id) {
		prod.id = Number(id);
		let index = Producto.productos.findIndex((prod) => prod.id == id);
		Producto.productos.splice(index, 1, prod);//cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
	}
//recibe y busca prod por su ID, x findIndex devuelve el indice y lo borra
	borrar(id) {
		let index = Producto.productos.findIndex((prod) => prod.id == id);
		return Producto.productos.splice(index, 1); //cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
	}
}