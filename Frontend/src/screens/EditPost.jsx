import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tag, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [existingImage, setExistingImage] = useState('');


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/blogs/getPost/${id}`);
                setTitle(data.title);
                setContent(data.content);
                if (data.tags) {
                    
                    let parsedTags;
                    try {
                        // Handle nested JSON strings
                        const parsed = JSON.parse(data.tags);
                        parsedTags = Array.isArray(parsed) ? parsed : JSON.parse(parsed);
                    } catch {
                        // If parsing fails, treat as regular array or string
                        parsedTags = Array.isArray(data.tags) ? data.tags : [data.tags];
                    }
                    setTags(parsedTags);
                }
                setExistingImage(data.image);
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error('Failed to load post');
            }
        };
        fetchPost();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setExistingImage('');
    };

    const addTag = (tagInput) => {
        if (!tagInput) return;
        const trimmedTag = tagInput.trim();
        if (!tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);
        
        formData.append('tags', JSON.stringify(tags));
        console.log('normale tags ' ,tags);
        console.log('json atawich ',JSON.stringify(tags));
        

        try {
            await axios.put(
                `http://localhost:8000/api/blogs/updatePost/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );

            toast.success('Post updated successfully');
            navigate(`/post`);
        } catch (error) {
            console.error('Error updating post:', error.message);
            toast.error('Failed to update post');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Toaster richColors />
            <h1 className="text-3xl font-serif mb-6">Edit Post</h1>
            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Title */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        className="text-2xl font-semibold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Image */}
                <div>
                    <Label htmlFor="image">Cover Image</Label>
                    {existingImage && (
                        <div className="mt-2">
                            <img
                                src={`http://localhost:8000${existingImage}`}
                                alt="Existing cover"
                                className="w-full h-64 object-cover rounded-md"
                            />
                        </div>
                    )}
                    <div className="mt-2">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        rows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Tags */}
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

                {/* Update Button */}
                <div className="flex justify-end">
                    <Button type="submit">Update Post</Button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;
