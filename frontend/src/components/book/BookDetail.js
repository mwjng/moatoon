import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from "react-redux";
import { getPartyDetail, addPartyMembers, removePartyMember, getPartyDetailByPin } from "../../api/party";
import Alert from "../common/AlertModal";
import ConfirmModal from "../common/ConfirmModal";
import defaultProfileImage from "../../assets/duckduck.png"

const BookDetail = ({partyIdOrPin, onClose}) => {
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNewChildren, setSelectedNewChildren] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [memberToRemove, setMemberToRemove] = useState(null);

  // 모달 상태 관리
  const [alertModalState, setAlertModalState] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState('');

  const userChildren = useSelector(state => state.user.userInfo?.childrenList || []);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        let data;
        if (typeof partyIdOrPin === 'number') {
          // Fetch by partyId if number provided
          data = await getPartyDetail(partyIdOrPin); 
        } else {
          // Else assume it's a pin and fetch by pin
          console.log("핀번호 검색 : ", data)
          data = await getPartyDetailByPin(partyIdOrPin);
        }
        setPartyDetails(data);
      } catch (err) {
        setError(err.message);
        setAlertMessage("데이터를 불러오는데 실패했습니다.");
        setAlertModalState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [partyIdOrPin]);

  const getRemainingTime = () => {
    if (!partyDetails) return 0;
    const start = new Date(partyDetails.startDate);
    const now = new Date();
    return (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  };

  // 멤버 관리 함수들
  const handleAddChild = (childId) => {
    const selectedChild = userChildren.find(child => child.id === childId);
    
    // 이미 참여 중이거나 임시 추가 리스트에 있는 멤버인지 확인
    const isAlreadyMember = 
      partyDetails.members.some(member => member.memberId === childId) ||
      selectedNewChildren.some(child => child.id === childId);

    if (isAlreadyMember) {
      setAlertMessage("이미 참여 중인 멤버입니다.");
      setAlertModalState(true);
      return;
    }

    if (selectedChild) {
      setSelectedNewChildren(prev => [...prev, selectedChild]);
    }

      // 드롭다운 초기화
    const selectElement = document.querySelector('select');
    if (selectElement) {
      selectElement.selectedIndex = 0;
    }
  };

  const handleRemoveNewChild = (childId) => {
    // 임시 리스트에서 해당 자녀 제거
    setSelectedNewChildren(prev => prev.filter(child => child.id !== childId));
  };

  const handleSubmitNewMembers = () => {
    if (selectedNewChildren.length === 0) {
      setAlertMessage("추가할 멤버를 선택해주세요.");
      setAlertModalState(true);
      return;
    }
    
    setConfirmModalType('add');
    setConfirmModalState(true);
  };

  const submitMembers = async () => {
    try {
      setIsSubmitting(true);
      const newMemberIds = selectedNewChildren.map(child => child.id);
      await addPartyMembers(partyId, newMemberIds);
      
      const updatedData = await getPartyDetail(partyId);
      setPartyDetails(updatedData);
      setSelectedNewChildren([]);
      
      setAlertMessage("등록되었습니다.");
      setAlertModalState(true);
      setConfirmModalState(false);
    } catch (err) {
      setAlertMessage("멤버 등록 중 오류가 발생했습니다.");
      setAlertModalState(true);
    } finally {
      setIsSubmitting(false);
      setConfirmModalState(false);
    }
  };

  const handleRemoveExistingMember = (memberId) => {
    const memberToRemove = partyDetails.members.find(member => member.memberId === memberId);
    setMemberToRemove(memberToRemove);
    setConfirmModalType('remove');
    setConfirmModalState(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      setIsSubmitting(true);
      await removePartyMember(partyId, memberToRemove.memberId);
      
      const updatedData = await getPartyDetail(partyId);
      setPartyDetails(updatedData);
      
      setAlertMessage("삭제되었습니다.");
      setAlertModalState(true);
    } catch (err) {
      setAlertMessage("멤버 삭제 중 오류가 발생했습니다.");
      setAlertModalState(true);
    } finally {
      setIsSubmitting(false);
      setConfirmModalState(false);
      setMemberToRemove(null);
    }
  };

  const closeAlertModal = () => {
    setAlertModalState(false);
  };

  const closeConfirmModal = () => {
    setConfirmModalState(false);
  };

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="text-red-600">오류가 발생했습니다: {error}</div>;

  const showControls = getRemainingTime() > 1;
  const showPreviousStory = partyDetails.progressCount > 0;

  return (

    <div className="min-h-screen bg-gray-100 p-4" >
      <div className="card max-w-3xl mx-auto bg-blue-50/80 shadow-xl backdrop-blur-sm">
        <div className="card-body p-6">
          {/* 헤더 및 기본 정보 */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">PIN 번호: {partyDetails.pinNumber}</span>
            <button className="btn btn-ghost btn-sm hover:bg-red-100" 
            onClick={onClose} >
              <X size={20} />
            </button>
          </div>
          
          <h2 className="card-title text-2xl font-bold text-center my-2">{partyDetails.title}</h2>
          
          {/* 정보 바 */}
          <div className="flex justify-between items-center bg-white rounded-xl p-4 mt-2 shadow-sm" style={{ fontFamily: 'S-CoreDream-3Light', color: 'red' }}>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-sm">시작일: {new Date(partyDetails.startDate).toLocaleDateString()}</span>
              <span className="text-sm">요일: {partyDetails.dayWeeks.join(", ")}</span>
              <span className="text-sm">시간: {new Date(partyDetails.startDate).toLocaleTimeString()}</span>
              <span className="text-sm">난이도: Lv.{partyDetails.level}</span>
              <span className="text-sm">진행률: {partyDetails.progressCount}/{partyDetails.episodeCount}</span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            {/* 책 커버 및 이전 스토리 섹션 */}
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
              {/* 키워드 섹션 */}
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
              
              {/* 책 소개 */}
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                {partyDetails.introduction}
              </p>

              {/* 참여하는 아동 섹션 */}
              <div className="bg-gray-200 rounded-xl p-4 shadow-inner">
                <p className="text-sm font-semibold mb-3">참여하는 사람</p>
                <div className="flex flex-col gap-2">
                  {/* 기존 멤버 */}
                  {partyDetails.members.map((member) => (
                    <div key={member.memberId} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img 
                              src={member.imgUrl || defaultProfileImage} 
                              alt={member.name}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-gray-500">{member.nickname}</span>
                        </div>
                      </div>
                      {showControls && (
                        <button 
                          onClick={() => handleRemoveExistingMember(member.memberId)}
                          disabled={isSubmitting}
                          className="btn btn-circle btn-sm btn-error"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* 임시 추가된 아동 */}
                  {selectedNewChildren.map((child) => (
                    <div key={child.id} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img 
                              src={child.imgUrl || defaultProfileImage} 
                              alt={child.name}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{child.name}</span>
                          <span className="text-sm text-gray-500 opacity-70">(예정)</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveNewChild(child.id)}
                        disabled={isSubmitting}
                        className="btn btn-circle btn-sm btn-warning"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 아동 추가 섹션 */}
              {showControls && (
                <div className="mt-4 flex gap-2">
                  <select 
                    className="select select-bordered flex-1"
                    onChange={(e) => handleAddChild(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled selected>참여자 선택</option>
                    {userChildren
                      .filter(child => 
                        !partyDetails.members.some(member => member.memberId === child.id) &&
                        !selectedNewChildren.some(newChild => newChild.id === child.id)
                      )
                      .map(child => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                  </select>
                  <button 
                    className="btn btn-warning px-8 shadow-md hover:shadow-lg transition-shadow"
                    onClick={handleSubmitNewMembers}
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

      {/* 알림 모달 */}
      <Alert 
        modalState={alertModalState}
        text={alertMessage}
        closeHandler={closeAlertModal}
      />

      {/* 확인 모달 */}
      <ConfirmModal
        modalState={confirmModalState}
        text={
          confirmModalType === 'add' 
            ? "등록하시겠습니까?" 
            : confirmModalType === 'remove' && memberToRemove
            ? `${memberToRemove.name}을 삭제하시겠습니까?`
            : "확인이 필요한 작업이 있습니다."
        }
        confirmHandler={
          confirmModalType === 'add' 
            ? submitMembers 
            : confirmModalType === 'remove'
            ? confirmRemoveMember
            : () => {}
        }
      />
      </div>

      );
    };
    export default BookDetail;