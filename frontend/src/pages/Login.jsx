import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../store/auth.js';
import { useNavigate } from 'react-router-dom';

const Schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required()
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          await login(values.email, values.password);
          navigate('/');
        }}
      >
        <Form className="space-y-4">
          <Field name="email" placeholder="Email" className="border p-2 w-full" />
          <Field name="password" type="password" placeholder="Password" className="border p-2 w-full" />
          <div className="pt-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}


