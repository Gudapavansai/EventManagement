import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 className="text-center mb-6" style={{ fontSize: '2rem' }}>Welcome Back</h1>
                
                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-4">
                        Sign In
                    </button>
                </form>

                <p className="text-center text-muted">
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
