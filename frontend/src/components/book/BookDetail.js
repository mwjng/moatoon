import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from "react-redux";
import { getPartyDetail, addPartyMembers, removePartyMember } from "../../api/party";
import AlertModal from "../common/AlertModal";
import ConfirmModal from "../common/ConfirmModal"

const BookDetail = ({ partyId }) => {
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userChildren = useSelector((state) => state.user.children);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const data = await getPartyDetail(partyId);
        setPartyDetails(data);
        setSelectedChildren(data.members.map(m => m.memberId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [partyId]);

  const getRemainingTime = () => {
    if (!partyDetails) return 0;
    const start = new Date(partyDetails.startDate);
    const now = new Date();
    return (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  };

  const handleAddChild = async (childId) => {
    if (!selectedChildren.includes(childId)) {
      try {
        setIsSubmitting(true);
        await addPartyMembers(partyId, [childId]);
        setSelectedChildren([...selectedChildren, childId]);
      } catch (err) {
        setError("참여자 추가에 실패했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveChild = async (childId) => {
    try {
      setIsSubmitting(true);
      await removePartyMember(partyId, childId);
      setSelectedChildren(selectedChildren.filter(id => id !== childId));
    } catch (err) {
      setError("참여자 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Alert variant="destructive">
          <p className="text-red-600">오류가 발생했습니다: {error}</p>
        </Alert>
      </div>
    );
  }

  const showControls = getRemainingTime() > 1;
  const showPreviousStory = partyDetails.progressCount > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="card max-w-3xl mx-auto bg-blue-50/80 shadow-xl backdrop-blur-sm">
        <div className="card-body p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">PIN 번호: {partyDetails.pinNumber}</span>
            <button className="btn btn-ghost btn-sm hover:bg-red-100">
              <X size={20} />
            </button>
          </div>
          
          <h2 className="card-title text-2xl font-bold text-center my-2">{partyDetails.title}</h2>
          
          {/* Info Bar */}
          <div className="flex justify-between items-center bg-white rounded-xl p-4 mt-2 shadow-sm">
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-sm">시작일: {new Date(partyDetails.startDate).toLocaleDateString()}</span>
              <span className="text-sm">요일: {partyDetails.dayWeeks.join(", ")}</span>
              <span className="text-sm">시간: {new Date(partyDetails.startDate).toLocaleTimeString()}</span>
              <span className="text-sm">난이도: Lv.{partyDetails.level}</span>
              <span className="text-sm">진행률: {partyDetails.progressCount}/{partyDetails.episodeCount}</span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="relative">
              <img 
                src={partyDetails.bookCover}
                alt={partyDetails.title}
                className="w-[280px] h-[400px] object-cover rounded-lg shadow-md"
              />
              {showPreviousStory && (
                <button className="btn btn-warning absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 shadow-lg">
                  이전 이야기 보기
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex gap-2 mb-4 flex-wrap">
                {partyDetails.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="badge badge-lg bg-orange-400 text-white border-none shadow-sm"
                  >
                    #{keyword.keyword}
                  </span>
                ))}
              </div>
              
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                {partyDetails.introduction}
              </p>
              
              <div className="bg-gray-200 rounded-xl p-4 shadow-inner">
                <p className="text-sm font-semibold mb-3">참여하는 사람</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedChildren.map((childId) => {
                    const child = userChildren.find(c => c.id === childId);
                    return (
                      <div key={childId} className="relative">
                        {showControls && (
                          <button 
                            onClick={() => handleRemoveChild(childId)}
                            disabled={isSubmitting}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center shadow-md transition-colors"
                          >
                            ×
                          </button>
                        )}
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
                            <img src={child.imageUrl} alt={child.name} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {showControls && (
                <div className="mt-4 flex gap-2">
                  <select 
                    className="select select-bordered flex-1"
                    onChange={(e) => handleAddChild(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled selected>참여자 선택</option>
                    {userChildren
                      .filter(child => !selectedChildren.includes(child.id))
                      .map(child => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                  </select>
                  <button 
                    className="btn btn-warning px-8 shadow-md hover:shadow-lg transition-shadow"
                    disabled={isSubmitting}
                  >
                    등록하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;