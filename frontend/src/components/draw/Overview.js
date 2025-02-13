import React, { useState } from 'react';
import Navigation from '../Navigation.js';
import CanvasGrid from '../draw/CanvasGrid.js';

const Overview = ({ toggleView }) => {
    const [partyId, setpartyId] = useState(2); // 현재 방 ID
    const [cutIds, setcutIds] = useState([10, 11, 12, 13]);

    return (
        <div className="h-screen bg-light-cream-yellow">
            <CanvasGrid partyId={partyId} cutIds={cutIds} toggleView={toggleView} />
        </div>
    );
};

export default Overview;
