import React, { useState } from 'react';
import CanvasAll from '../components/draw/CanvasAll';
import Navigation from '../components/Navigation.js';
import CanvasGrid from '../components/draw/CanvasGrid.js';

const CutAllPage = () => {
    const [partyId, setpartyId] = useState(2); // 현재 방 ID
    const [cutIds, setcutIds] = useState([10, 11, 12, 13]);

    return (
        <div className="h-screen bg-light-yellow">
            <div className="w-full mb-5">
                <Navigation stage="drawing" />
            </div>

            <CanvasGrid partyId={partyId} cutIds={cutIds} />
        </div>
    );
};

export default CutAllPage;
