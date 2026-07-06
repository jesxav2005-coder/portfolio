import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Upload,
  X
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import FormModal from '../../components/admin/FormModal';
import Loader from '../../components/common/Loader';
import projectPlaceholder from '../../assets/project_placeholder.svg';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Projects = () => {
  const { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } = useApi();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Custom states for tech stack chips & screenshot file
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch Projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: async () => {
      const res = await adminGetProjects();
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (formData) => adminCreateProject(formData),
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries(['adminProjects']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => adminUpdateProject(id, formData),
    onSuccess: () => {
      toast.success('Project updated successfully!');
      queryClient.invalidateQueries(['adminProjects']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteProject(id),
    onSuccess: () => {
      toast.success('Project deleted!');
      queryClient.invalidateQueries(['adminProjects']);
    }
  });

  const openAddModal = () => {
    setEditingProject(null);
    setTags([]);
    setScreenshotFile(null);
    setScreenshotPreview('');
    reset({
      title: '',
      description: '',
      github_url: '',
      demo_url: '',
      status: 'Completed',
      start_date: '',
      end_date: '',
      display_order: projects.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setTags(project.tech_stack || []);
    setScreenshotFile(null);
    setScreenshotPreview(project.screenshot_url || '');
    reset({
      title: project.title,
      description: project.description,
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      status: project.status || 'Completed',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      display_order: project.display_order
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  // Tag list helpers
  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Screenshot selector preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData) => {
    // Build multipart FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('github_url', formData.github_url || '');
    data.append('demo_url', formData.demo_url || '');
    data.append('status', formData.status || 'Completed');
    data.append('start_date', formData.start_date || '');
    data.append('end_date', formData.end_date || '');
    data.append('display_order', formData.display_order || 0);
    data.append('tech_stack', JSON.stringify(tags));
    
    if (screenshotFile) {
      data.append('screenshot', screenshotFile);
    }

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, formData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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
            Projects Portfolio
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your highlighted projects shown on your landing page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full transition-colors duration-300"
          >
            {/* Image Preview */}
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
              <img
                src={project.screenshot_url || projectPlaceholder}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = projectPlaceholder; }}
              />
              <span className={`absolute top-4 right-4 px-2 py-0.5 text-xs font-semibold rounded ${
                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                  {project.title}
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Order: {project.display_order}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
                {project.description}
              </p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1 mb-6">
                {(project.tech_stack || []).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                <div className="flex gap-4">
                  {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600"><GithubIcon className="w-4 h-4" /></a>}
                  {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600"><ExternalLink className="w-4 h-4" /></a>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg text-slate-450 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-slate-500 col-span-3 py-8">No projects added yet.</p>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Add Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Project title is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. E-Commerce Platform"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows="4"
              {...register('description', { required: 'Description is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Detail your project features..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Screenshot Upload with Preview */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Screenshot Image
            </label>
            {screenshotPreview && (
              <div className="mb-2 relative rounded-lg overflow-hidden aspect-video max-w-[200px] border border-slate-200 dark:border-slate-800">
                <img src={screenshotPreview} alt="Screenshot Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {screenshotFile && <span className="text-xs text-slate-400 truncate max-w-xs">{screenshotFile.name}</span>}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="text"
                {...register('github_url')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Demo URL
              </label>
              <input
                type="text"
                {...register('demo_url')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Tech Stack - Tags Chips Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tech Stack (Type and press Enter)
            </label>
            <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-950 flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-indigo-800"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-grow min-w-[100px] border-none bg-transparent text-slate-900 dark:text-white focus:outline-none text-sm p-0.5"
                placeholder="e.g. React"
              />
            </div>
          </div>

          {/* Status, Date, Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
              </select>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="text"
                {...register('start_date')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM (e.g. 2023-01)"
              />
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
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
export default Projects;
