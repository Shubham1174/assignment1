import api from '../api/client.js';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../store/cart.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data));
  }, [id]);
  if (!product) return null;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="font-semibold">${product.price}</p>
      <button className="mt-2 bg-blue-600 text-white px-3 py-1" onClick={() => addItem(product, 1)}>Add to Cart</button>
    </div>
  );
}


