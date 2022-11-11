import Image from 'next/image';
import { auth, googleAuthProvider, firestore } from '../lib/firebase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';
import { updateProfile } from 'firebase/auth';

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);

    return (
        <main className="enter-page">
            <div className="text">
                <h1 className="center">Welcome back!</h1>
                <p>It&apos;s good to see you again</p>
            </div>

            <div className="login-box">
                {
                    // If there's a user logged in, check if they have a username
                    user ? (
                        // If they don't have a username yet show username form
                        // otherwise show signout
                        !username ? (
                            <>
                                <p className="login-text medium">Wait!</p>
                                <p className="login-text">
                                    You haven&apos;t chosen a username yet!
                                </p>
                                <UsernameForm />
                            </>
                        ) : (
                            <div className='sign-out-box'>
                                <p className="login-text medium">Is this you?</p>
                                <p className="login-text">
                                    You are currently signed in as {username}
                                </p>
                                <SignOutButton />
                            </div>
                        )
                    ) : (
                        // Show signin if there is no user logged in
                        <SignInButton />
                    )
                }
            </div>
        </main>
    );
}

function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider);
        } catch (err) {
            console.log(err);
        }
    };
    const signInAnonymously = async () => {
        try {
            await auth.signInAnonymously();
            await updateProfile(auth.currentUser, {
                photoURL:
                    'https://firebasestorage.googleapis.com/v0/b/sharespace-60dd2.appspot.com/o/default.jpeg?alt=media',
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='sign-in-buttons'>
            <button className="button btn-logobtn" onClick={signInWithGoogle}>
                <Image width={32} height={32} src="/google.png" alt="google" />
                Sign in with Google
            </button>
            <button className="button btn-logobtn" onClick={signInAnonymously}>
                <Image width={32} height={32} src="/google.png" alt="google" />
                Sign in Anonymously
            </button>
        </div>
    );
}

function SignOutButton() {
    return (
        <button className="button btn-blue" onClick={() => auth.signOut()}>
            Sign out
        </button>
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking if {username} is valid.</p>;
    } else if (isValid) {
        return <p>{username} is available!</p>;
    } else if (username && !isValid) {
        return <p>Sorry, {username} is already taken or is invalid.</p>;
    } else {
        return <p></p>;
    }
}
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log('Read executed');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName,
        });
        batch.set(usernameDoc, { uid: user.uid });

        try {
            await batch.commit();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    return (
        !username && (
            <section className="username-form">
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formValue}
                        onChange={onChange}
                        className="username-input"
                    />

                    <UsernameMessage
                        username={formValue}
                        isValid={isValid}
                        loading={loading}
                    />

                    <button
                        type="submit"
                        className="button btn-blue username"
                        disabled={!isValid}
                    >
                        Choose Username
                    </button>
                </form>
            </section>
        )
    );
}
