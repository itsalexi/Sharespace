import Link from 'next/link';
import Image from 'next/image';
export default function Navbar() {
    // const { user, username } = {};
    const user = null;
    const username = null;

    return (
        <nav className="navbar">
            <ul>
                <Link href="/">
                    <button className="button btn-logo">SHARESPACE</button>
                </Link>

                {username && (
                    <div className='navbar-right'>
                        <li>
                            <Link href="/manage">
                                <button className="button btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image src={user?.photoURL} alt="photo" />
                            </Link>
                        </li>
                    </div>
                )}

                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="button btn-blue">LOG IN</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
