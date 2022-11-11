import Link from 'next/link';

export default function Custom404() {
    return (
        <main className='error-page'>
            <h1>404 - The page you are looking for does not exist</h1>

            <iframe
                src="https://giphy.com/embed/g01ZnwAUvutuK8GIQn"
                width="480"
                height="270"
                frameBorder="0"
                allowFullScreen
            ></iframe>

            <Link href="/">
                <button className="button btn-blue">Go home</button>
            </Link>
        </main>
    );
}
