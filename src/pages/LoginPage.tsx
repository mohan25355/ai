import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    defaultValues: { username: '', password: '' }
  });

  const signupForm = useForm<LoginForm>({
    defaultValues: { username: '', password: '' }
  });

  async function onLogin(data: LoginForm) {
    setLoading(true);
    try {
      const { error } = await signInWithUsername(data.username, data.password);
      if (error) {
        toast.error(error.message || 'Login failed');
        return;
      }
      toast.success('Login successful');
      const from = (location.state as any)?.from || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(data: LoginForm) {
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUpWithUsername(data.username, data.password);
      if (error) {
        toast.error(error.message || 'Signup failed');
        return;
      }
      toast.success('Account created! Logging you in...');
      // Auto login after signup
      await signInWithUsername(data.username, data.password);
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
              CM
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">CivicMind AI</h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Administrator Access</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      rules={{ required: 'Username is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      rules={{ required: 'Password is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="username"
                      rules={{ 
                        required: 'Username is required',
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: 'Only letters, numbers, and underscores allowed'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      rules={{ 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Choose a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      First user will be assigned admin role automatically
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-primary hover:underline">
                ← Back to Public Site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
