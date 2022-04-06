const express =  require('express');
const router = express.Router();
const Carrito = require('../modelos/modelCarrito');
const nuevoCarrito = new Carrito();
const Productos = require("../modelos/modelProductos");
const productos = new Productos();

router.post('/', async (req, res) => {
    try {
        const carritoNuevo = await nuevoCarrito.createCart();
        res.status(201).json(carritoNuevo);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deleteCart = await nuevoCarrito.deleteCart(req.params.id);
        res.status(202).json(deleteCart);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get('/:id/productos', async (req, res) => {
    try {
        const prodEnCarritoPorId = await nuevoCarrito.listProductsInCart(req.params.id);
        res.status(200).json(prodEnCarritoPorId);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.post('/:id/productos', async (req, res) => {
    try {
        const product = await productos.getById(req.body.id);
        const addProduct = await nuevoCarrito.addProductInCart(req.params.id, product);
        res.status(201).json(addProduct);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.delete('/:idCarrito/productos/:idProducto', async (req, res) => {
    try {
        const deleteProduct = await nuevoCarrito.deleteProductInCart(req.params.idCarrito, req.params.idProducto);
        res.status(202).json(deleteProduct);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;