import Hero from '../components/Hero.jsx';
import ProductList from './ProductList.jsx';

export default function Home() {
  return (
    <div>
      <Hero />
      <h2 className="section-title">Featured</h2>
      <ProductList featuredOnly />
    </div>
  );
}


