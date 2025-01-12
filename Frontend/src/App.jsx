import { Route, Routes, useNavigate } from 'react-router-dom';
import { setNavigate } from './lib/navigation';
import Login from './pages/Login';
import ProtectedContainer from './components/ProtectedContainer';
import Home from './pages/Home';

const App = () => {
    const navigate = useNavigate();
    setNavigate(navigate);

    return (
        <Routes>
            <Route path="/" element={<ProtectedContainer />}>
                <Route index element={<Home />} />
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default App;
