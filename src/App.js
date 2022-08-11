import './App.css';

import HeaderComponent from './components/header/header.component'
import FooterComponent from "./components/footer/footer.component";

import {Route, Routes} from "react-router-dom";
import MainComponent from "./components/main/main.component";

function App() {
    return (
        <div className="App">
            <HeaderComponent/>
            <Routes>
                <Route path="/" element={<MainComponent/>}/>
            </Routes>
            <FooterComponent/>
        </div>
    );
}

export default App;
