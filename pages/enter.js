import Image from 'next/image';
import { auth, googleAuthProvider, firestore } from '../lib/firebase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';
export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            {
                // If there's a user logged in, check if they have a username
                user ? (
                    // If they don't have a username yet show username form
                    // otherwise show signout
                    !username ? (
                        <UsernameForm />
                    ) : (
                        <SignOutButton />
                    )
                ) : (
                    // Show signin if there is no user logged in
                    <SignInButton />
                )
            }
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

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image width={50} height={50} src="/google.png" alt="google" />
            Sign in with Google
        </button>
    );
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign out</button>;
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

    const onSubmit = () => {
        console.log('nothing 4 now');
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    return (
        !username && (
            <section>
                <h3>Choose a username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={formValue}
                        onChange={onChange}
                    />

                    <button
                        type="submit"
                        className="btn-green"
                        disabled={!isValid}
                    >
                        Choose Username
                    </button>

                    <div>Username Valid: {isValid.toString()}</div>
                </form>
            </section>
        )
    );
}
