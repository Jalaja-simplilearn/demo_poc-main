
class ProductService{
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    this.products.push(product);
  }

  removeProduct(productId) {
    this.products = this.products.filter(product => product.id !== productId);
  }

  calculateDiscount(price, discount) {
    return price - (price * (discount / 100));
  }

  calculateTotalPrice() {
    return this.products.reduce((total, product) => {
      return total + this.calculateDiscount(product.price, product.discount);
    }, 0);
  }

  filterProductsByPrice(priceThreshold) {
    return this.products.filter(product => product.price <= priceThreshold);
  }

  findProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  updateProduct(updatedProduct) {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }
}
  