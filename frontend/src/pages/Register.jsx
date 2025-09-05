import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../store/auth.js';
import { useNavigate } from 'react-router-dom';

const Schema = Yup.object({
  name: Yup.string().min(2).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  role: Yup.string().oneOf(['admin', 'customer']).required()
});

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <Formik
        initialValues={{ name: '', email: '', password: '', role: 'customer' }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          await register(values);
          navigate('/');
        }}
      >
        <Form className="space-y-4">
          <Field name="name" placeholder="Name" className="border p-2 w-full" />
          <Field name="email" placeholder="Email" className="border p-2 w-full" />
          <Field name="password" type="password" placeholder="Password" className="border p-2 w-full" />
          <Field as="select" name="role" className="border p-2 w-full">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </Field>
          <div className="pt-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Register</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}


