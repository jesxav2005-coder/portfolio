import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export const Settings = () => {
  const { adminGetProfile, adminUpdateProfile } = useApi();
  const queryClient = useQueryClient();

  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  // Fetch current Profile settings
  const { data: profile, isLoading } = useQuery({
    queryKey: ['adminSettingsProfile'],
    queryFn: async () => {
      const res = await adminGetProfile();
      return res.data.data;
    },
    onSuccess: (data) => {
      resetProfile({
        full_name: data.full_name,
        title: data.title,
        bio: data.bio,
        github: data.social_links?.github || '',
        linkedin: data.social_links?.linkedin || '',
        twitter: data.social_links?.twitter || '',
        youtube: data.social_links?.youtube || '',
        email: data.social_links?.email || '',
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => adminUpdateProfile(data),
    onSuccess: () => {
      toast.success('Profile settings updated successfully!');
      queryClient.invalidateQueries(['adminSettingsProfile']);
    }
  });

  // Password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.post('/api/auth/change-password', data),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      resetPassword({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Password update failed.');
    }
  });

  const onUpdateProfileSubmit = (data) => {
    const payload = {
      full_name: data.full_name,
      title: data.title,
      bio: data.bio,
      social_links: {
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        youtube: data.youtube,
        email: data.email,
      }
    };
    updateProfileMutation.mutate(payload);
  };

  const onChangePasswordSubmit = (data) => {
    if (data.new_password !== data.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }
    changePasswordMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure profile biographies, external social links, and update your administrator password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section 1: Profile & Social Edit */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            Profile Details & Links
          </h3>

          <form onSubmit={handleSubmitProfile(onUpdateProfileSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                {...registerProfile('full_name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {profileErrors.full_name && <p className="text-red-500 text-xs mt-1">{profileErrors.full_name.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Job Title</label>
              <input
                type="text"
                {...registerProfile('title', { required: 'Job title is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {profileErrors.title && <p className="text-red-500 text-xs mt-1">{profileErrors.title.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Biography</label>
              <textarea
                rows="4"
                {...registerProfile('bio', { required: 'Bio is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              ></textarea>
              {profileErrors.bio && <p className="text-red-500 text-xs mt-1">{profileErrors.bio.message}</p>}
            </div>

            {/* Social Links */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Social Profiles</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">GitHub</label>
                <input
                  type="text"
                  {...registerProfile('github')}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">LinkedIn</label>
                <input
                  type="text"
                  {...registerProfile('linkedin')}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-1.5 border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Twitter (X)</label>
                <input
                  type="text"
                  {...registerProfile('twitter')}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-1.5 border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">YouTube</label>
                <input
                  type="text"
                  {...registerProfile('youtube')}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-1.5 border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Contact Email</label>
              <input
                type="text"
                {...registerProfile('email')}
                placeholder="alex@example.com"
                className="w-full px-3 py-1.5 border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Update Settings
            </button>
          </form>
        </div>

        {/* Section 2: Password Change */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            Security & Credentials
          </h3>

          <form onSubmit={handleSubmitPassword(onChangePasswordSubmit)} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                {...registerPassword('current_password', { required: 'Current password is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
              />
              {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                {...registerPassword('new_password', { 
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
              />
              {passwordErrors.new_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                {...registerPassword('confirm_password', { required: 'Confirmation is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
              />
              {passwordErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password.message}</p>}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors w-full"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Settings;
