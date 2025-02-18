import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FrownIcon } from 'lucide-react';

const getErrorMessage = (errorCode) => {
  const code = parseInt(errorCode);
  switch (code) {
    case 5002:
      return {
        title: '아직 시작하지 않았어요',
        description: '세션 시작 시간에 다시 들어와주세요!'
      };
    case 2004:
      return {
        title: '친구들이 가득 찼어요',
        description: '이미 많은 친구들이 참여하고 있어요.'
      };
    case 1000:
      return {
        title: '앗! 무언가 잘못됐어요',
        description: '잠시 후에 다시 시도해주세요.'
      };
    case 5001:
      return {
        title: '수업을 찾을 수 없어요',
        description: '올바른 접근인지 확인해주세요.'
      };
    case 2001:
      return {
        title: '세션 만들기를 실패했어요',
        description: '잠시 후에 다시 시도해주세요.'
      };
    case 2002:
      return {
        title: '연결하지 못했어요',
        description: '인터넷 연결을 확인하고 다시 시도해주세요.'
      };
    default:
      return {
        title: '입장할 수 없어요',
        description: '잠시 후에 다시 시도해주세요.'
      };
  }
};

const SessionErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorCode, setErrorCode] = useState(location.state?.errorCode || 1000);

  useEffect(() => {
    if (location.state?.errorCode) {
      setErrorCode(location.state.errorCode);
    }
  }, [location.state]);

  const { title, description } = getErrorMessage(errorCode);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-orange-50 rounded-full">
            <FrownIcon className="w-12 h-12 text-orange-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-700 mb-3">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            {description}
          </p>

          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-medium text-lg"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionErrorPage;