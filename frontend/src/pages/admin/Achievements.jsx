import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Sparkles,
  Trophy,
  Cpu,
  Award,
  GraduationCap,
  Flame,
  Milestone
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import FormModal from '../../components/admin/FormModal';
import Loader from '../../components/common/Loader';

const AVAILABLE_ICONS = {
  Trophy: <Trophy className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Milestone: <Milestone className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const Achievements = () => {
  const { adminGetAchievements, adminCreateAchievement, adminUpdateAchievement, adminDeleteAchievement } = useApi();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const selectedIcon = watch('icon', 'Trophy');

  // Fetch Achievements
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['adminAchievements'],
    queryFn: async () => {
      const res = await adminGetAchievements();
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => adminCreateAchievement(data),
    onSuccess: () => {
      toast.success('Achievement saved!');
      queryClient.invalidateQueries(['adminAchievements']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateAchievement(id, data),
    onSuccess: () => {
      toast.success('Achievement updated!');
      queryClient.invalidateQueries(['adminAchievements']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteAchievement(id),
    onSuccess: () => {
      toast.success('Achievement deleted!');
      queryClient.invalidateQueries(['adminAchievements']);
    }
  });

  const openAddModal = () => {
    setEditingAch(null);
    reset({
      title: '',
      description: '',
      icon: 'Trophy',
      achieved_date: '',
      display_order: achievements.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (ach) => {
    setEditingAch(ach);
    reset({
      title: ach.title,
      description: ach.description,
      icon: ach.icon || 'Trophy',
      achieved_date: ach.achieved_date || '',
      display_order: ach.display_order
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAch(null);
  };

  const onSubmit = (formData) => {
    if (editingAch) {
      updateMutation.mutate({ id: editingAch.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Honors & Accomplishments
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Display key career milestones and hackathon highlights.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* List View */}
      <div className="space-y-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4 transition-colors duration-300"
          >
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              {AVAILABLE_ICONS[ach.icon] || <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">{ach.achieved_date}</span>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mt-0.5">{ach.title}</h4>
                </div>
                <div className="text-[10px] text-slate-400">Order: {ach.display_order}</div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                {ach.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => openEditModal(ach)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ach.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <p className="text-center text-slate-500 py-8">No achievements listed yet.</p>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingAch ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. 1st Place - National Hackathon"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows="5"
              {...register('description', { required: 'Description is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Highlight key details and outcomes..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Highlight Icon
            </label>
            <div className="flex gap-4 items-center">
              <select
                {...register('icon', { required: 'Icon is required' })}
                className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {Object.keys(AVAILABLE_ICONS).map((iconName) => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
              
              <div className="p-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-indigo-600 dark:text-indigo-400">
                {AVAILABLE_ICONS[selectedIcon] || <Sparkles className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Date & Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date Achieved
              </label>
              <input
                type="text"
                {...register('achieved_date')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM (e.g. 2023-06)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              {editingAch ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
export default Achievements;
