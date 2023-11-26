import { useState } from 'react';
import styles from './App.module.scss';
import { Link, Outlet } from 'react-router-dom';
import { shopRoutes } from '@packages/shared/src/routes/shop';
import { adminRoutes } from '@packages/shared/src/routes/admin';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            Platform: {__PLATFORM__}
            <nav>
                <Link to={adminRoutes.main}>ADMIN</Link>
                <br />
                <Link to={shopRoutes.main}>SHOP</Link>
            </nav>
            {count}
            <div>
                <button className={styles.button} onClick={() => setCount((prev) => prev + 1)}>
                    +
                </button>
                <button className={styles.button} onClick={() => setCount((prev) => prev - 1)}>
                    -
                </button>
            </div>
            <Outlet />
        </div>
    );
}
