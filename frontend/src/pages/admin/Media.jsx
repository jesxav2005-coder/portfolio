import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import UploadZone from '../../components/admin/UploadZone';
import Loader from '../../components/common/Loader';

export const Media = () => {
  const { 
    adminGetProfile, 
    adminUpdateProfile,
    adminUploadPhoto, 
    adminUploadVideo, 
    adminUploadResume 
  } = useApi();
  const queryClient = useQueryClient();

  // Fetch Profile to read current media URLs
  const { data: profile, isLoading } = useQuery({
    queryKey: ['adminProfileMedia'],
    queryFn: async () => {
      const res = await adminGetProfile();
      return res.data.data;
    }
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) => adminUploadPhoto(formData),
    onSuccess: () => {
      toast.success('Profile photo uploaded successfully!');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  const uploadVideoMutation = useMutation({
    mutationFn: (formData) => adminUploadVideo(formData),
    onSuccess: () => {
      toast.success('Intro video uploaded successfully!');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (formData) => adminUploadResume(formData),
    onSuccess: () => {
      toast.success('Resume PDF uploaded successfully!');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  // Handle deletions by updating profile model with null values
  const deletePhotoMutation = useMutation({
    mutationFn: () => adminUpdateProfile({ ...profile, photo_url: null }),
    onSuccess: () => {
      toast.success('Profile photo deleted.');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: () => adminUpdateProfile({ ...profile, video_url: null }),
    onSuccess: () => {
      toast.success('Intro video deleted.');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => adminUpdateProfile({ ...profile, resume_url: null }),
    onSuccess: () => {
      toast.success('Resume PDF deleted.');
      queryClient.invalidateQueries(['adminProfileMedia']);
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Media Assets
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload and manage your profile photos, video greetings, and resume PDFs.
        </p>
      </div>

      {/* Grid of Upload zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Photo Upload Zone */}
        <UploadZone
          title="Profile Photo"
          accept="image/*"
          maxSizeText="Max size 5MB"
          currentFileUrl={profile?.photo_url}
          fileType="photo"
          onUpload={(data) => uploadPhotoMutation.mutateAsync(data)}
          onDelete={() => {
            if (window.confirm('Delete this profile photo?')) {
              deletePhotoMutation.mutate();
            }
          }}
        />

        {/* Video Upload Zone */}
        <UploadZone
          title="Intro Video"
          accept="video/mp4,video/webm"
          maxSizeText="Max size 100MB"
          currentFileUrl={profile?.video_url}
          fileType="video"
          onUpload={(data) => uploadVideoMutation.mutateAsync(data)}
          onDelete={() => {
            if (window.confirm('Delete this intro video?')) {
              deleteVideoMutation.mutate();
            }
          }}
        />

        {/* Resume PDF Zone */}
        <UploadZone
          title="Resume PDF"
          accept="application/pdf"
          maxSizeText="Max size 10MB"
          currentFileUrl={profile?.resume_url}
          fileType="pdf"
          onUpload={(data) => uploadResumeMutation.mutateAsync(data)}
          onDelete={() => {
            if (window.confirm('Delete this resume PDF?')) {
              deleteResumeMutation.mutate();
            }
          }}
        />
      </div>
    </div>
  );
};
export default Media;
