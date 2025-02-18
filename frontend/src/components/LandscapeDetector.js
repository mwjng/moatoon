import React, { useState, useEffect } from 'react';
import bbi from '../assets/bbi.png';

const LandscapeDetector = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // 화면 방향 감지 함수
  const checkOrientation = () => {
    // window.orientation이 있는 경우 (모바일)
    if (window.orientation !== undefined) {
      const orientation = Math.abs(window.orientation);
      const newIsLandscape = orientation === 90;
      setIsLandscape(newIsLandscape);
      setShowAlert(!newIsLandscape);
    } else {
      // window.orientation이 없는 경우 (데스크톱 등)
      const newIsLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(newIsLandscape);
      setShowAlert(!newIsLandscape);
    }
  };

  // 컴포넌트 마운트 및 화면 크기 변경 시 방향 감지
  useEffect(() => {
    checkOrientation();
    
    const handleResize = () => {
      checkOrientation();
    };
    
    const handleOrientationChange = () => {
      checkOrientation();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div className="app-container">
      {showAlert && (
        <div className="orientation-alert">
          <div className="alert-card">
            <div className="content-container">
              <div className="bbi-with-phone">
                <img 
                  src={`${bbi}`}
                  alt="BBI 캐릭터" 
                  className="bbi-character mr-4"
                />
                
                <div className="phone-wrapper mb-6">
                  <div className="phone-icon">
                    <div className="phone-screen"></div>
                  </div>
                </div>
              </div>
              
              <div className="message-container">
                <div className="message-bubble">
                  <p className="main-message">태블릿을 옆으로 돌려주세요</p>
                  <p className="sub-message">가로 모드로 볼 수 있어요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLandscape ? children : null}
      
      <style jsx>{`
        .app-container {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: #f0f5ff; /* 적당한 밝은 하늘색 배경 추가 */
        }

        .orientation-alert {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f0f5ff; /* 알림창 배경색도 동일하게 변경 */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .alert-card {
          background-color: white;
          border-radius: 20px;
          padding: 30px;
          width: 85%;
          max-width: 340px;
          max-height: 90vh;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .content-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          gap: 20px;
        }

        .bbi-with-phone {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .bbi-character {
          width: 170px;
          height: 170px;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }

        .phone-wrapper {
          position: absolute;
          bottom: 35px;
          right: 30px;
          z-index: 3;
        }

        .phone-icon {
          width: 30px;
          height: 56px;
          background-color: #333;
          border-radius: 6px;
          position: relative;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          animation: rotate 3s ease-in-out infinite;
          transform-origin: center;
        }

        .phone-screen {
          position: absolute;
          top: 4px;
          left: 3px;
          width: 24px;
          height: 48px;
          background-color: #e0edff;
          border-radius: 2px;
        }

        .message-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0 10px;
        }

        .message-bubble {
          background-color: #f8f9fa;
          border-radius: 16px;
          padding: 16px 20px;
          width: 100%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .main-message {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px;
        }

        .sub-message {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        @keyframes rotate {
          0%, 10%, 90%, 100% { transform: rotate(0deg); }
          30%, 70% { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
};

export default LandscapeDetector;