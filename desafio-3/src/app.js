import express, { json } from "express"
import ProductManager from './ProductManager.js'

const PORT = 8080
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(json())

const productManager = new ProductManager("./products.json")

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit)
    const products = await productManager.getProducts()
    const getProducts = (!isNaN(limit) && limit > 0) ? products.slice(0, limit) : products
    res.json(getProducts)
})

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    const product = await productManager.getProductsById(productId)
    if (!product) res.status(404).json({ error: `Product ${productId} does not exist!` })
    res.json(product)
})

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))