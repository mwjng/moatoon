import React, { useEffect, useRef, useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';
import bbi from '../../assets/bbi.png';
import RegistInput from '../../components/member/RegistInput';
import { regist, loginIdCheck, uploadImage } from '../../api/member';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';

export default function ChildRegistPage() {
    const navigate = useNavigate();
    const [imgFile, setImgFile] = useState(null); // 파일 객체 저장
    const [previewUrl, setPreviewUrl] = useState(''); // 미리보기 URL 저장
    const [canRegist, setCanRegist] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [registModalState, setRegistModalState] = useState(false);
    const imgRef = useRef();
    const [registState, setRegistState] = useState([
        {
            id: 'loginId',
            placeholder: '아이디',
            value: '',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'password',
            placeholder: '비밀번호',
            value: '',
            type: 'password',
            required: true,
            comment: '',
            cmtColor: '#FF0000',
        },
        {
            id: 'confirmPassword',
            placeholder: '비밀번호 확인',
            value: '',
            type: 'password',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'name',
            placeholder: '이름',
            value: '',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'nickname',
            placeholder: '닉네임',
            value: '',
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
    ]);
    useEffect(() => {
        const password = registState.find(input => input.id === 'password')?.value || '';
        const confirmPassword = registState.find(input => input.id === 'confirmPassword')?.value || '';

        let comment = '';
        let cmtColor = '#FF0000';

        if (!confirmPassword) {
            comment = '비밀번호 확인 값을 입력해주세요.';
        } else if (password === confirmPassword) {
            comment = '비밀번호가 일치합니다.';
            cmtColor = '#009951';
        } else {
            comment = '비밀번호가 일치하지 않습니다.';
        }

        setRegistState(prevState =>
            prevState.map(input => (input.id === 'confirmPassword' ? { ...input, comment, cmtColor } : input)),
        );
    }, [
        registState.find(input => input.id === 'password')?.value,
        registState.find(input => input.id === 'confirmPassword')?.value,
    ]);
    const changeValue = (key, value) => {
        setRegistState(prevState => prevState.map(input => (input.id === key ? { ...input, value } : input)));

        if (key === 'loginId') {
            if (value.length > 20) {
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'loginId'
                            ? { ...input, comment: '20자 이내로 입력해주세요.', cmtColor: '#FF0000' }
                            : input,
                    ),
                );
            } else {
                setRegistState(prevState =>
                    prevState.map(input => (input.id === 'loginId' ? { ...input, comment: '' } : input)),
                );
            }
            setCanRegist(false);
        }

        if (key === 'password') {
            validatePassword(value);
        }

        if (key === 'name') {
            if (value.length < 2 || value.length > 10) {
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'name'
                            ? { ...input, comment: '이름은 2자 이상 10자 이하여야 합니다.', cmtColor: '#FF0000' }
                            : input,
                    ),
                );
            } else {
                setRegistState(prevState =>
                    prevState.map(input => (input.id === 'name' ? { ...input, comment: '', cmtColor: '#000' } : input)),
                );
            }
        }
        if (key === 'nickname') {
            if (value.length > 20) {
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'nickname'
                            ? { ...input, comment: '닉네임은 20자 이내로 설정해주세요.', cmtColor: '#FF0000' }
                            : input,
                    ),
                );
            } else {
                setRegistState(prevState =>
                    prevState.map(input =>
                        input.id === 'nickname' ? { ...input, comment: '', cmtColor: '#000' } : input,
                    ),
                );
            }
        }
    };

    const checkDuplicate = async loginId => {
        if (loginId.length > 20 || !loginId) {
            setModalText('아이디 값을 확인해주세요.');
            setModalState(true);
            return;
        }

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

    const saveImgFile = () => {
        const file = imgRef.current.files[0];
        if (!file) return;

        setImgFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    };

    const registHandler = async () => {
        if (
            canRegist &&
            registState.find(input => input.id === 'password').value ===
                registState.find(input => input.id === 'confirmPassword').value &&
            registState.find(input => input.id === 'name').comment == ''
        ) {
            let imgUrl = null;
            if (imgFile) {
                imgUrl = await uploadImage(imgFile); // 파일 업로드
            }
            const registInfo = registState.reduce(
                (acc, input) => {
                    acc[input.id] = input.value;
                    return acc;
                },
                { role: 'CHILD', imgUrl },
            );

            const res = await regist(registInfo, navigate);

            if (res.status === 201) {
                setRegistModalState(true);
            }
        } else {
            setModalText('입력값을 확인해주세요.');
            setModalState(true);
        }
    };

    const closeModal = () => {
        setModalState(false);
    };
    const closeRegistModal = () => {
        setRegistModalState(false);
        navigate('/login');
    };

    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="아동 회원가입">
                <div className="flex gap-2">
                    <div className="w-10 h-10 bg-[#00000033] rounded-3xl">
                        <img
                            src={previewUrl || bbi} // 미리보기 URL 없으면 기본 이미지 사용
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
                />
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
