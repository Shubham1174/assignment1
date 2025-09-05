import api from '../api/client.js';
import { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="border p-4">
            <div className="font-semibold mb-2">{o.status} - ${o.totalAmount}</div>
            <ul className="list-disc ml-6">
              {o.products.map((p, idx) => (
                <li key={idx}>{p.productId} x {p.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}


