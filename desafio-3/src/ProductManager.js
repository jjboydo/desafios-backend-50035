import fs from 'fs/promises'

export default class ProductManager {
    constructor() {
        this.path = "./products.json"
        this.loadProducts()
    }

    async loadProducts() {
        this.products = await this.getProducts()
    }

    #validateCode(code) {
        if (!this.products) return
        const result = this.products.some(product => product.code === code)
        if (result) throw new Error("There is already a product with that code")
    }

    #validateProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product
        const isValid = title && description && price && thumbnail && code && stock
        if (!isValid) throw new Error("The product is not valid")
    }

    async writeToFile(array, path) {
        try {
            let productsString = JSON.stringify(array, null, '\t');
            await fs.writeFile(path, productsString);
        } catch (error) {
            console.error('Error writing products file:', error);
        }
    }

    async addProduct(product) {
        try {
            await this.loadProducts()
            this.#validateCode(product.code)
            this.#validateProduct(product)
            const maxProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0
            const newProductId = maxProductId + 1
            const newProduct = {
                id: newProductId,
                ...product
            }
            this.products.push(newProduct)
            await this.writeToFile(this.products, this.path)
            console.log("Producto agregado correctamente!")
        } catch (error) {
            console.error('Error adding a product:', error)
        }
    }

    async getProducts() {
        try {
            const productsString = await fs.readFile(this.path, 'utf8')
            if (!productsString) {
                return []
            }
            return JSON.parse(productsString)
        } catch (error) {
            console.error('Error reading product file: ', error)
            return []
        }
    }

    getProductsById(productId) {
        const productExists = this.products.find(product => product.id === productId)
        return productExists || "Error! Not found"
    }

    async updateProduct(productId, fieldsToUpdate) {
        try {
            const productExists = this.products.findIndex(product => product.id === productId)
            if (productExists === -1) {
                throw new Error("Product Not found")
            }
            this.#validateCode(fieldsToUpdate.code)
            Object.assign(this.products[productExists], fieldsToUpdate)
            await this.writeToFile(this.products, this.path)
            console.log("Producto modificado correctamente!")
        } catch (error) {
            console.error('Error modifying product file: ', error)
        }
    }

    async deleteProduct(productId) {
        try {
            const productsFilter = this.products.filter(product => product.id !== productId)
            if (productsFilter.length === this.products.length) {
                throw new Error("Product Not found")
            }
            this.products = productsFilter
            await this.writeToFile(this.products, this.path)
            console.log("Producto eliminado correctamente!")
        } catch (error) {
            console.error('Error deleting a product: ', error)
        }
    }
}