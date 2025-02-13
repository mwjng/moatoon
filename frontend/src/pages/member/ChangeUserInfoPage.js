import React, { useState } from 'react';
import ChildModify from '../../components/member/ChildModify';
import ManagerModify from '../../components/member/ManagerModify';
import CheckPw from '../../components/member/CheckPw';
import { useSelector } from 'react-redux';
import Navigation from '../../components/Navigation';
import AuthModal from '../../components/member/AuthModal';
import AlertModal from '../../components/common/AlertModal';

export default function ChangeUserInfoPage() {
    const [canModify, setCanModify] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo);
    const changeState = () => {
        setCanModify(!canModify);
    };

    return (
        <div className=" bg-[#D9F0FE] w-full h-screen">
            <Navigation />
            {canModify ? (
                userInfo.role === 'CHILD' ? (
                    <ChildModify changeState={changeState} />
                ) : (
                    <ManagerModify changeState={changeState} />
                )
            ) : (
                <CheckPw changeState={changeState} />
            )}
        </div>
    );
}
