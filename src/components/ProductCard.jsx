import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">S/ {product.price.toFixed(2)}</span>
          <button
            className="btn-add-cart"
            onClick={() => dispatch(addToCart(product))}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
