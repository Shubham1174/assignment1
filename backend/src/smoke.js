// smoke.js
import axios from 'axios';

const base = 'http://localhost:5000/api';

async function run() {
	const pwd = 'Passw0rd!';
	const adminEmail = 'admin.smoke@test.com';
	const customerEmail = 'cust.smoke@test.com';

	const client = axios.create({ baseURL: base, validateStatus: () => true });

	async function loginOrRegisterAdmin() {
		let res = await client.post('/auth/login', { email: adminEmail, password: pwd });
		if (res.status !== 200) {
			await client.post('/auth/register', { name: 'Admin', email: adminEmail, password: pwd, role: 'admin' });
			res = await client.post('/auth/login', { email: adminEmail, password: pwd });
		}
		return res.data.token;
	}

	async function loginOrRegisterCustomer() {
		let res = await client.post('/auth/login', { email: customerEmail, password: pwd });
		if (res.status !== 200) {
			await client.post('/auth/register', { name: 'Customer', email: customerEmail, password: pwd, role: 'customer' });
			res = await client.post('/auth/login', { email: customerEmail, password: pwd });
		}
		return res.data.token;
	}

	const adminToken = await loginOrRegisterAdmin();
	const customerToken = await loginOrRegisterCustomer();

	// Create product as admin
	const pRes = await client.post('/products', { name: 'Pen', description: 'Blue Pen', price: 1.99, category: 'Stationery' }, { headers: { Authorization: `Bearer ${adminToken}` } });
	if (pRes.status !== 201) throw new Error('Failed to create product: ' + pRes.status + ' ' + JSON.stringify(pRes.data));
	const productId = pRes.data._id;

	// List products
	const list = await client.get('/products');
	if (list.status !== 200 || !Array.isArray(list.data)) throw new Error('Failed to list products');

	// Place order as customer
	const oRes = await client.post('/orders', { products: [{ productId, quantity: 2 }] }, { headers: { Authorization: `Bearer ${customerToken}` } });
	if (oRes.status !== 201) throw new Error('Failed to create order: ' + oRes.status + ' ' + JSON.stringify(oRes.data));

	// Admin lists all orders
	const oaRes = await client.get('/orders', { headers: { Authorization: `Bearer ${adminToken}` } });
	if (oaRes.status !== 200 || !Array.isArray(oaRes.data)) throw new Error('Failed to list orders');

	console.log(JSON.stringify({ ok: true, productId, orderId: oRes.data._id, ordersCount: oaRes.data.length }));
}

run().catch((e) => {
	console.error('SMOKE_FAILED', e?.response?.status, e?.response?.data || e.message);
	process.exit(1);
});
