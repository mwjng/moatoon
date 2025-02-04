<<<<<<< HEAD
import RendingPage from "./pages/RendingPage";
=======
import React from "react";
import ImageGenerator from "./components/ImageGenerator"; // OpenAI 이미지 생성 컴포넌트 추가
>>>>>>> b9d4c65e2c0a7b3714eb02823dfe8d73d2586a50

function App() {
    return (
        <div className="App">
<<<<<<< HEAD
            {/* <header className="App-header">
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a class Name="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header> */}
            <RendingPage />
=======
            <header className="App-header">
                <h1>환영합니다! AI 이미지 생성기를 사용해보세요.</h1>
                <ImageGenerator /> {/* 이미지 생성 컴포넌트 추가 */}
            </header>
>>>>>>> b9d4c65e2c0a7b3714eb02823dfe8d73d2586a50
        </div>
    );
}

export default App;




// function App() {
//     return (
//         <div className="App">
//             <header className="App-header">
//                 <p>
//                     Edit <code>src/App.js</code> and save to reload.
//                 </p>
//                 <a class Name="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
//                     Learn React
//                 </a>
//             </header>
//         </div>
//     );
// }

// export default App;
