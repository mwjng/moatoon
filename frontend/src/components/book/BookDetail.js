import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getPartyDetail, addPartyMembers, removePartyMember, getPartyDetailByPin } from '../../api/party';
import Alert from '../common/AlertModal';
import ConfirmModal from '../common/ConfirmModal';
import defaultProfileImage from '../../assets/duckduck.png';
import { useNavigate } from 'react-router-dom';

const BookDetail = ({ partyIdOrPin, onClose, setModalLoading, onPartyUpdate }) => {
    const navigate = useNavigate();
    const [partyDetails, setPartyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNewChildren, setSelectedNewChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [partyId, setPartyId] = useState(null);

    // 모달 상태 관리
    const [alertModalState, setAlertModalState] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState('');

    const userChildren = useSelector(state => state.user.userInfo?.childrenList || []);
    const userRole = useSelector(state => state.user.userInfo?.role);

    useEffect(() => {
        const fetchPartyDetails = async () => {
            try {
                let data;
                if (typeof partyIdOrPin === 'number') {
                    data = await getPartyDetail(partyIdOrPin);
                } else {
                    data = await getPartyDetailByPin(partyIdOrPin);
                }
                setPartyDetails(data);
                setPartyId(data.id);
            } catch (err) {
                setError(err.message);
                setAlertMessage('데이터를 불러오는데 실패했습니다.');
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
        start.setHours(start.getHours());
        const now = new Date();
        return (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    };

    const getActiveSchedule = () => {
        if (!partyDetails?.schedules) return null;

        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

        // 오늘 스케줄 찾기
        const todaySchedules = partyDetails.schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.sessionTime);
            return scheduleDate.toISOString().split('T')[0] === today;
        });

        if (todaySchedules.length === 0) return null;

        // 현재 시간으로부터 10분 이내에 시작하는 스케줄 찾기
        return todaySchedules.find(schedule => {
            const sessionTime = new Date(schedule.sessionTime);
            const remainingMinutes = (sessionTime.getTime() - now.getTime()) / (1000 * 60);
            return remainingMinutes <= 10 && remainingMinutes > 0;
        });
    };

    const remainingTime = getRemainingTime();
    const isRegistrationEnabled = remainingTime > 1 && userRole === 'MANAGER';
    const activeSchedule = getActiveSchedule();
    const canManageMembers = remainingTime > 1 && userRole === 'MANAGER';
    const showPreviousStory = partyDetails ? partyDetails.progressCount > 0 : false;

    const handleJoinSession = () => {
        if (activeSchedule) {
            navigate(`/session/${partyDetails.pinNumber}`);
        }
    };

    //이북보기
    const handlePreviousStory = () => {
        window.open(`/ebook/${partyDetails.id}`, '_blank');
    };

    // 멤버 관리 함수들
    const handleAddChild = childId => {
        if (!childId) return;

        const totalMembers = partyDetails.members.length + selectedNewChildren.length;
        if (totalMembers >= 4) {
            setAlertMessage('4명까지 참여할 수 있습니다.');
            setAlertModalState(true);
            return;
        }
        const selectedChild = userChildren.find(child => child.id === childId);
        if (selectedChild) {
            setSelectedNewChildren(prev => [...prev, selectedChild]);
        }
    };

    const handleRemoveNewChild = childId => {
        setSelectedNewChildren(prevChildren => prevChildren.filter(child => child.id !== childId));
    };

    const handleSubmitNewMembers = () => {
        if (selectedNewChildren.length === 0) {
            setAlertMessage('추가할 멤버를 선택해주세요.');
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

            setAlertMessage('등록되었습니다.');
            onPartyUpdate();
            setAlertModalState(true);
            setConfirmModalState(false);
        } catch (err) {
            if (err.response.data.code == 2007) {
                setAlertMessage('해당 시간에 참여 중인 그림책이 존재합니다.');
            } else {
                setAlertMessage('멤버 등록 중 오류가 발생했습니다.');
            }
            setAlertModalState(true);
        } finally {
            setIsSubmitting(false);
            setConfirmModalState(false);
        }
    };

    const handleRemoveExistingMember = memberId => {
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

            onPartyUpdate();
            setAlertMessage('삭제되었습니다.');
            setAlertModalState(true);
        } catch (err) {
            console.log('삭제 시 에러 이유 ', err);
            setAlertMessage('멤버 삭제 중 오류가 발생했습니다.');
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

    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayWeekMapping = {
        MONDAY: '월',
        TUESDAY: '화',
        WEDNESDAY: '수',
        THURSDAY: '목',
        FRIDAY: '금',
        SATURDAY: '토',
        SUNDAY: '일',
    };
    if (loading) return <div className="loading loading-spinner loading-lg"></div>;
    if (error) return <div className="text-red-600">오류가 발생했습니다: {error}</div>;

    return (
        <div className="card-body p-6 bg-blue-50 shadow-xl">
            {/* 헤더 및 기본 정보 */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PIN 번호: {partyDetails.pinNumber}</span>
                <button className="btn btn-ghost btn-sm hover:bg-red-100" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <h2 className="card-title text-2xl font-bold text-center my-2">{partyDetails.title}</h2>

            {/* 정보 바 */}
            <div
                className="flex justify-between items-center bg-white rounded-xl p-4 mt-2 shadow-sm"
                style={{ fontFamily: 'S-CoreDream-3Light', color: 'red' }}
            >
                <div className="flex items-center gap-4 text-gray-600">
                    <span className="text-sm">책 생성일: {new Date(partyDetails.startDate).toLocaleDateString()}</span>
                    <span className="text-sm">
                        요일:{' '}
                        {partyDetails.dayWeeks
                            .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
                            .map(day => dayWeekMapping[day])
                            .join(', ')}
                    </span>
                    <span className="text-sm">
                        시간:{' '}
                        {new Date(partyDetails.startDate).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}
                    </span>
                    <span className="text-sm">난이도: Lv.{partyDetails.level}</span>
                    <span className="text-sm">
                        진행률: {partyDetails.progressCount}/{partyDetails.episodeCount}
                    </span>
                </div>
            </div>

            <div className="flex gap-6 mt-4">
                {/* 책 커버 및 이전 스토리 섹션 */}
                <div className="relative w-[280px]">
                    <img
                        src={partyDetails.bookCover}
                        alt={partyDetails.title}
                        className="w-[280px] h-[400px] object-cover rounded-lg shadow-md"
                    />
                    {showPreviousStory && (
                        <button
                            onClick={handlePreviousStory}
                            className="btn btn-warning btn-md absolute bottom-4 left-0 right-0 mx-auto w-4/5
                            normal-case font-medium
                            hover:brightness-95"
                        >
                            이전 이야기 보기
                        </button>
                    )}
                </div>

                <div className="flex-1">
                    {/* 키워드 섹션 */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {partyDetails.keywords.map((keyword, index) => (
                            <span key={index} className="badge badge-lg bg-orange-400 text-white border-none shadow-sm">
                                #{keyword.keyword}
                            </span>
                        ))}
                    </div>

                    {/* 책 소개 */}
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">{partyDetails.introduction}</p>

                    {/* 참여하는 아동 섹션 */}
                    <div className="bg-gray-200 rounded-xl p-4 shadow-inner">
                        <p className="text-sm font-semibold mb-3">참여하는 사람</p>
                        <div className="flex space-x-3 overflow-x-auto py-2">
                            {/* 기존 멤버 슬롯 */}
                            {partyDetails.members.map(member => {
                                // const currentUserChildrenIds = userChildren.map(child => child.id);
                                // const isMemberOwnChild = currentUserChildrenIds.includes(member.memberId);
                                const isMemberOwnChild = userChildren.map(child => child.id).includes(member.memberId);

                                return (
                                    <div key={member.memberId} className="flex flex-col items-center relative">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <img
                                                src={member.imgUrl || defaultProfileImage}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-600 mt-1 text-center">
                                            {member.nickname}
                                        </span>
                                        {/* 아동 추가 삭제 X 표시 부모만 */}
                                        {userRole === 'MANAGER' && canManageMembers && isMemberOwnChild && (
                                            <button
                                                onClick={() => handleRemoveExistingMember(member.memberId)}
                                                disabled={isSubmitting}
                                                className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                            {/* 보호자 일때만 보이게 */}
                            {userRole === 'MANAGER' && (
                                <>
                                    {selectedNewChildren.map(child => (
                                        <div key={child.id} className="flex flex-col items-center relative">
                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                <img
                                                    src={child.imgUrl || defaultProfileImage}
                                                    alt={child.name}
                                                    className="w-full h-full object-cover opacity-70"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600 mt-1 text-center">{child.name}</span>
                                            <button
                                                onClick={() => handleRemoveNewChild(child.id)}
                                                disabled={isSubmitting}
                                                className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-warning"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {[...Array(4 - partyDetails.members.length - selectedNewChildren.length)].map(
                                        (_, index) => (
                                            <div
                                                key={`empty-slot-${index}`}
                                                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"
                                            >
                                                <span className="text-xs text-gray-400">+</span>
                                            </div>
                                        ),
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 아동 추가 섹션 */}
                    <div className="mt-4 flex justify-end">
                        {userRole === 'MANAGER' ? (
                            <div className="flex gap-2 w-full">
                                <select
                                    className="select select-bordered flex-1"
                                    onChange={e => {
                                        const value = Number(e.target.value);
                                        handleAddChild(value);
                                        // 선택 후 드롭다운을 초기화합니다.
                                        e.target.value = '';
                                    }}
                                    disabled={!isRegistrationEnabled || isSubmitting}
                                >
                                    <option value="" disabled selected>
                                        참여자 선택
                                    </option>
                                    {userChildren
                                        .filter(
                                            child =>
                                                !partyDetails.members.some(member => member.memberId === child.id) &&
                                                !selectedNewChildren.some(newChild => newChild.id === child.id),
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
                                    disabled={
                                        !isRegistrationEnabled || isSubmitting || selectedNewChildren.length === 0
                                    }
                                >
                                    등록하기
                                </button>
                            </div>
                        ) : (
                            userRole === 'CHILD' && (
                                <button
                                    className={`btn px-8 shadow-md hover:shadow-lg transition-shadow ${
                                        activeSchedule ? 'btn-primary' : 'btn-disabled'
                                    }`}
                                    onClick={handleJoinSession}
                                    disabled={!activeSchedule}
                                >
                                    입장하기
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* 알림 모달 */}
            <Alert modalState={alertModalState} text={alertMessage} closeHandler={closeAlertModal} />

            {/* 확인 모달 */}
            <ConfirmModal
                modalState={confirmModalState}
                text={
                    confirmModalType === 'add'
                        ? '등록하시겠습니까?'
                        : confirmModalType === 'remove' && memberToRemove
                          ? `${memberToRemove.name}을 삭제하시겠습니까?`
                          : '확인이 필요한 작업이 있습니다.'
                }
                confirmHandler={
                    confirmModalType === 'add'
                        ? submitMembers
                        : confirmModalType === 'remove'
                          ? confirmRemoveMember
                          : () => {}
                }
                cancelHandler={closeConfirmModal}
            />
        </div>
    );
};
export default BookDetail;
