import React from 'react';
import bbi from '../assets/bbi.png';

function FooterNotice() {
   return (
       <div
           className="flex flex-row shadow-md rounded-full p-3 items-center justify-center w-[450px] h-[70px]" 
           style={{ backgroundColor: '#FDFCDC' }}
       >
           <div className="flex flex-col items-center justify-center gap-2"> 
               <div className="text-black font-medium text-[15px]">잠시 후에 세션이 시작됩니다!</div> 
               <div className="text-black font-medium text-[15px]">마이크와 카메라를 켜고 준비해주세요!</div>
           </div>
           <img src={`${bbi}`} className="w-[70px] h-[70px]" /> 
       </div>
   );
}

export default FooterNotice;