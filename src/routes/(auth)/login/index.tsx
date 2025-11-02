import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { loginUser } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/authContext';



export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
})

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const {setAccessToken, setUser} = useAuth()
    const navigate = useNavigate()

    const {mutateAsync, isPending} = useMutation({
      mutationFn: loginUser,
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
        navigate({to: '/ideas'})
      },
      onError: (err: any) => {
        setError(err.message)
      }
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      mutateAsync({email, password})
    } catch (err: any) {
      console.log(err)
    }
  }
  return (
    <div className='max-w-md mx-auto'>
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {
            error && <div className='bg-red-100 text-red-700 px-4 py-2 rounded mb-4'>
                {error}
            </div>
        }
        <form onSubmit={handleSubmit} className="form space-y-4">
           
            <input 
            type="email" 
            placeholder='Email'
             value={email} onChange={(e) => {setEmail(e.target.value)}} 
             autoComplete='off' 
             className="w-full border border-gray rounded-md p-2" 
             />
            <input 
            type="password" 
            placeholder='Password'
             value={password} onChange={(e) => {setPassword(e.target.value)}} 
             autoComplete='off'
              className="w-full border border-gray rounded-md p-2"
               />
            <button 
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50">
                {isPending ? "Logging in..." : "Login"}
            </button>
        </form>

        <p className="tex-sm text-center mt-4">
            Do not have an account yet? 
            <Link to='/register' className='text-blue-600 hover:text-blue-700 font-medium'> Register
            </Link>
        </p>
    </div>
  )
}
