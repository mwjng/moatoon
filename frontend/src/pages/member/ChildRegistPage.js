import React, { useRef, useState } from 'react';
import Background from '../../components/member/Backround';
import AuthModal from '../../components/member/AuthModal';
import Btn from '../../components/member/Btn';
import bbi from '../../assets/bbi.png';
import RegistInput from '../../components/member/RegistInput';
import { loginIdCheck } from '../../api/member';

export default function ChildRegistPage() {
    const [imgFile, setImgFile] = useState('');
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
            id: 'password',
            value: '비밀번호',
            type: 'password',
            required: true,
            comment: '',
            cmtColor: '#000',
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
            console.log(res);
            // setRegistState(prevState =>
            //     prevState.map(input =>
            //         input.id === 'loginId'
            //             ? {
            //                   ...input,
            //                   comment: res.data.available ? '사용 가능한 아이디입니다.' : '중복된 아이디입니다.',
            //                   cmtColor: res.data.available ? '#009951' : '#FF0000',
            //               }
            //             : input,
            //     ),
            // );
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
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
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };
    return (
        <div style={{ position: 'relative' }}>
            <Background />
            <AuthModal title="아동 회원가입">
                <div className="flex gap-2">
                    <div className="w-10 h-10 bg-[#00000033] rounded-3xl">
                        <img src={imgFile ? imgFile : bbi} alt="프로필 이미지" />
                    </div>
                    <label
                        htmlFor="profileImg"
                        style={{
                            margin: '5px 0 20px 0',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            color: '#0095f6',
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
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="가입하기" />
            </AuthModal>
        </div>
    );
}
