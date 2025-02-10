import React, { useState } from 'react';
import CanvasAll from '../components/draw/CanvasAll';

const CutAllPage = () => {
    const [partyId, setpartyId] = useState(1); // 현재 방 ID

    return (
        <div className="flex justify-between">
            {/* 친구들의 그림을 각 방에서 받도록 수정 */}
            <div style={{ width: '600px', height: '600px' }}>
                <h3>친구들의 그림</h3>
                <CanvasAll partyId={partyId} /> {/* 같은 partyId를 전달 */}
            </div>

            {/* 본인의 그림 */}
            <div style={{ width: '600px', height: '600px' }}>
                <h3>본인의 그림</h3>
                <CanvasAll partyId="2" />
                {/* <Canvas partyId={partyId} /> 본인 그림을 그리는 컴포넌트 */}
            </div>
        </div>
    );
};

export default CutAllPage;
