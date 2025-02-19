import React, { useState, useEffect } from 'react';
import bbi from '../assets/bbi.png';
import bbi_normal from '../assets/bbi_normal.png';
import duckduck from '../assets/duckduck.png';
import cado from '../assets/cado.svg';

const DeviceResponsiveLayout = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [showOrientationAlert, setShowOrientationAlert] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showDesktopMessage, setShowDesktopMessage] = useState(false);

  // Device type detection
  const detectDeviceType = () => {
    // Common mobile device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsDesktop(!isMobile);
    
    // Handle screen size for desktop separately
    if (!isMobile) {
      const minWidth = 800; // Minimum acceptable width for desktop view
      const minHeight = 600; // Minimum acceptable height for desktop view
      setShowDesktopMessage(window.innerWidth < minWidth || window.innerHeight < minHeight);
    }
  };

  // Screen orientation detection - only for mobile
  const checkOrientation = () => {
    // Only check and enforce orientation for mobile devices
    if (!isDesktop) {
      // First check using window.orientation if available (more reliable on mobile)
      if (window.orientation !== undefined) {
        const orientation = Math.abs(window.orientation);
        const newIsLandscape = orientation === 90;
        setIsLandscape(newIsLandscape);
        setShowOrientationAlert(!newIsLandscape);
      } else {
        // Fallback method using dimensions
        const newIsLandscape = window.innerWidth > window.innerHeight;
        setIsLandscape(newIsLandscape);
        setShowOrientationAlert(!newIsLandscape);
      }
    } else {
      // For desktop, we don't enforce orientation, just set the state
      setIsLandscape(window.innerWidth > window.innerHeight);
      setShowOrientationAlert(false); // Never show orientation alert on desktop
    }
  };

  // Initialize and set up event listeners
  useEffect(() => {
    detectDeviceType();
    checkOrientation();
    
    const handleResize = () => {
      detectDeviceType();
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
  }, [isDesktop]);

  // Desktop unsupported screen size message
  const DesktopSizeMessage = () => {
    const bounceStyle = {
      animation: 'bigBounce 1s infinite',
    };

    return (
      <div className="size-message-overlay">
        <style>
          {`
            @keyframes bigBounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-12px);
              }
            }
          `}
        </style>

        {/* Characters container */}
        <div className="character-container">
          <div className="character character1">
            <img
              src={bbi_normal}
              alt="character1"
              className="character-img"
              style={{ ...bounceStyle }}
            />
          </div>
          <div className="character character2">
            <img
              src={duckduck}
              alt="character2"
              className="character-img"
              style={{ ...bounceStyle, animationDelay: '0.2s' }}
            />
          </div>
          <div className="character character3">
            <img
              src={cado}
              alt="character3"
              className="character-img"
              style={{ ...bounceStyle, animationDelay: '0.4s' }}
            />
          </div>
        </div>
        
        {/* Message */}
        <div className="message-box">
          <p className="message-main">지원하지 않는 화면 크기입니다.</p>
          <p className="message-sub">더 큰 화면에서 이용해주세요.</p>
        </div>
      </div>
    );
  };

  // Mobile portrait orientation alert
  const MobileOrientationAlert = () => {
    return (
      <div className="orientation-alert">
        <div className="alert-card">
          <div className="content-container">
            <div className="bbi-with-phone">
              <img 
                src={bbi}
                alt="BBI 캐릭터" 
                className="bbi-character"
              />
              
              <div className="phone-wrapper">
                <div className="phone-icon">
                  <div className="phone-screen"></div>
                </div>
              </div>
            </div>
            
            <div className="message-container">
              <div className="message-bubble">
                <p className="main-message">화면을 가로로 돌려주세요</p>
                <p className="sub-message">가로 모드로 볼 수 있어요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 이 함수에서 콘텐츠가 표시되어야 하는지 판단
  const shouldShowContent = () => {
    return (isDesktop && !showDesktopMessage) || (!isDesktop && isLandscape);
  };

  return (
    <div className="app-container">
      {/* Main content - 항상 렌더링하지만 display로 제어 */}
      <div 
        className="content-container"
        style={{
          display: shouldShowContent() ? 'block' : 'none',
        }}
      >
        {children}
      </div>
      
      {/* Overlay messages */}
      {isDesktop && showDesktopMessage && <DesktopSizeMessage />}
      {!isDesktop && showOrientationAlert && <MobileOrientationAlert />}
      
      <style>{`
        .app-container {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: #f0f5ff;
        }

        .content-container {
          width: 100%;
          height: 100%;
        }

        /* Desktop message */
        .size-message-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #fef3c7; /* amber-50 */
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .character-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin-bottom: 2rem;
          margin-top: -1.25rem;
        }

        .character {
          position: relative;
        }

        .character1 {
          width: 6rem;
          height: 6rem;
          margin-right: -2.5rem;
        }

        .character2 {
          width: 10rem;
          height: 10rem;
          z-index: 10;
        }

        .character3 {
          width: 6rem;
          height: 6rem;
          margin-left: -2.75rem;
        }

        .character-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .message-box {
          text-align: center;
          margin-bottom: 2rem;
        }

        .message-main {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937; /* gray-800 */
          margin-bottom: 0.5rem;
        }

        .message-sub {
          font-size: 1rem;
          color: #4b5563; /* gray-600 */
        }

        /* Mobile orientation alert */
        .orientation-alert {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f0f5ff;
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
          margin-right: 1rem;
        }

        .phone-wrapper {
          position: absolute;
          bottom: 35px;
          right: 30px;
          z-index: 3;
          margin-bottom: 1.5rem;
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

export default DeviceResponsiveLayout;