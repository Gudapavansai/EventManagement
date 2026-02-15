import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registering, setRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState(null); // 'success' | 'failed'

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Event not found');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const [isRegistered, setIsRegistered] = useState(false);
    
    // Check if user is already registered
    useEffect(() => {
        if (event && user) {
            // We need to check registration status. Since the single event API might not return user specific registration info,
            // we can either fetch user's events or check a specific endpoint.
            // For now, let's fetch user's events and check if this event ID exists there.
            const checkRegistration = async () => {
                try {
                     const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get('http://localhost:5000/api/events/mine', config);
                    const registered = data.find(reg => reg.event._id === id || reg.event === id);
                    if (registered) setIsRegistered(true);
                } catch (err) {
                    console.error("Error checking registration status", err);
                }
            };
            checkRegistration();
        }
    }, [event, user, id]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        setError('');
        setRegistrationStatus(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(`http://localhost:5000/api/events/${id}/register`, {}, config);
            setRegistrationStatus('success');
            setIsRegistered(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setRegistrationStatus('failed');
        } finally {
            setRegistering(false);
        }
    };
    
    // Allow cancellation from details page too
    const handleCancel = async () => {
         if(!window.confirm("Are you sure you want to cancel your registration?")) return;
         setRegistering(true);
         try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/events/${id}/register`, config);
            setIsRegistered(false);
            setRegistrationStatus(null);
            alert("Registration cancelled successfully.");
        } catch (error) {
            console.error("Error cancelling registration:", error);
            setError("Failed to cancel registration");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading event details...</div>;
    if (!event) return <div className="alert alert-danger text-center mt-4">Event not found</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ position: 'relative', zIndex: 20 }}>
                &larr; Back to Events
            </button>
            
            {/* Hero Banner */}
            <div className="event-details-hero">
                <img 
                    src={`https://picsum.photos/seed/${event._id}/1200/600`} 
                    alt={event.name} 
                />
                <div className="event-details-overlay"></div>
            </div>
            
            <div className="event-details-content-wrapper">
                <div className="event-details-card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="badge mb-4">{event.category}</span>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>{event.name}</h1>
                        
                        <div className="organizer-info justify-center">
                            <div className="organizer-avatar">
                                {event.organizer.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-secondary m-0">Organized by</p>
                                <p className="font-bold m-0">{event.organizer}</p>
                            </div>
                        </div>
                    </div>

                    {/* Key Info Grid */}
                    <div className="event-meta-grid">
                        <div className="meta-item">
                            <div className="meta-icon-box">
                                <FaCalendarAlt />
                            </div>
                            <div className="meta-text">
                                <h5>Date & Time</h5>
                                <p>{new Date(event.date).toLocaleDateString()}</p>
                                <p className="text-sm text-muted">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-icon-box">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="meta-text">
                                <h5>Location</h5>
                                <p>{event.location}</p>
                                <a href={`https://maps.google.com/?q=${event.location}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View on Map</a>
                            </div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-icon-box">
                                <FaTicketAlt />
                            </div>
                            <div className="meta-text">
                                <h5>Availability</h5>
                                <p>{event.capacity} Spots Total</p>
                                <p className="text-sm text-success">Registration Open</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 mt-8">
                        {/* Description Column */}
                        <div style={{ flex: 2 }}>
                            <h3 className="section-title">About this Event</h3>
                            <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
                                {event.description}
                            </p>
                        </div>

                        {/* Registration Column */}
                        <div style={{ flex: 1 }}>
                            <div className="card" style={{ padding: '2rem', background: 'var(--bg-surface)', border: 'none' }}>
                                <h3 className="h4 mb-4">Register Now</h3>
                                
                                {registrationStatus === 'success' || isRegistered ? (
                                    <div className="alert alert-success">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaTicketAlt /> <strong>Confirmed!</strong>
                                        </div>
                                        <p className="text-sm">You are registered for this event. Check your dashboard for details.</p>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary w-full text-sm">
                                                Go to Dashboard
                                            </button>
                                            <button onClick={handleCancel} disabled={registering} className="btn btn-danger w-full text-sm" style={{ backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                                                Cancel Registration
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {error && <div className="alert alert-danger mb-4">{error}</div>}
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Price</span>
                                                <span className="font-bold">Free</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-4">
                                                <span>Fees</span>
                                                <span className="font-bold">$0.00</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>$0.00</span>
                                            </div>
                                        </div>

                                        {user ? (
                                            <button 
                                                onClick={handleRegister} 
                                                disabled={registering}
                                                className="btn btn-primary btn-lg w-full shadow-lg"
                                            >
                                                {registering ? 'Processing...' : 'Complete Registration'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => navigate('/login')} 
                                                className="btn btn-primary btn-lg w-full shadow-lg"
                                            >
                                                Login to Register
                                            </button>
                                        )}
                                        
                                        <p className="text-center text-xs text-muted mt-4">
                                            By registering, you agree to our Terms of Service.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
