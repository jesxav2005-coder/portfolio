import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical,
  Check,
  X
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApi } from '../../hooks/useApi';
import FormModal from '../../components/admin/FormModal';
import Loader from '../../components/common/Loader';
import { SKILL_CATEGORIES } from '../../utils/constants';

// Sortable Row Component
const SortableSkillRow = ({ skill, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-100 dark:border-slate-800 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors ${
        !skill.is_active ? 'opacity-50' : ''
      }`}
    >
      <td className="px-6 py-4 cursor-grab text-slate-450 hover:text-indigo-600" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </td>
      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{skill.name}</td>
      <td className="px-6 py-4">
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {skill.category}
        </span>
      </td>
      <td className="px-6 py-4 w-1/4">
        <div className="flex items-center gap-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${skill.proficiency}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-500">{skill.proficiency}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">{skill.display_order}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => onToggleActive(skill)}
          className={`p-1 rounded-md transition-colors ${
            skill.is_active 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
          }`}
        >
          {skill.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={() => onEdit(skill)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(skill.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export const Skills = () => {
  const { adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill } = useApi();
  const queryClient = useQueryClient();

  const [skillsList, setSkillsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Sensors for drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Query skills
  const { data = [], isLoading } = useQuery({
    queryKey: ['adminSkills'],
    queryFn: async () => {
      const res = await adminGetSkills();
      return res.data.data;
    }
  });

  // Sync React state with queried data
  useEffect(() => {
    if (data) {
      setSkillsList(data);
    }
  }, [data]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (skill) => adminCreateSkill(skill),
    onSuccess: () => {
      toast.success('Skill added successfully!');
      queryClient.invalidateQueries(['adminSkills']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateSkill(id, data),
    onSuccess: () => {
      toast.success('Skill updated successfully!');
      queryClient.invalidateQueries(['adminSkills']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteSkill(id),
    onSuccess: () => {
      toast.success('Skill deleted!');
      queryClient.invalidateQueries(['adminSkills']);
    }
  });

  const openAddModal = () => {
    setEditingSkill(null);
    reset({
      name: '',
      category: 'Frontend',
      proficiency: 50,
      display_order: skillsList.length + 1,
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
      is_active: skill.is_active
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
  };

  const onSubmit = (formData) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (skill) => {
    updateMutation.mutate({ 
      id: skill.id, 
      data: { ...skill, is_active: !skill.is_active } 
    });
  };

  // Drag and drop end callback
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = skillsList.findIndex((s) => s.id === active.id);
    const newIndex = skillsList.findIndex((s) => s.id === over.id);

    const reorderedList = arrayMove(skillsList, oldIndex, newIndex);
    
    // Locally update state for responsive UI
    setSkillsList(reorderedList);

    // Save Display orders sequentially
    toast.loading('Saving order...', { id: 'reorder-toast' });
    try {
      for (let i = 0; i < reorderedList.length; i++) {
        const item = reorderedList[i];
        if (item.display_order !== i + 1) {
          await adminUpdateSkill(item.id, { 
            name: item.name,
            category: item.category,
            proficiency: item.proficiency,
            is_active: item.is_active,
            display_order: i + 1 
          });
        }
      }
      toast.success('Display order saved!', { id: 'reorder-toast' });
      queryClient.invalidateQueries(['adminSkills']);
    } catch (err) {
      toast.error('Failed to update skill order.', { id: 'reorder-toast' });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Skills Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Drag rows to reorder how they display on the portfolio website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/20 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3 w-10"></th>
                  <th className="px-6 py-3">Skill Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Proficiency</th>
                  <th className="px-6 py-3 text-center">Display Order</th>
                  <th className="px-6 py-3">Active</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <SortableContext
                  items={skillsList.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {skillsList.map((skill) => (
                    <SortableSkillRow
                      key={skill.id}
                      skill={skill}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </SortableContext>
                {skillsList.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No skills added yet. Add your first skill!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DndContext>
      </div>

      {/* Add / Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Skill Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Skill name is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Next.js, Rust"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {SKILL_CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Proficiency */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Proficiency Level
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              {...register('proficiency', { valueAsNumber: true })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Order */}
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

          {/* Active toggle */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 bg-transparent"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Active (Displays on portfolio)
            </label>
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
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
export default Skills;
