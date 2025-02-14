import React, { useRef, useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';
import duck from '../../assets/duckduck.png';
import RegistInput from '../../components/member/RegistInput';
import { regist, loginIdCheck, uploadImage, sendEmailCode, checkEmailCode, searchChildById } from '../../api/member';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';
import { GiCancel } from 'react-icons/gi';
import Timer from '../../components/member/Timer';

export default function ManagerRegistPage() {
    const navigate = useNavigate();

    const [firstCheck, setFirstCheck] = useState(true);
    const [imgFile, setImgFile] = useState(null); // 파일 객체 저장
    const [previewUrl, setPreviewUrl] = useState(''); // 미리보기 URL 저장
    const [canRegist, setCanRegist] = useState(false); // 가입 가능 여부(아이디 인증 완)
    const [modalState, setModalState] = useState(false); // 안내메세지 상태
    const [modalText, setModalText] = useState(''); // 안내메세지 내용
    const [codeCheck, setCodeCheck] = useState(false); // 이메일인증 여부
    const [registModalState, setRegistModalState] = useState(false); // 가입완료 확인 모달
    const [searchChildId, setSearchChildId] = useState(''); // 아동 ID 검색 상태
    const [addedChildren, setAddedChildren] = useState([]); // 추가된 아동 목록
    const [isTimer, setIsTimer] = useState(false);
    const [count, setCount] = useState([]);
    const imgRef = useRef();
    const [registState, setRegistState] = useState([
        {
            id: 'loginId',
            value: '아이디',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#FF0000',
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
            comment: '',
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
            cmtColor: '#FF0000',
        },
        {
            id: 'nickname',
            value: '닉네임',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#FF0000',
        },
    ]);

    const changeValue = (key, value) => {
        setRegistState(prevState =>
            prevState.map(input => {
                if (input.id === key) {
                    let comment = '';
                    let cmtColor = '#FF0000';
                    if (key === 'loginId' || key === 'nickname') {
                        if (value.length > 20) {
                            comment = '20자 이내로 입력해주세요.';
                        }
                        if (key == 'loginId') {
                            setCanRegist(false);
                        }
                    } else if (key === 'name') {
                        if (value.length < 2 || value.length > 10) {
                            comment = '이름은 2자 이상 10자 이내로 입력해주세요.';
                        }
                    } else if (key === 'email') {
                        setCodeCheck(false);
                    } else if (key === 'password') {
                        validatePassword(value);
                    } else if (key === 'confirmPassword') {
                        checkPasswordMatch(value);
                    }
                    return { ...input, value, comment, cmtColor: comment ? '#FF0000' : '#009951' };
                }
                return input;
            }),
        );
    };

    const checkDuplicate = async loginId => {
        if (!loginId) return;

        try {
            const res = await loginIdCheck(loginId);
            if (res.status == 204) {
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
            if (error.response.data.code == 4014) {
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

    const saveImgFile = () => {
        const file = imgRef.current.files[0];
        if (!file) return;

        setImgFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    };

    const registHandler = async () => {
        if (
            canRegist &&
            codeCheck &&
            registState.find(input => input.id === 'password').value ===
                registState.find(input => input.id === 'confirmPassword').value &&
            registState.find(input => input.id === 'name').comment == ''
        ) {
            try {
                let imgUrl = null;
                if (imgFile) {
                    imgUrl = await uploadImage(imgFile); // 파일 업로드
                }

                const children = addedChildren.map(item => item.id);
                const registInfo = registState.reduce(
                    (acc, input) => {
                        acc[input.id] = input.value;
                        return acc;
                    },
                    { role: 'MANAGER', imgUrl, children },
                );

                const res = await regist(registInfo, navigate);
                if (res.status === 201) {
                    setRegistModalState(true);
                }
            } catch (error) {
                console.error('회원가입 오류:', error);
                setModalText('회원가입 중 오류가 발생했습니다.');
                setModalState(true);
            }
        } else {
            setModalText('입력값을 확인해주세요.');
            setModalState(true);
        }
    };

    const closeModal = () => {
        setModalState(false);
        setModalText('');
    };

    const closeRegistModal = () => {
        setRegistModalState(false);
        navigate('/login');
    };
    const checkEmail = async () => {
        setCodeCheck(false);
        try {
            const res = await sendEmailCode(registState.find(input => input.id === 'email').value);
            if (res.status == 204) {
                setIsTimer(true);
                setCount(180);
                setFirstCheck(false);
                setModalText('인증 메일이 발송되었습니다.');
                setModalState(true);
            }
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
            if (error.response.data.code == 4015) {
                setModalText('중복된 이메일입니다.');
                setModalState(true);
            } else if (error.status == 500) {
                setModalText('이메일을 발송할 수 없습니다. 잠시 후 다시 시도해주세요.');
                setModalState(true);
            }
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
                setModalText('인증이 완료되었습니다.');
                setIsTimer(false);
                setModalState(true);
            }
        } catch (error) {
            if (error.status == 400) {
                setModalText('인증시간이 만료되었습니다.');
                setModalState(true);
            }
            if (error.status == 500) {
                setModalText('잘못된 코드입니다.');
                setModalState(true);
            }
            console.error('아이디 중복 확인 오류:', error);
        }
    };

    // 아동 검색
    const searchChild = async () => {
        let canAdd = true;
        if (!searchChildId) return;
        addedChildren.forEach(child => {
            if (child['loginId'] == searchChildId) {
                setModalText('이미 추가된 아동입니다.');
                setModalState(true);
                canAdd = false;
                return;
            }
        });
        if (canAdd) {
            try {
                const res = await searchChildById(searchChildId);
                if (res.status === 200) {
                    setSearchChildId('');
                    setAddedChildren(prev => [...prev, res.data]);
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const { code } = error.response.data;
                    if (code === 4017) {
                        setModalText('이미 등록된 아동입니다.');
                    } else if (code === 4013) {
                        setModalText('존재하지 않는 아동입니다.');
                    } else {
                        setModalText('아동 검색 중 오류가 발생했습니다.');
                    }
                } else {
                    setModalText('아동 검색 요청이 실패했습니다.');
                }
                setSearchChildId('');
                setModalState(true);
            }
        }
    };

    const deleteChild = idx => {
        setAddedChildren(addedChildren.filter((item, index) => index != idx));
    };

    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="보호자 회원가입">
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-[#00000033] rounded-3xl">
                        <img
                            src={previewUrl || duck} // 미리보기 URL 없으면 기본 이미지 사용
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
                    isTimer={isTimer}
                    count={count}
                    setCount={setCount}
                    firstCheck={firstCheck}
                />
                <div className="relative  w-full">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={searchChildId}
                            onChange={e => setSearchChildId(e.target.value)}
                            placeholder="아동 ID로 등록하기"
                            className="flex-1 rounded-3xl shadow-md p-1 pr-3 pl-3 outline-none border-[2px] focus:border-[#FFBD73] bg-white"
                        />
                        <button onClick={searchChild} className="bg-[#8ECAE6] text-white px-3 py-2 rounded-2xl text-xs">
                            검색
                        </button>
                    </div>

                    {addedChildren.length > 0 && (
                        <div className="mt-3">
                            <ul className="w-[300px] flex overflow-x-auto whitespace-nowrap gap-2">
                                {addedChildren.map((child, index) => (
                                    <dic className="flex">
                                        <li key={index} className="mt-1 inline-block">
                                            {child.name}
                                        </li>
                                        <GiCancel className="w-3" onClick={e => deleteChild(index)} />
                                    </dic>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="가입하기" onClickHandler={registHandler} />
            </AuthModal>

            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
            <AlertModal
                text="회원가입이 완료되었습니다."
                modalState={registModalState}
                closeHandler={closeRegistModal}
            />
        </div>
    );
}
