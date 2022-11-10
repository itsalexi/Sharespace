import Navbar from '../components/Navbar';
import '../styles/globals.css';

import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
        </>
    );
}

export default MyApp;
