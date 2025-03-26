import React, { useEffect, useState } from 'react';
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem('ussr');
        if (user) navigate('/dashboard');
    }, [navigate]);
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
        // Basic validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('http://13.239.184.38:6500/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                // Store token if provided in response
                if (data) {
                    localStorage.setItem('ussr', JSON.stringify(data));
                }
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('Username or Password is incorrect!');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <section className="h-screen p-2 pe-4">
            <div className="h-full">
                <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="w-full"
                            alt="Sample image"
                        />
                    </div>

                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                    <img className="mx-auto" width="300" height="300" src="https://artisan.psic-erp.com/Content/images/bg/Logo.jpeg" alt="" />


                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <p className="mb-0 mr-4 text-lg">Sign in</p>
                            </div>


                            <TEInput
                                type="text"
                                label="Username"
                                size="lg"
                                className="mb-6"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.trim())}
                            />

                            <TEInput
                                type="password"
                                label="Password"
                                className="mb-6"
                                size="lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className="mb-6 flex items-center justify-between">
                                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                    <input
                                        type="checkbox"
                                        id="exampleCheck2"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none checked:border-primary checked:bg-primary checked:before:opacity-[0.16] hover:cursor-pointer dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary"
                                    />
                                    <label
                                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                        htmlFor="exampleCheck2"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="text-center lg:text-left">
                                <TERipple rippleColor="light">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Login...
                                            </span>
                                        ) : (
                                            'Login'
                                        )}
                                    </button>
                                </TERipple>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;