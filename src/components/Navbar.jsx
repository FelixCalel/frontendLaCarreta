import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🛒 La Carreta</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/cart">
          Carrito {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Hola, {user?.name}</span>
            <button onClick={() => dispatch(logout())} className="btn-logout">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
