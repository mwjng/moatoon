import React, { useRef, useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';
import duck from '../../assets/duckduck.png';
import RegistInput from '../../components/member/RegistInput';
import { regist, loginIdCheck, uploadImage, sendEmailCode, checkEmailCode } from '../../api/member';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';

export default function ManagerRegistPage() {
    const navigate = useNavigate();
    const [imgFile, setImgFile] = useState('');
    const [canRegist, setCanRegist] = useState(false); // 가입 가능 여부(아이디 인증 완)
    const [modalState, setModalState] = useState(false); // 입력값 확인 모달
    const [codeCheck, setCodeCheck] = useState(false); // 이메일인증 여부
    const [registModalState, setRegistModalState] = useState(false); // 가입완료 확인 모달
    const [emailModalState, setEmailModalState] = useState(false); // 이메일전송 확인 모달
    const [codeCheckModalState, setCodeCheckModalState] = useState(false); // 코드 입력 성공 모달
    const imgRef = useRef();
    const [registState, setRegistState] = useState([
        {
            id: 'loginId',
            value: '아이디',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'email',
            value: '이메일',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'emailCode',
            value: '인증번호',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'password',
            value: '비밀번호',
            type: 'password',
            required: true,
            comment: '영어 대소문자, 특수문자, 숫자 포함 8자 이상 20자 이내',
            cmtColor: '#FF0000',
        },
        {
            id: 'confirmPassword',
            value: '비밀번호 확인',
            type: 'password',
            required: true,
            comment: '',
            cmtColor: '#000',
        },

        {
            id: 'name',
            value: '이름',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'nickname',
            value: '닉네임',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
    ]);

    const changeValue = (key, value) => {
        setRegistState(prevState => prevState.map(input => (input.id === key ? { ...input, value } : input)));
        if (key === 'loginId') {
            setRegistState(prevState =>
                prevState.map(input =>
                    input.id === 'loginId'
                        ? {
                              ...input,
                              comment: '',
                          }
                        : input,
                ),
            );
            setCanRegist(false);
        }
        if (key === 'email') {
            setCodeCheck(false);
        }
        if (key === 'password') {
            validatePassword(value);
        }

        if (key === 'confirmPassword') {
            checkPasswordMatch(value);
        }
    };

    const checkDuplicate = async loginId => {
        if (!loginId) return;

        try {
            const res = await loginIdCheck(loginId);
            if (res.status == 200) {
                setCanRegist(true);
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'loginId'
                            ? {
                                  ...input,
                                  comment: '사용 가능한 아이디입니다.',
                                  cmtColor: '#009951',
                              }
                            : input,
                    ),
                );
            }
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
            if (error.status == 409) {
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'loginId'
                            ? {
                                  ...input,
                                  comment: '중복된 아이디입니다.',
                                  cmtColor: '#FF0000',
                              }
                            : input,
                    ),
                );
            }
        }
    };

    const validatePassword = password => {
        const isValid =
            password.length >= 8 &&
            password.length <= 20 &&
            (/[A-Z]/.test(password) || /[a-z]/.test(password)) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setRegistState(prevState =>
            prevState.map(input =>
                input.id === 'password'
                    ? {
                          ...input,
                          comment: isValid
                              ? '사용 가능한 비밀번호입니다.'
                              : '영어 대소문자, 특수문자, 숫자 포함 8자 이상 20자 이내',
                          cmtColor: isValid ? '#009951' : '#FF0000',
                      }
                    : input,
            ),
        );
    };

    const checkPasswordMatch = confirmPassword => {
        const password = registState.find(input => input.id === 'password').value;
        const isMatch = password === confirmPassword;

        setRegistState(prevState =>
            prevState.map(input =>
                input.id === 'confirmPassword'
                    ? {
                          ...input,
                          comment: isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.',
                          cmtColor: isMatch ? '#009951' : '#FF0000',
                      }
                    : input,
            ),
        );
    };

    const saveImgFile = async () => {
        const file = imgRef.current.files[0];
        if (!file) return;
        const imgUrl = await uploadImage(file);

        setImgFile(imgUrl);
    };

    const registHandler = async () => {
        if (
            canRegist &&
            codeCheck &&
            registState.find(input => input.id === 'password').value ===
                registState.find(input => input.id === 'confirmPassword').value
        ) {
            const registInfo = registState.reduce(
                (acc, input) => {
                    acc[input.id] = input.value;
                    return acc;
                },
                { role: 'MANAGER', imgUrl: imgFile, children: addedChildren },
            );

            const res = await regist(registInfo, navigate);
            if (res.status === 201) {
                setRegistModalState(true);
            }
        } else {
            console.log(canRegist);
            console.log(codeCheck);
            setModalState(true);
        }
    };

    const closeModal = () => {
        setModalState(false);
    };
    const closeEmailModal = () => {
        setEmailModalState(false);
    };
    const closeRegistModal = () => {
        setRegistModalState(false);
        navigate('/login');
    };
    const checkEmail = async () => {
        try {
            const res = await sendEmailCode(registState.find(input => input.id === 'email').value);
            if (res.status == 200) {
                setEmailModalState(true);
            }
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
        }
    };
    const checkCode = async () => {
        try {
            const res = await checkEmailCode(
                registState.find(input => input.id === 'email').value,
                registState.find(input => input.id === 'emailCode').value,
            );
            if (res.status == 200) {
                setCodeCheck(true);
                setCodeCheckModalState(true);
            }
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
        }
    };
    const closeCodeModal = () => {
        setCodeCheckModalState(false);
    };
    const [searchChildId, setSearchChildId] = useState(''); // 아동 ID 검색 상태
    const [childrenList, setChildrenList] = useState([]); // 아동 목록 상태
    const [addedChildren, setAddedChildren] = useState([]); // 추가된 아동 목록

    // 아동 검색
    const searchChild = async () => {
        if (!searchChildId) return;

        try {
            const res = await searchChildById(searchChildId); // 아이디로 아동 검색 API 호출
            if (res.status === 200) {
                setSearchChildId(res.data); // 검색된 아동 목록 저장
            }
        } catch (error) {
            console.error('아동 검색 오류:', error);
        }
    };

    // 아동 추가
    const addChild = childId => {
        setAddedChildren(prevChildren => [...prevChildren, childId]);
        setSearchQuery(''); // 검색창 비우기
        setChildrenList([]); // 검색 결과 초기화
    };

    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="보호자 회원가입">
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-[#00000033] rounded-3xl">
                        <img
                            src={imgFile ? imgFile : duck}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover rounded-3xl"
                        />
                    </div>
                    <label
                        htmlFor="profileImg"
                        style={{
                            margin: '5px 0 5px 0',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            color: '#8ECAE6',
                            display: 'inline-block',
                            cursor: 'pointer',
                        }}
                    >
                        프로필 이미지 추가
                    </label>
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        id="profileImg"
                        onChange={saveImgFile}
                        ref={imgRef}
                    />
                </div>
                <RegistInput
                    inputs={registState}
                    width="300px"
                    changeFunction={changeValue}
                    checkDuplicate={checkDuplicate}
                    checkEmail={checkEmail}
                    checkCode={checkCode}
                    codeState={codeCheck}
                />
                <div className="relative  w-full">
                    <input
                        type="text"
                        value={searchChildId}
                        onChange={e => setSearchChildId(e.target.value)}
                        placeholder="아동 ID로 등록하기"
                        className="w-full rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] focus:border-[#FFBD73] bg-white"
                    />
                    <button
                        onClick={searchChild}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8ECAE6] text-white px-2 py-1 rounded-xl text-xs"
                    >
                        검색
                    </button>

                    {childrenList.length > 0 && (
                        <div className="mt-3">
                            <h4>검색된 아동들</h4>
                            <ul>
                                {childrenList.map(child => (
                                    <li key={child.id} className="flex justify-between items-center mt-2">
                                        <span>
                                            {child.name} (ID: {child.id})
                                        </span>
                                        <button
                                            onClick={() => addChild(child.id)}
                                            className="bg-[#FFBD73] text-white px-2 py-1 rounded-xl text-xs"
                                        >
                                            추가
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 추가된 아동 목록 */}
                    {addedChildren.length > 0 && (
                        <div className="mt-3">
                            <h4>추가된 아동들</h4>
                            <ul>
                                {addedChildren.map((child, index) => (
                                    <li key={index} className="mt-2">
                                        {child.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="가입하기" onClickHandler={registHandler} />
            </AuthModal>
            <AlertModal
                text="인증 메일이 발송되었습니다."
                modalState={emailModalState}
                closeHandler={closeEmailModal}
            />
            <AlertModal text="인증이 완료되었습니다." modalState={codeCheckModalState} closeHandler={closeCodeModal} />
            <AlertModal text="입력값을 확인해주세요." modalState={modalState} closeHandler={closeModal} />
            <AlertModal
                text="회원가입이 완료되었습니다."
                modalState={registModalState}
                closeHandler={closeRegistModal}
            />
        </div>
    );
}
