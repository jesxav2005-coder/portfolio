import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  MailOpen, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Mail,
  User,
  Calendar
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

// Slide-in Message Preview Drawer
const MessageDrawer = ({ isOpen, message, onClose, onMarkRead, onDelete }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-sm z-40" 
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[400px] sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 p-8 flex flex-col justify-between transition-colors duration-300"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <span>Message Preview</span>
                </h3>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-805 rounded-lg text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">From</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{message.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-805 rounded-lg text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Email</span>
                    <a href={`mailto:${message.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      {message.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-805 rounded-lg text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Sent At</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">{formatDate(message.created_at)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Subject</span>
                  <p className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {message.subject}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Message Body</span>
                  <div className="text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800 min-h-[160px] text-sm whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              {!message.is_read && (
                <button
                  onClick={() => onMarkRead(message.id)}
                  className="flex-grow inline-flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  <MailOpen className="w-4 h-4" />
                  <span>Mark as Read</span>
                </button>
              )}
              <button
                onClick={() => onDelete(message.id)}
                className="flex-grow inline-flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-650 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 font-semibold rounded-lg text-sm transition-colors border border-red-200 dark:border-red-950/40"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Messages = () => {
  const { adminGetMessages, adminMarkMessageRead, adminDeleteMessage, adminBulkDeleteMessages } = useApi();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const perPage = 20;

  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState(null);

  // Fetch paginated messages
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['adminMessages', page],
    queryFn: async () => {
      const res = await adminGetMessages(page, perPage);
      return res.data.data;
    },
    keepPreviousData: true
  });

  const { messages = [], total = 0, pages = 1 } = responseData || {};

  // Mutations
  const markReadMutation = useMutation({
    mutationFn: (id) => adminMarkMessageRead(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminMessages']);
      queryClient.invalidateQueries(['adminDashboardCount']);
      // Update preview if open
      if (previewMessage && previewMessage.id === data.data.data.id) {
        setPreviewMessage(data.data.data);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteMessage(id),
    onSuccess: () => {
      toast.success('Message deleted!');
      queryClient.invalidateQueries(['adminMessages']);
      queryClient.invalidateQueries(['adminDashboardCount']);
      setPreviewOpen(false);
      setSelectedIds(selectedIds.filter(id => id !== previewMessage?.id));
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => adminBulkDeleteMessages(ids),
    onSuccess: () => {
      toast.success('Selected messages deleted!');
      queryClient.invalidateQueries(['adminMessages']);
      queryClient.invalidateQueries(['adminDashboardCount']);
      setSelectedIds([]);
    }
  });

  // Selection handlers
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = messages.map(m => m.id);
    const allSelected = currentPageIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)));
    } else {
      const newSelections = [...selectedIds];
      currentPageIds.forEach(id => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      setSelectedIds(newSelections);
    }
  };

  const handleRowClick = (msg) => {
    setPreviewMessage(msg);
    setPreviewOpen(true);
    if (!msg.is_read) {
      markReadMutation.mutate(msg.id);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected messages?`)) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  if (isLoading) return <Loader />;

  const isAllSelected = messages.length > 0 && messages.every(m => selectedIds.includes(m.id));

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Messages Inbox
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Total messages: {total}. Review form submissions and contact inquiries.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/20 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 bg-transparent"
                  />
                </th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors ${
                    !msg.is_read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <td 
                    className="px-6 py-4 text-center cursor-default"
                    onClick={(e) => e.stopPropagation()} // stop click propagating to row handler
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(msg.id)}
                      onChange={() => handleSelectRow(msg.id)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 bg-transparent"
                    />
                  </td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(msg)}>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      !msg.is_read ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {!msg.is_read ? 'New' : 'Read'}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(msg)}>{msg.name}</td>
                  <td className="px-6 py-4 truncate max-w-xs" onClick={() => handleRowClick(msg)}>{msg.subject}</td>
                  <td className="px-6 py-4 text-xs text-slate-400" onClick={() => handleRowClick(msg)}>
                    {formatDate(msg.created_at)}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No messages inside inbox.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex items-center justify-between transition-colors duration-300">
            <span className="text-xs text-slate-500">
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-50 transition-colors text-slate-650 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pages}
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-50 transition-colors text-slate-650 dark:text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Preview Drawer */}
      <MessageDrawer
        isOpen={previewOpen}
        message={previewMessage}
        onClose={() => setPreviewOpen(false)}
        onMarkRead={(id) => markReadMutation.mutate(id)}
        onDelete={(id) => {
          if (window.confirm('Delete this message?')) {
            deleteMutation.mutate(id);
          }
        }}
      />
    </div>
  );
};
export default Messages;
