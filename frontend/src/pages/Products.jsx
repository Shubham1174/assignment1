import api from '../api/client.js';
import { useEffect, useState } from 'react';
import { useCart } from '../store/cart.js';
import { Link } from 'react-router-dom';

export default function Products() {
  const [items, setItems] = useState([]);
  const { addItem } = useCart();
  useEffect(() => {
    api.get('/products').then((r) => setItems(r.data));
  }, []);
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((p) => (
        <div key={p._id} className="border p-4">
          <h3 className="font-semibold"><Link to={`/product/${p._id}`}>{p.name}</Link></h3>
          <p>{p.category}</p>
          <p>${p.price}</p>
          <button className="mt-2 bg-blue-600 text-white px-3 py-1" onClick={() => addItem(p, 1)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}


