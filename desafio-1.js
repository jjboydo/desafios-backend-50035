class ProductManager {
    constructor(){
        this.products = []
    }

    #validateCode(code) {
        return this.products.some(product => product.code === code)
    }

    addProduct(product){
        const {title, description, price, thumbnail, code, stock} = product
        const validateProduct = title && description && price && thumbnail && code && stock
        if(!validateProduct || this.#validateCode(code)){
            return "Error al añadir producto!"
        }
        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products = [...this.products, newProduct]
        return "Producto agregado correctamente!"
    }

    getProducts(){
        return this.products
    }

    getProductById(productId){
        const productExists = this.products.find(product => product.id === productId)
        return productExists || "Error! Not found"
    }

}