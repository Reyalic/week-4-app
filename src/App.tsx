import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.scss';

import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <Header/>
            <Body/>
            <Footer/>
        </div>
    );
}

export default App;
