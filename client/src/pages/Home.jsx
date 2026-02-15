import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import EventCard from '../components/EventCard';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const categories = [
        "Technology", "Music", "Business", "Art", "Sports", 
        "Education", "Food & Drink", "Health & Wellness", 
        "Entertainment", "Gaming", "Science"
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (search) params.search = search;
                if (category) params.category = category;
                if (location) params.location = location;

                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events`, { params });
                
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    console.error("API Error: Expected array but got", data);
                    setError('Received invalid data from server. Please check backend connection.');
                }
            } catch (err) {
                console.error("Error fetching events:", err);
                setError('Failed to load events. Please ensure the backend server is running and connected to MongoDB.');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, category, location]);

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-container">
                <div className="hero-text">
                    <h1>Discover Events That Matter To You</h1>
                    <p className="text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
                        Browse through thousands of events happening around you. Join the community and experience something new.
                    </p>

                </div>
                
                {/* Search Box */}
                <div className="search-container">
                     <div className="search-input-group">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search for events..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-row">
                         <select 
                            className="filter-select" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            <option value="San Francisco, CA">San Francisco</option>
                            <option value="New York, NY">New York</option>
                            <option value="London, UK">London</option>
                        </select>

                        <select 
                            className="filter-select" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        
                        <button className="btn btn-primary">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Listings */}
            <div>
                <h2 className="section-title">Upcoming Events</h2>
                
                {loading ? (
                    <div className="text-center text-muted" style={{ padding: '4rem 0' }}>Loading events...</div>
                ) : error ? (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div> 
                ) : events.length === 0 ? (
                    <div className="text-center text-muted" style={{ padding: '4rem 0' }}>
                        <h3>No events found</h3>
                        <p>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
