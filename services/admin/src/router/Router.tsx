import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import App from '@/components/App/App';
import { About } from '@/pages/About';

const routes = [
    {
        path: '/admin',
        element: <App />,
        children: [
            {
                path: '/admin/about',
                element: (
                    <Suspense fallback={'Loading...'}>
                        <About />
                    </Suspense>
                ),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);

export default routes;
