const fs = require('fs').promises;
const moment = require('moment');

module.exports = class Carrito {
    constructor() {
        this.filePath = './src/data/carrito.txt';
        this.cart = [];
        this.id = 1;
    }

    async getAllCart() {
        try{
            const contenidoCarrito = await fs.readFile(this.filePath);

            if(contenidoCarrito.toString() != ''){
                this.cart = JSON.parse(contenidoCarrito);
                this.id = this.cart[this.cart.length -1].id + 1;
            }

            return this.cart;
        }catch(err){
            if( err.code == "ENOENT"){
                fs.writeFile(this.filePath,'');
                return [];
            }
        }
    }

    async createCart() {
        const contenidoCarrito = await this.getAllCart();
        const nuevoCart = {
            id: this.id, 
            timestamp: moment().format('L LTS'),
            products: []
        };
        contenidoCarrito.push(nuevoCart);
        await fs.writeFile(this.filePath, JSON.stringify(contenidoCarrito ,null, 2));
        return nuevoCart;
    }

    async deleteCart(idCarrito) { 
        const contenidoCarrito = await this.getAllCart();
        const itemIndex = contenidoCarrito.findIndex((cart) => cart.id === parseInt(idCarrito));

        if (itemIndex === -1 ){
            return -1;
        } else{
            const deleteData = contenidoCarrito.splice(itemIndex,1);
            await fs.writeFile(this.filePath, JSON.stringify(contenidoCarrito ,null, 2));
            return deleteData;
        }
    }

    async listProductsInCart(idCarrito) {
        const contenidoCarrito = await this.getAllCart();
        const cartPorId = contenidoCarrito.find(cart => cart.id == parseInt(idCarrito));
        return cartPorId.products;
    }

    async addProductInCart(idCarrito, product) {
        const contenidoCarrito = await this.getAllCart();
        const cartPorId = contenidoCarrito.find(cart => cart.id == parseInt(idCarrito));
        if (cartPorId) {
            cartPorId.products.push(product);
            await fs.writeFile(this.filePath, JSON.stringify(contenidoCarrito ,null, 2));
            return cartPorId;
        }else {
            throw new Error("No se encontró el carrito");
        }
    }
    
    async deleteProductInCart(idCarrito, idProducto) {
        const contenidoCarrito = await this.getAllCart();
        const cartPorId = contenidoCarrito.find(cart => cart.id == parseInt(idCarrito));
        if(cartPorId){
            const cartIndex = contenidoCarrito.findIndex((cart) => cart.id === parseInt(idCarrito));
            const deleteI = cartPorId.products.findIndex((prod) => prod.id === parseInt(idProducto));
            if (deleteI != -1 ){
                cartPorId.products.splice(deleteI,1);
                contenidoCarrito[cartIndex] = cartPorId;
                await fs.writeFile(this.filePath, JSON.stringify(contenidoCarrito ,null, 2));
                return cartPorId;
            }
        }else {
            throw new Error("No se encontró el carrito");
        }
    }
}