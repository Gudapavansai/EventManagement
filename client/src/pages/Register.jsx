import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 className="text-center mb-6" style={{ fontSize: '2rem' }}>Create Account</h1>
                
                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                            placeholder="Enter your full name"
                        />
                    </div>

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
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-4">
                        Create Account
                    </button>
                </form>

                <p className="text-center text-muted">
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
