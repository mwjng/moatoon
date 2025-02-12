// pages/MainPage.js
import { useSelector } from 'react-redux';
import ChildMainPage from './ChildMainPage';
import ManagerMainPage from './ManagerMainPage';
import { useNavigate } from 'react-router';

const MainPage = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const navigate = useNavigate();

    if (!userInfo) {
        navigate('/login');
        // return <Navigate to="/login" replace />;
    }

    // 사용자 역할에 따라 다른 컴포넌트 렌더링
    return (
        <>
            {userInfo.role === 'CHILD' && <ChildMainPage />}
            {userInfo.role === 'MANAGER' && <ManagerMainPage />}
        </>
    );
};

export default MainPage;
