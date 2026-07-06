import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Upload,
  Award
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import FormModal from '../../components/admin/FormModal';
import Loader from '../../components/common/Loader';
import projectPlaceholder from '../../assets/project_placeholder.svg';

export const Certificates = () => {
  const { adminGetCertificates, adminCreateCertificate, adminUpdateCertificate, adminDeleteCertificate } = useApi();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch Certificates
  const { data: certs = [], isLoading } = useQuery({
    queryKey: ['adminCertificates'],
    queryFn: async () => {
      const res = await adminGetCertificates();
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (formData) => adminCreateCertificate(formData),
    onSuccess: () => {
      toast.success('Certificate added successfully!');
      queryClient.invalidateQueries(['adminCertificates']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => adminUpdateCertificate(id, formData),
    onSuccess: () => {
      toast.success('Certificate updated successfully!');
      queryClient.invalidateQueries(['adminCertificates']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteCertificate(id),
    onSuccess: () => {
      toast.success('Certificate deleted!');
      queryClient.invalidateQueries(['adminCertificates']);
    }
  });

  const openAddModal = () => {
    setEditingCert(null);
    setImageFile(null);
    setImagePreview('');
    reset({
      title: '',
      issuer: '',
      credential_url: '',
      issued_date: '',
      expiry_date: '',
      display_order: certs.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setImageFile(null);
    setImagePreview(cert.image_url || '');
    reset({
      title: cert.title,
      issuer: cert.issuer,
      credential_url: cert.credential_url || '',
      issued_date: cert.issued_date || '',
      expiry_date: cert.expiry_date || '',
      display_order: cert.display_order
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCert(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData) => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('issuer', formData.issuer);
    data.append('credential_url', formData.credential_url || '');
    data.append('issued_date', formData.issued_date || '');
    data.append('expiry_date', formData.expiry_date || '');
    data.append('display_order', formData.display_order || 0);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, formData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
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
            Certifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your verified course completions and certifications.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Grid of Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert) => (
          <div 
            key={cert.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row transition-all duration-300 hover:shadow-md"
          >
            {/* Cert Image */}
            <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto sm:min-h-[140px] relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-r border-slate-100 dark:border-slate-800">
              {cert.image_url ? (
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = projectPlaceholder; }}
                />
              ) : (
                <div className="w-full h-full min-h-[120px] flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                  <Award className="w-10 h-10 animate-pulse" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                  <span className="text-[10px] text-slate-400">Order: {cert.display_order}</span>
                </div>
                <h4 className="text-md font-bold text-slate-900 dark:text-white mt-1 mb-1.5">
                  {cert.title}
                </h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 mb-4">
                  Issued: {cert.issued_date} {cert.expiry_date ? `| Expires: ${cert.expiry_date}` : ''}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-350 dark:text-slate-600 italic">No verification link</span>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1 rounded text-slate-450 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1 rounded text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && (
          <p className="text-center text-slate-500 col-span-2 py-8">No certificates listed yet.</p>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Certificate Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Certificate title is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. AWS Solutions Architect"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Issuer */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Issuer Name
            </label>
            <input
              type="text"
              {...register('issuer', { required: 'Issuer name is required' })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Amazon Web Services"
            />
            {errors.issuer && <p className="text-red-500 text-xs mt-1">{errors.issuer.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Credential Badge Image
            </label>
            {imagePreview && (
              <div className="mb-2 relative rounded-lg overflow-hidden aspect-video max-w-[150px] border border-slate-200 dark:border-slate-800">
                <img src={imagePreview} alt="Cert Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Badge Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {imageFile && <span className="text-xs text-slate-400 truncate max-w-xs">{imageFile.name}</span>}
            </div>
          </div>

          {/* Verification Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Verification Credential URL
            </label>
            <input
              type="text"
              {...register('credential_url')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="https://aws.amazon.com/verify/..."
            />
          </div>

          {/* Dates & Order */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issued Date
              </label>
              <input
                type="text"
                {...register('issued_date')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expiry Date
              </label>
              <input
                type="text"
                {...register('expiry_date')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="YYYY-MM or Lifetime"
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
              {editingCert ? 'Save Changes' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
export default Certificates;
