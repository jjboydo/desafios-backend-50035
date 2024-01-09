const fs = require('fs')

class ProductManager {
    constructor() {
        this.path = "./products.json"
        this.products = this.getProducts()
        this.lastId = this.loadLastId()
    }

    loadLastId() {
        if (fs.existsSync('id.json')) {
            let idString = fs.readFileSync('id.json', 'utf8')
            return JSON.parse(idString)
        } else {
            return 1
        }
    }

    saveLastId() {
        let idString = JSON.stringify(this.lastId)
        fs.writeFileSync('id.json', idString)
    }

    #validateCode(code) {
        if (!this.products) {
            return
        }
        const result = this.products.some(product => product.code === code)
        if (result) throw new Error("There is already a product with that code")
    }

    #validateProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product
        const isValid = title && description && price && thumbnail && code && stock
        if (!isValid) throw new Error("The product is not valid")
    }

    writeFile(array, path) {
        let productsString = JSON.stringify(array, null, '\t')
        fs.writeFileSync(path, productsString)
    }

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product
        this.#validateCode(code)
        this.#validateProduct(product)
        const newProduct = {
            id: this.lastId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products.push(newProduct)
        this.writeFile(this.products, this.path)
        this.saveLastId()
        console.log("Producto agregado correctamente!")
    }

    getProducts() {
        const productsString = fs.readFileSync(this.path, 'utf8')
        if (!productsString) {
            return []
        }
        return JSON.parse(productsString)
    }

    getProductsById(productId) {
        const productExists = this.products.find(product => product.id === productId)
        return productExists || "Error! Not found"
    }

    updateProduct(productId, fieldsToUpdate) {
        const productExists = this.products.findIndex(product => product.id === productId)
        if (productExists === -1) {
            throw new Error("Error! Product Not found")
        }
        this.#validateCode(fieldsToUpdate.code)
        Object.assign(this.products[productExists], fieldsToUpdate)
        this.writeFile(this.products, this.path)
        console.log("Producto modificado correctamente!")
    }

    deleteProduct(productId) {
        const productsFilter = this.products.filter(product => product.id !== productId)
        if (productsFilter.length === this.products.length) {
            throw new Error("Error! Product Not found")
        }
        this.writeFile(productsFilter, this.path)
        return "Producto eliminado correctamente!"
    }
}

// TEST

const productManager = new ProductManager()

console.log('getProducts debería devolver un array vacío')
console.log(productManager.getProducts().length === 0 ? '✔' : '❌')

console.log('addProduct debería agregar un producto exitosamente')
const product = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}
productManager.addProduct(product)
console.log(productManager.getProducts())
console.log(productManager.getProducts().length === 1 ? '✔' : '❌')


console.log('getProductById debería devolver el producto con el id especificado')
console.log(productManager.getProductsById(1))
console.log('getProductById debería devolver por consola un error de producto no existente')
console.log(productManager.getProductsById(22))

console.log('updateProduct debería actualizar un campo del producto')
const updatedProduct = {
    title: 'Producto modificado',
    description: 'Este es un producto que fue modificado',
}
productManager.updateProduct(1, updatedProduct)
console.log(productManager.getProductsById(1))
console.log('updateProduct debería tirar un error si el producto a modificar no existe')
productManager.updateProduct(22, updatedProduct)
console.log('updateProduct debería tirar un error si el campo a modificar es code, y ya existe un code igual')
const updatedCode = {
    code: 'abc123',
}
productManager.updateProduct(1, updatedCode)

console.log('deleteProduct debería eliminar un producto')
productManager.deleteProduct(1)
console.log(productManager.getProducts().length === 0 ? '✔' : '❌')
console.log('deleteProduct debería arrojar un error si el producto no existe')
productManager.deleteProduct(22)
