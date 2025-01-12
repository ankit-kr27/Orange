import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store.js';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <NextUIProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <main className="dark text-foreground bg-background">
                        <App />
                    </main>
                </BrowserRouter>
            </Provider>
        </NextUIProvider>
    </StrictMode>
);
