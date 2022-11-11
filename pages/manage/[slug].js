import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ManagePost(props) {
    return (
        <section>
            <AuthCheck>
                <PostManager />
            </AuthCheck>
        </section>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const { slug } = router.query;
    const postRef = firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('posts')
        .doc(slug);
    const [post] = useDocumentData(postRef);

    return (
        <main>
            {post && (
                <div className="manage-post">
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>
                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>
                    <aside>
                        <h3>Tools</h3>
                        <div className="tools">
                            <button
                                className="button btn-green"
                                onClick={() => setPreview(!preview)}
                            >
                                {preview ? 'Edit' : 'Preview'}
                            </button>
                            <Link href={`/${post.username}/${post.slug}`}>
                                <button className="button btn-blue">
                                    Live View
                                </button>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues,
        mode: 'onChange',
    });

    const updatePost = async ({ content, published }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });
        toast.success('Post was updated succesfully! (probably)');
    };
    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="post-preview">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? 'hidden' : 'controls'}>
                <textarea name="content" {...register('content')}></textarea>
                <fieldset>
                    <input
                        type="checkbox"
                        name="published"
                        className="public-checkbox"
                        {...register('published')}
                    />
                    <label htmlFor="publisehd">Published</label>
                </fieldset>
                <button type="submit" className="button btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
