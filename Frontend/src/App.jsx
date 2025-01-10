import { Route, Routes, useNavigate } from 'react-router-dom';
import { setNavigate } from './lib/navigation';
import Login from './pages/Login';

const App = () => {
    const navigate = useNavigate();
    setNavigate(navigate);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default App;
