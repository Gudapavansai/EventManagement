import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaHistory, FaCalendarCheck, FaListAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/mine`, config);
            setEvents(data);
        } catch (error) {
            console.error("Error fetching my events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyEvents();
        }
    }, [user]);

    const handleCancel = async (eventId) => {
        if(!window.confirm("Are you sure you want to cancel this registration?")) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/events/${eventId}/register`, config);
            // Refresh list
            fetchMyEvents();
        } catch (error) {
            console.error("Error cancelling registration:", error);
            alert("Failed to cancel registration");
        }
    };

    // Categorize events
    const today = new Date();
    
    // Process upcoming events: sort by date ascending
    const sortedUpcoming = events
        .filter(reg => new Date(reg.event.date) >= today)
        .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
        
    const upcomingEvents = sortedUpcoming; // Keep full list for stats
    const displayedUpcoming = sortedUpcoming.slice(0, 3); // Limit to 3 for display cards
    
    const pastEvents = events
        .filter(reg => new Date(reg.event.date) < today)
        .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

    const StatsCard = ({ icon, title, value, color }) => (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: `var(--${color}-bg, #eff6ff)`, 
                color: `var(--${color}, #3b82f6)`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem'
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</p>
            </div>
        </div>
    );

    const EventList = ({ registrations, title, showCancel, emptyMessage }) => (
        <div className="dashboard-section mb-6">
            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title} <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 'normal' }}>({registrations.length})</span></h3>
            {registrations.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem', borderStyle: 'dashed', boxShadow: 'none' }}>
                    <p className="text-muted">{emptyMessage}</p>
                    {showCancel && <Link to="/" className="btn btn-primary mt-4">Browse Events</Link>}
                </div>
            ) : (
                <div className="events-grid">
                    {registrations.map(reg => (
                        <div key={reg._id} className="card">
                             <div className="event-image">
                                <img 
                                    src={`https://picsum.photos/seed/${reg.event._id}/800/600`} 
                                    alt={reg.event.name}
                                    loading="lazy"
                                />
                            </div>
                             <div className="event-content">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="badge">{reg.event.category}</span>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Registered: {new Date(reg.registrationDate).toLocaleDateString()}</small>
                                </div>
                                
                                <h4>{reg.event.name}</h4>
                                
                                <div className="flex flex-col gap-2 mt-2 mb-4 text-sm text-secondary">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-muted" />
                                        <span>{new Date(reg.event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-muted" />
                                        <span>{reg.event.location}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <Link to={`/events/${reg.event._id}`} className="font-bold" style={{ color: 'var(--primary-color)' }}>
                                        View Details
                                    </Link>
                                    {showCancel && (
                                        <button 
                                            onClick={() => handleCancel(reg.event._id)}
                                            className="btn btn-secondary btn-icon"
                                            title="Cancel Registration"
                                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

    return (
        <div>
            {/* Premium Dashboard Hero */}
            <div className="dashboard-hero">
                <h1>Welcome Back, {user?.name || 'User'}!</h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    You have <strong>{upcomingEvents.length}</strong> upcoming events scheduled. Stay organized and ready.
                </p>
            </div>

            <div className="dashboard-content-wrapper">
                {/* Stats Summary - Floating Cards */}
                <div className="events-grid mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '4rem', marginTop: '-2rem' }}>
                    <StatsCard 
                        icon={<FaListAlt />} 
                        title="Total Registered" 
                        value={events.length} 
                        color="primary"
                    />
                    <StatsCard 
                        icon={<FaCalendarCheck />} 
                        title="Upcoming Events" 
                        value={upcomingEvents.length} 
                        color="success"
                    />
                    <StatsCard 
                        icon={<FaHistory />} 
                        title="Past Events" 
                        value={pastEvents.length} 
                        color="warning"
                    />
                </div>

            <div className="dashboard-section mb-6">
                <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    Upcoming Events <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 'normal' }}>({upcomingEvents.length})</span>
                </h3>
                
                {upcomingEvents.length === 0 ? (
                    <div className="card text-center" style={{ padding: '3rem', borderStyle: 'dashed', boxShadow: 'none' }}>
                        <p className="text-muted">You have no upcoming events scheduled.</p>
                        <Link to="/" className="btn btn-primary mt-4">Browse Events</Link>
                    </div>
                ) : (
                    <>
                        <div className="events-grid">
                            {displayedUpcoming.map(reg => (
                                <div key={reg._id} className="card">
                                     <div className="event-image">
                                        <img 
                                            src={`https://picsum.photos/seed/${reg.event._id}/800/600`} 
                                            alt={reg.event.name}
                                            loading="lazy"
                                        />
                                    </div>
                                     <div className="event-content">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="badge">{reg.event.category}</span>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Registered: {new Date(reg.registrationDate).toLocaleDateString()}</small>
                                        </div>
                                        
                                        <h4>{reg.event.name}</h4>
                                        
                                        <div className="flex flex-col gap-2 mt-2 mb-4 text-sm text-secondary">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-muted" />
                                                <span>{new Date(reg.event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-muted" />
                                                <span>{reg.event.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                            <Link to={`/events/${reg.event._id}`} className="font-bold" style={{ color: 'var(--primary-color)' }}>
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={() => handleCancel(reg.event._id)}
                                                className="btn btn-secondary btn-icon"
                                                title="Cancel Registration"
                                                style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {upcomingEvents.length > 3 && (
                            <div className="text-center mt-4">
                                <p className="text-muted">And {upcomingEvents.length - 3} more...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <EventList 
                registrations={pastEvents} 
                title="Past Event History" 
                showCancel={false} 
                emptyMessage="No past event history found."
            />
            </div>
        </div>
    );
};

export default Dashboard;
