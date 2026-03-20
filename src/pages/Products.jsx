import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductsStart,
  fetchProductsSuccess,
} from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Carne de res',
    description: 'Corte premium, ideal para parrilla.',
    price: 35.9,
    image: 'https://placehold.co/300x200?text=Carne+de+res',
  },
  {
    id: 2,
    name: 'Pollo entero',
    description: 'Pollo fresco de granja.',
    price: 22.5,
    image: 'https://placehold.co/300x200?text=Pollo',
  },
  {
    id: 3,
    name: 'Cerdo al por mayor',
    description: 'Lomo de cerdo fresco.',
    price: 28.0,
    image: 'https://placehold.co/300x200?text=Cerdo',
  },
  {
    id: 4,
    name: 'Costillas BBQ',
    description: 'Costillas listas para asar.',
    price: 45.0,
    image: 'https://placehold.co/300x200?text=Costillas',
  },
  {
    id: 5,
    name: 'Chorizo artesanal',
    description: 'Chorizo casero con especias naturales.',
    price: 18.0,
    image: 'https://placehold.co/300x200?text=Chorizo',
  },
  {
    id: 6,
    name: 'Pavo entero',
    description: 'Pavo fresco ideal para fechas especiales.',
    price: 60.0,
    image: 'https://placehold.co/300x200?text=Pavo',
  },
]

function Products() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProductsStart())
    dispatch(fetchProductsSuccess(SAMPLE_PRODUCTS))
  }, [dispatch])

  if (loading) return <p className="loading">Cargando productos...</p>
  if (error) return <p className="error">Error: {error}</p>

  return (
    <div className="page products-page">
      <h1>Nuestros Productos</h1>
      <div className="products-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Products
