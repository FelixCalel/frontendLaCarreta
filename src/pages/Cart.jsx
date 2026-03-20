import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'

function Cart() {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="page cart-page empty-cart">
        <h1>Carrito de compras</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/products" className="btn-primary">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <h1>Carrito de compras</h1>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>S/ {item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-controls">
              <button
                onClick={() =>
                  dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                }
              >
                +
              </button>
              <button
                className="btn-remove"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p className="cart-total">Total: S/ {total.toFixed(2)}</p>
        <button className="btn-primary" onClick={() => alert('¡Pedido confirmado!')}>
          Confirmar pedido
        </button>
        <button className="btn-secondary" onClick={() => dispatch(clearCart())}>
          Vaciar carrito
        </button>
      </div>
    </div>
  )
}

export default Cart
