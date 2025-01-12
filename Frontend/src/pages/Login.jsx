import { Button, Form, Input } from '@nextui-org/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const loginSchema = z
    .object({
        email: z.string().email().optional(),
        username: z.string().optional(),
        password: z.string().min(6),
    })
    .refine((data) => {
        if (!data.email && !data.username) {
            return {
                email: 'Email or username is required',
                username: 'Email or username is required',
            };
        }
        return true;
    });

const Login = () => {
    const dispatch = useDispatch();

    // const redirectUrl = location.state?.redirectUrl || '/'; // redirect the user to the page they were trying to access before logging in otherwise to the home page

    const [useEmail, setUseEmail] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const { isSuccess, isError, message, isLoading } = useSelector((state) => state.auth);

    const onSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                email: useEmail ? email : undefined,
                username: useEmail ? undefined : username,
                password,
            };

            const result = loginSchema.safeParse(data);

            dispatch(login(result.data));
            console.log(isSuccess);
            // if (isSuccess) navigate(redirectUrl, { replace: true });

            console.log('Form submitted successfully!', data);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = {};
                err.errors.forEach((error) => {
                    fieldErrors[error.path[0]] = error.message;
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <div className="flex min-h-[100vh] justify-center items-center">
            <div className="border-2 border-gray-600 py-8 px-6 rounded-md max-w-md w-full">
                <Form
                    validationBehavior="native"
                    onSubmit={onSubmit}
                    className="text-center"
                >
                    <h1 className="text-3xl font-semibold">Login</h1>
                    {useEmail ? (
                        <>
                            <Input
                                required
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">
                                    {errors.email}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <Input
                                required
                                name="username"
                                type="text"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs">
                                    {errors.username}
                                </p>
                            )}
                        </>
                    )}
                    <p className="text-sm">
                        Use{' '}
                        <span
                            className="text-primary cursor-pointer"
                            onClick={() => setUseEmail(!useEmail)}
                        >
                            {useEmail ? 'username' : 'email'}
                        </span>{' '}
                        instead
                    </p>
                    <>
                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs">
                                {errors.password}
                            </p>
                        )}
                    </>

                    <Button color="primary" type="submit" className="mt-4" isDisabled={(!email && !username) || password.length < 6} isLoading={isLoading}>
                        Log in
                    </Button>
                    {isError && (
                        <p className="text-red-500 text-xs">{message}</p>
                    )}
                </Form>
                <p className="mt-4 text-sm">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-primary">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
