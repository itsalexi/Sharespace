import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '../../components/ImageUploader';

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

    const deletePost = async () => {
        if (confirm('Are you sure you want to delete this post?')) {
            postRef.delete();
            router.push('/');
            toast.success('Succesfully deleted the post! (i think)');
        }
    };

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
                            <button
                                className="button btn-grey"
                                onClick={deletePost}
                            >
                                Delete
                            </button>

                            <ImageUploader />
                        </div>
                    </aside>
                </div>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState } = useForm({
        defaultValues,
        mode: 'onChange',
    });

    const { isValid, isDirty } = formState;

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
                <textarea
                    name="content"
                    {...register('content', {
                        maxLength: {
                            value: 20000,
                            message: 'Content is too long',
                        },
                        minLength: {
                            value: 10,
                            message: 'Content is too short',
                        },
                        required: {
                            value: true,
                            message: 'Content is required',
                        },
                    })}
                ></textarea>

                {formState.errors.content && (
                    <p className="error-message">
                        {formState.errors.content.message}
                    </p>
                )}

                <fieldset>
                    <input
                        type="checkbox"
                        name="published"
                        className="public-checkbox"
                        {...register('published')}
                    />
                    <label htmlFor="publisehd">Published</label>
                </fieldset>
                <button
                    type="submit"
                    className="button btn-green"
                    disabled={!isDirty || !isValid}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
