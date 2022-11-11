import Link from 'next/link';
import Image from 'next/image';

import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function Navbar() {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <Link href="/" className="logo">
                    SHARESPACE
                </Link>

                {username && (
                    <div className="navbar-right">
                        <li>
                            <Link href="/manage">
                                <button className="button btn-blue">
                                    Write Posts
                                </button>
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
