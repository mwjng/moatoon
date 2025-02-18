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
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-amber-50 z-50 flex flex-col items-center justify-center px-4">
        
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
        <div className="flex justify-center items-end mb-8" style={{ marginTop: '-20px' }}>
          <div className="w-24 h-24 -mr-10">
            <img
              src={bbi_normal}
              alt="character1"
              className="w-full h-full object-contain"
              style={{ ...bounceStyle }}
            />
          </div>
          <div className="w-40 h-40 relative z-10">
            <img
              src={duckduck}
              alt="character2"
              className="w-full h-full object-contain"
              style={{ ...bounceStyle, animationDelay: '0.2s' }}
            />
          </div>
          <div className="w-24 h-24 -ml-11">
            <img
              src={cado}
              alt="character3"
              className="w-full h-full object-contain"
              style={{ ...bounceStyle, animationDelay: '0.4s' }}
            />
          </div>
        </div>
        
        {/* Message */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-gray-800 mb-2">지원하지 않는 화면 크기입니다.</p>
          <p className="text-base text-gray-600">더 큰 화면에서 이용해주세요.</p>
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
                <p className="main-message">화면을 가로로 돌려주세요</p>
                <p className="sub-message">가로 모드로 볼 수 있어요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Desktop: Show unsupported screen size message if needed */}
      {isDesktop && showDesktopMessage && <DesktopSizeMessage />}
      
      {/* Mobile: Show orientation alert if in portrait mode */}
      {!isDesktop && showOrientationAlert && <MobileOrientationAlert />}
      
      {/* Render content appropriately */}
      {(isDesktop && !showDesktopMessage) || (!isDesktop && isLandscape) ? children : null}
      
      <style jsx>{`
        .app-container {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: #f0f5ff;
        }

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

export default DeviceResponsiveLayout;