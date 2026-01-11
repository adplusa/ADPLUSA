import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('🔐 Attempting login with:', { username, password: '***' });

    try {
      console.log('📡 Making API call to login...');
      const result = await login({ username, password });

      console.log('✅ Login API response:', result);

      // Extract token and user from the nested data structure
      const { token, user } = result.data;

      console.log('🎫 Extracted token:', token ? 'Present' : 'Missing');
      console.log('👤 Extracted user:', user);

      dispatch(setCredentials({ token, user }));

      console.log('💾 Credentials dispatched to Redux store');
      console.log('🗄️ localStorage token:', localStorage.getItem('token'));
      console.log('🗄️ localStorage user:', localStorage.getItem('user'));

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      console.error('📄 Error response:', err.response?.data);

      // Extract error message from response
      const errorMessage = err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const errorMessage = error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}