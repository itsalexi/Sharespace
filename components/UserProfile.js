import Image from 'next/image';

export default function UserProfile({ user }) {
    return (
        <div className="user-profile">
            <Image
                src={user.photoURL}
                width={128}
                height={128}
                alt="photo"
                className="avatar"
            />
            <p className="user-name">@{user.username}</p>
            {user.displayName ? <p>{user.displayName}</p> : 'Anonymous User'}
        </div>
    );
}
