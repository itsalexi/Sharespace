import Link from 'next/link';
import Image from 'next/image';

import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';


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
                            <button
                                className="button btn-grey"
                                onClick={() => auth.signOut()}
                            >
                                Sign out
                            </button>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image
                                    width={50}
                                    height={50}
                                    src={user?.photoURL}
                                    className="avatar"
                                    alt="photo"
                                />
                            </Link>
                        </li>
                    </div>
                )}

                {!username && (
                    <li>
                        <Link href="/enter">
                            <button
                                className="button btn-blue"
                                onClick={() => console.log(user)}
                            >
                                LOG IN
                            </button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
