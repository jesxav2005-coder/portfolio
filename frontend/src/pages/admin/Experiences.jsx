import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Briefcase,
  MapPin,
  Calendar
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import FormModal from '../../components/admin/FormModal';
import Loader from '../../components/common/Loader';

export const Experiences = () => {
  const { adminGetExperiences, adminCreateExperience, adminUpdateExperience, adminDeleteExperience } = useApi();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch Experiences
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['adminExperiences'],
    queryFn: async () => {
      const res = await adminGetExperiences();
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => adminCreateExperience(data),
    onSuccess: () => {
      toast.success('Experience saved!');
      queryClient.invalidateQueries(['adminExperiences']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateExperience(id, data),
    onSuccess: () => {
      toast.success('Experience updated!');
      queryClient.invalidateQueries(['adminExperiences']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteExperience(id),
    onSuccess: () => {
      toast.success('Experience deleted!');
      queryClient.invalidateQueries(['adminExperiences']);
    }
  });

  const openAddModal = () => {
    setEditingExp(null);
    reset({
      role: '',
      company: '',
      location: '',
      description: '',
      start_date: '',
      end_date: 'Present',
      display_order: experiences.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    reset({
      role: exp.role,
      company: exp.company,
      location: exp.location || '',
      description: exp.description || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || 'Present',
      display_order: exp.display_order
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExp(null);
  };

  const onSubmit = (formData) => {
    if (editingExp) {
      updateMutation.mutate({ id: editingExp.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
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
            Internship & Work Experience
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your professional roles, internships, and work history.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* List View */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div 
            key={exp.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4 transition-colors duration-300"
          >
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{exp.role}</h4>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{exp.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.start_date} – {exp.end_date}</span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold">Order: {exp.display_order}</div>
              </div>
              
              {exp.description && (
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => openEditModal(exp)}
                className="p-1.5 rounded-lg text-slate-450 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-1.5 rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-center text-slate-500 py-8">No experiences listed yet.</p>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Role Title
            </label>
            <input
              type="text"
              {...register('role', { required: 'Role title is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. IT Intern"
            />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              {...register('company', { required: 'Company name is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Switch Automobiles"
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Guindy, Chennai"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows="4"
              {...register('description')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Highlight key responsibilities and outcomes..."
            ></textarea>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="text"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM (e.g. 2025-06)"
              />
              {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="text"
                {...register('end_date')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM or Present"
              />
            </div>
          </div>

          {/* Display Order */}
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
              {editingExp ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
export default Experiences;
