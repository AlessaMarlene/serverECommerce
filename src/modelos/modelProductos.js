const fs = require('fs').promises;
const moment = require("moment");

module.exports = class Productos {
    constructor() {
        this.filePath = './src/data/productos.txt';
        this.data = [];
        this.id = 0;
    }
    async getAll() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");  
            if (data) {
                this.data = JSON.parse(data); 
                this.data.map((product) => this.id < product.id ? this.id = product.id : "");
                return this.data;
            }
        } catch (error) {
            if (error.code == 'ENOENT'){
                await fs.writeFile(this.filePath, '');
                return [];
            }
        }
    }

    async saveProduct(product){
        try{
            const content = await this.getAll();
            this.id++;
            const addNewProduct = {
                id: this.id,  
                timestamp: moment().format('L LTS'),
                nombre: product.nombre,
                descripcion: product.descripcion,
                codigo: product.codigo,
                foto: product.foto,
                precio: product.precio,
                stock: product.stock
            }
            content.push(addNewProduct);
            await fs.writeFile(this.filePath, JSON.stringify(content, null, 2));
        } catch(error){
            throw new Error("Se produjo un error al guardar el producto : " +  error.message);
        }
    }

    async getById(id) {
        await this.getAll();
        const productById = this.data.find((prod) => prod.id === parseInt(id));

        if (productById) return productById;
        else throw new Error(`No se encontro el producto con id: ${id}`);
    }  

    async  updateProduct(id, product) {
        const content = await this.getAll();
        const productById = content.find((prod) => prod.id === parseInt(id));
        if (productById) {
            const updProduct = {
                id: parseInt(id), 
                timestamp: moment().format('L LTS'),
                nombre: product.nombre,
                descripcion: product.descripcion,
                codigo: product.codigo,
                foto: product.foto,
                precio: product.precio,
                stock: product.stock
            }
            const index = content.findIndex((prod) => prod.id === parseInt(id));
            content[index] = updProduct;
            await fs.writeFile(this.filePath, JSON.stringify(content, null, 2));
            return updProduct;
        } else throw new Error(`No se encontro el producto con id: ${id}`);
    }

    async borrar(id) {
        const todosLosProductos = await this.getAll();
        const deleteIndex = todosLosProductos.findIndex((product) => product.id == parseInt(id));
        
        if (deleteIndex != -1) {
            todosLosProductos.splice(deleteIndex, 1);
            await fs.writeFile(this.filePath, JSON.stringify(todosLosProductos, null, 2));
        }
        return 1;
    }
}