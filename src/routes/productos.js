const express = require("express");
const router = express.Router();
const Productos = require("../modelos/modelProductos");
const auth = require("../middlewares/auth");
const admin = Boolean(true);
const prods = new Productos();

router.get("/", async (req, res) => {
    try {
        const products = await prods.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:id', async (req,res)=> {
    const id = req.params.id;
    const producto = await prods.getById(id);

    if(producto) res.status(200).json(producto);
    else res.status(404).json({error: 'Producto no encontrado'});
})

router.post('/', auth(admin), async  (req,res)=> {
    try {
        const productoNuevo = await  prods.saveProduct(req.body);
        res.status(201).json(productoNuevo);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.put("/:id", auth(admin), async (req, res) => {
    try {
        const actualizarProducto = await prods.updateProduct(req.params.id, req.body);
        res.status(200).json(actualizarProducto);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete("/:id", auth(admin), async (req, res) => {
    try {
        const deleteProduct = prods.borrar(req.params.id);
        res.json(deleteProduct);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;