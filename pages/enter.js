import Image from 'next/image';
import { auth, googleAuthProvider } from '../lib/firebase';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

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
    const [isValid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
}
