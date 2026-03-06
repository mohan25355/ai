import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getCategories, createComplaint } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Category, ComplaintFormData } from '@/types';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const form = useForm<ComplaintFormData>({
    defaultValues: {
      title: '',
      description: '',
      category_id: 0,
      location: '',
      photo_url: ''
    }
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      toast.error('Image size must be less than 1MB. Compressing...');
      const compressed = await compressImage(file);
      file = compressed;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `complaints/${fileName}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('hbrysjxtxfdwysonyxhp_complaint_images')
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hbrysjxtxfdwysonyxhp_complaint_images')
        .getPublicUrl(filePath);

      setPhotoUrl(urlData.publicUrl);
      form.setValue('photo_url', urlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize to max 1080p
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                toast.success(`Image compressed to ${(blob.size / 1024).toFixed(0)}KB`);
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: ComplaintFormData) {
    if (!data.category_id) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);
    try {
      // Create complaint
      const complaint = await createComplaint({
        ...data,
        photo_url: photoUrl || undefined
      });

      toast.success('Complaint submitted successfully!');

      // Trigger AI analysis in background
      setAnalyzing(true);
      
      // Import AI service
      const { triggerAIAnalysis } = await import('@/db/ai-service');
      
      triggerAIAnalysis(
        complaint.id,
        data.title,
        data.description,
        data.location
      ).then(({ success, error }) => {
        if (!success) {
          console.error('AI analysis failed:', error);
          toast.info('Complaint submitted, but AI analysis is pending. Please check back later.');
        } else {
          toast.success('AI analysis completed successfully!');
        }
      }).finally(() => {
        setAnalyzing(false);
      });

      // Navigate to track page with tracking ID
      navigate('/track', { state: { trackingId: complaint.tracking_id } });
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Submit a Complaint</h1>
            <p className="text-muted-foreground text-lg">
              Report public infrastructure issues anonymously. You'll receive a tracking ID to monitor progress.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help us understand and resolve the issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complaint Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: 'Description is required', minLength: { value: 20, message: 'Please provide at least 20 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed information about the issue, when it started, and how it affects you"
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    rules={{ required: 'Location is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address, landmark, or area name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Photo Evidence (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {photoUrl ? (
                        <div className="space-y-4">
                          <img src={photoUrl} alt="Uploaded" className="max-h-48 mx-auto rounded-md" />
                          <div className="flex items-center justify-center text-success">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Image uploaded successfully
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPhotoUrl(null);
                              form.setValue('photo_url', '');
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a photo of the issue (Max 1MB, JPEG/PNG/WEBP)
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            disabled={uploading}
                            className="max-w-xs mx-auto"
                          />
                          {uploading && (
                            <div className="mt-4 space-y-2">
                              <Progress value={uploadProgress} />
                              <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading || uploading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Complaint'
                      )}
                    </Button>
                  </div>

                  {analyzing && (
                    <div className="text-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      AI is analyzing your complaint in the background...
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
