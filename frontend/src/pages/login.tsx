import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginProps {
  embedded?: boolean;
  onSuccess?: () => void;
}

const LoginForm = ({ embedded = false, onSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be actual auth logic
    console.log('Login', { email, password });
    if (onSuccess) onSuccess();
    else router.push('/dashboard');
  };

  return (
    <div className={embedded ? '' : 'min-h-screen flex items-center justify-center bg-gray-50'}>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
