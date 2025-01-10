import { Button, Form, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
    const [useEmail, setUseEmail] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Form
                validationBehavior="native"
                onSubmit={onSubmit}
                className="border border-gray-200 rounded-md max-w-md w-full"
            >
                <Input
                    name="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <Input
                    name="username"
                    type="text"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
                <Input
                    name="password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                />

                <Button type="submit">Log in</Button>
            </Form>
        </div>
    );
};

export default Login;
