import React, { useRef, useState } from 'react';
import Btn from '../../components/member/Btn';
import bbi from '../../assets/bbi.png';
import AuthModal from '../../components/member/AuthModal';
import ModifyInput from '../../components/member/ModifyInput';
import { uploadImage, modify, removeMember } from '../../api/member';
import { useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';
import { useSelector } from 'react-redux';
import Navigation from '../../components/Navigation';
import ConfirmModal from '../common/ConfirmModal';

export default function ChildModify(props) {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);
    const [imgFile, setImgFile] = useState('');
    const [previewUrl, setPreviewUrl] = useState(userInfo.imageUrl);
    const [modalState, setModalState] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [modalText, setModalText] = useState('');
    const imgRef = useRef(userInfo.imageUrl);
    const [modifyState, setModifyState] = useState([
        {
            id: 'loginId',
            label: '아이디',
            default: userInfo.loginId,
            type: 'text',
            disabled: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'password',
            value: '',
            placeholder: '새로운 비밀번호',
            type: 'password',
            required: true,
            comment: '영어 대소문자, 특수문자, 숫자 포함 8자 이상 20자 이내',
            cmtColor: '#FF0000',
        },
        {
            id: 'confirmPassword',
            value: '',
            placeholder: '비밀번호 확인',
            type: 'password',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'name',
            label: '이름',
            default: userInfo.name,
            type: 'text',
            disabled: true,
            comment: '',
            cmtColor: '#000',
        },
        {
            id: 'nickname',
            label: '닉네임',
            value: userInfo.nickname,
            default: userInfo.nickname,
            type: 'text',
            required: true,
            comment: '',
            cmtColor: '#000',
        },
    ]);

    const changeValue = (key, value) => {
        setModifyState(prevState => prevState.map(input => (input.id === key ? { ...input, value } : input)));

        if (key === 'password') {
            validatePassword(value);
        }

        if (key === 'confirmPassword') {
            checkPasswordMatch(value);
        }
        if (key === 'nickname') {
            if (value.length > 20) {
                setModifyState(prevState =>
                    prevState.map(input =>
                        input.id === 'nickname'
                            ? { ...input, comment: '닉네임은 20자 이내로 설정해주세요.', cmtColor: '#FF0000' }
                            : input,
                    ),
                );
            } else {
                setModifyState(prevState =>
                    prevState.map(input =>
                        input.id === 'nickname' ? { ...input, comment: '', cmtColor: '#000' } : input,
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

        setModifyState(prevState =>
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
        const password = modifyState.find(input => input.id === 'password').value;
        const isMatch = password === confirmPassword;

        setModifyState(prevState =>
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

    const saveImgFile = event => {
        const file = event.target.files[0];
        if (!file) return;

        const fileURL = URL.createObjectURL(file);
        setPreviewUrl(fileURL); // 미리보기 이미지 변경
        setImgFile(file); // 업로드할 파일 저장 (업로드는 아직 안 함)
    };

    const modifyHandler = async () => {
        let uploadedImgUrl = userInfo.imageUrl; // 기본적으로 기존 이미지 유지

        if (imgFile && imgFile !== userInfo.imageUrl) {
            // 새 이미지가 선택된 경우만 업로드
            try {
                uploadedImgUrl = await uploadImage(imgFile); // 실제 업로드 수행
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                setModalText('이미지 업로드에 실패했습니다.');
                setModalState(true);
                return;
            }
        }
        if (
            modifyState.find(input => input.id === 'password').value ===
                modifyState.find(input => input.id === 'confirmPassword').value &&
            modifyState.find(input => input.id === 'nickname').comment == '' &&
            modifyState.find(input => input.id === 'nickname').value.length > 0
        ) {
            const modifyInfo = modifyState.reduce(
                (acc, input) => {
                    acc[input.id] = input.value;
                    return acc;
                },
                { role: 'CHILD', imgUrl: uploadedImgUrl },
            );

            const res = await modify(modifyInfo);
            console.log(res);
            if (res.status === 200) {
                setModalText('회원정보 수정이 완료되었습니다.');
                setModalState(true);
            }
        } else {
            setModalText('입력값을 확인해주세요');
            setModalState(true);
        }
    };

    const closeModal = () => {
        setModalState(false);
        if (modalText === '회원정보 수정이 완료되었습니다.') {
            props.changeState();
        }
    };

    const removeHandler = () => {
        setConfirmModalState(true);
    };

    const deleteConfirm = async () => {
        try {
            const res = await removeMember();
            if (res.status == 200) {
                localStorage.removeItem('accessToken');
                navigate('/', { state: { fromLogout: true } });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const closeConfirm = () => {
        setConfirmModalState(false);
    };

    return (
        <>
            <AuthModal title="회원정보 수정" top={true}>
                <div className="flex gap-2">
                    <div className="w-10 h-10 bg-[#00000033] rounded-3xl">
                        <img
                            src={previewUrl || bbi}
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
                        프로필 이미지 변경
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
                <ModifyInput inputs={modifyState} width="300px" changeFunction={changeValue} />
                <Btn bgColor="#FFBD73" bgHoverColor="#FFB25B" text="변경하기" onClickHandler={modifyHandler} />
                <p style={{ cursor: 'pointer', fontSize: '14px', color: '#aaa' }} onClick={removeHandler}>
                    탈퇴하기
                </p>
            </AuthModal>
            <AlertModal text={modalText} modalState={modalState} closeHandler={closeModal} />
            <ConfirmModal
                text="정말 탈퇴하시겠습니까?"
                confirmHandler={deleteConfirm}
                cancelHandler={closeConfirm}
                modalState={confirmModalState}
            />
        </>
    );
}
