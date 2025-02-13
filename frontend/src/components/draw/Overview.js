import React, { useState } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';

const Overview = ({ toggleView, cutsInfo }) => {
    const partyId = cutsInfo[0].partyId;
    const cutIds = cutsInfo.map(item => item.cutId);

    return (
        <div className="h-screen bg-light-cream-yellow">
            <CanvasGrid partyId={partyId} cutIds={cutIds} toggleView={toggleView} />
        </div>
    );
};

export default Overview;
