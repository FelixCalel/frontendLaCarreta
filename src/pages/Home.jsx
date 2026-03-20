import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <h1>Bienvenido a La Carreta</h1>
        <p>Los mejores productos frescos directo a tu puerta.</p>
        <Link to="/products" className="btn-primary">
          Ver productos
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🥩</span>
          <h3>Productos frescos</h3>
          <p>Seleccionados cada día para garantizar la mejor calidad.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🚚</span>
          <h3>Delivery rápido</h3>
          <p>Recibe tu pedido en menos de 24 horas.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💳</span>
          <h3>Pago seguro</h3>
          <p>Múltiples métodos de pago disponibles.</p>
        </div>
      </section>
    </div>
  )
}

export default Home
