import React from 'react';


const StarRatings = ({ rating }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span
                    key={star}
                    className="star"
                    style={{
                        color: star <= rating ? 'gold' : 'gray',
                        opacity: star <= rating ? `${0.6 + (rating - 1) * 0.1}` : '0.3',
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRatings;
