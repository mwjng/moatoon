import { Provider } from 'react-redux';
import RendingPage from './pages/RendingPage';
import store from './store/store';

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                {/* <header className="App-header">
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header> */}
                <RendingPage />
            </div>
        </Provider>
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
