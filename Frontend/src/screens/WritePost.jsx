import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tag, X } from 'lucide-react';
import { toast, Toaster } from 'sonner'


const WritePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };


    const addTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };


    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);
        formData.append('tags', JSON.stringify(tags));

        try {
            const response = await axios.post(
                'http://localhost:8000/api/blogs/createPost',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );

            console.log('Post created successfully!', response.data);
            toast.success('Your post has been published');

            setTitle('');
            setContent('');
            setImage(null);
            setTags([]);
        } catch (error) {
            console.error('Post submission error:', error.response?.data || error.message);
            toast.error('Failed to publish post');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Toaster richColors />
            <h1 className="text-3xl font-serif mb-6">Write a Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title  */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        className="text-2xl font-semibold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Image  */}
                <div>
                    <Label htmlFor="image">Cover Image</Label>
                    <div className="mt-2">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                {/* Content  */}
                <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        rows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Tags  */}
                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center mt-2">
                        <Input
                            id="tags"
                            placeholder="Add a tag"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="ml-2"
                            onClick={() => {
                                const input = document.getElementById('tags');
                                addTag(input.value);
                                input.value = '';
                            }}
                        >
                            <Tag className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center"
                            >
                                {tag}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => removeTag(tag)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="flex justify-end">
                    <Button type="submit">Publish Post</Button>
                </div>
            </form>
        </div>
    );
};

export default WritePage;