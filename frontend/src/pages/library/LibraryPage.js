import React, { useRef, useEffect, useState } from 'react';
import ManagerLibrary from '../../components/library/ManagerLibrary.js'; // Manager 페이지 컴포넌트
import ChildLibrary from '../../components/library/ChildLibrary.js'; // Child 페이지 컴포넌트
import { useSelector } from 'react-redux';

function LibraryPage() {
    const userInfo = useSelector(state => state.user.userInfo);
    console.log(userInfo);
    // userInfo의 role이 'manager'인 경우에 따라 다른 페이지 렌더링
    return <div>{userInfo.role === 'MANAGER' ? <ManagerLibrary /> : <ChildLibrary />}</div>;
}

export default LibraryPage;
