import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const EventCard = ({ event }) => {
    // Generate a consistent random image URL based on event ID
    const imgUrl = `https://picsum.photos/seed/${event._id}/800/600`;

    return (
        <Link to={`/events/${event._id}`} className="card">
            <div className="event-image">
                <img 
                    src={imgUrl} 
                    alt={event.name}
                    loading="lazy"
                />
                 <span className="category-badge">
                     {event.category}
                 </span>
            </div>
            
            <div className="event-content">
                <h3 className="event-title">{event.name}</h3>
                <p className="event-organizer">by {event.organizer}</p>
                
                <div className="event-info">
                    <div className="info-item">
                        <FaCalendarAlt />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
