import { useCart } from '../store/cart.js';
import api from '../api/client.js';

export default function Cart() {
  const { items, clear } = useCart();
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const checkout = async () => {
    await api.post('/orders', { products: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })) });
    clear();
    alert('Order placed');
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {items.map((i) => (
        <div key={i.product._id} className="flex justify-between border-b py-2">
          <span>{i.product.name} x {i.quantity}</span>
          <span>${(i.product.price * i.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="mt-4 font-semibold">Total: ${total.toFixed(2)}</div>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={checkout} disabled={!items.length}>Checkout</button>
    </div>
  );
}


