import { firestore, auth, serverTimestamp } from '../lib/firebase';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { capitalize } from '../lib/helper';
import { formatRelative } from 'date-fns';
import AuthCheck from './AuthCheck';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../lib/context';
import toast from 'react-hot-toast';

export default function Comments({ postRef }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const unsubscribe = postRef
            .collection('comments')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) =>
                setComments(snapshot.docs.map((x) => x.data()))
            );
        return unsubscribe;
    }, [postRef]);

    return (
        <div className="comment-list">
            <h2>Comments</h2>
            <AuthCheck>
                <CommentForm postRef={postRef} />
            </AuthCheck>
            {comments.map((comment) => (
                <div key={comment.createdAt?.seconds} className="comment">
                    <div className="comment-avatar">
                        <Image
                            src={comment.photoURL}
                            alt="avatar"
                            width={48}
                            height={48}
                        ></Image>
                    </div>
                    <div className="comment-content">
                        <div className="comment-header">
                            <p className="comment-author">{comment.name}</p>
                            <div className="comment-divider">•</div>
                            <p className="comment-date">
                                {comment.createdAt
                                    ? comment.createdAt.seconds
                                        ? capitalize(
                                              formatRelative(
                                                  comment.createdAt.seconds *
                                                      1000,
                                                  Date.now()
                                              )
                                          )
                                        : null
                                    : null}
                            </p>
                        </div>
                        {comment.message}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CommentForm({ postRef }) {
    const [commentMessage, setCommentMessage] = useState('');
    const { username } = useContext(UserContext);

    const sendComment = async (e) => {
        e.preventDefault();
        const comment = postRef.collection('comments').doc();
        const batch = firestore.batch();
        const data = {
            createdAt: serverTimestamp(),
            message: commentMessage,
            name: username,
            photoURL: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
        };
        batch.set(comment, data);
        setCommentMessage('');
        await batch.commit();
        toast.success('Comment posted!');
    };

    const onEnterPress = async (e) => {
        if (
            e.keyCode === 13 &&
            e.shiftKey == false &&
            !onlySpaces(commentMessage)
        ) {
            await sendComment(e);
        }
    };

    const onlySpaces = (str) => {
        if (!str.replace(/\s+/g, '').length) {
            toast.error('You are trying to post a comment without any content');
            return true;
        } else {
            return false;
        }
    };
    return (
        <form onSubmit={(e) => sendComment(e)}>
            <div className="comment-form-section">
                <Image
                    src={auth?.currentUser?.photoURL}
                    alt="avatar"
                    width={48}
                    height={48}
                    className="avatar"
                ></Image>
                <TextareaAutosize
                    className="comment-box"
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    placeholder="Write a comment!"
                    onKeyDown={onEnterPress}
                    required={true}
                ></TextareaAutosize>
                <button className="button btn-green" type="submit">
                    Post
                </button>
            </div>
        </form>
    );
}
