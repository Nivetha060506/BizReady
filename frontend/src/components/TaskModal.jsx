import { useState, useEffect } from 'react';
import { X, Save, ClipboardList, Calendar, Flag, User, Trash2 } from 'lucide-react';
import taskService from '../services/taskService';

const TaskModal = ({ task, defaultStatus, onClose, onSuccess }) => {
  const isEditing = !!task;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
        setFormData({ 
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
        });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await taskService.updateTask(task._id, formData);
      } else {
        await taskService.createTask(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Archive this task?')) {
        await taskService.deleteTask(task._id);
        onSuccess();
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-paper w-full max-w-xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-mist/10 flex items-center justify-between bg-white text-ink">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${isEditing ? 'bg-amber' : 'bg-rust'}`}>
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {isEditing ? 'Update Task' : 'New Operational Task'}
              </h2>
              <p className="text-[10px] text-mist font-bold uppercase tracking-widest mt-1">Activity Tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Task Title</label>
            <input 
              name="title"
              required
              placeholder="e.g. Replenish copper stock from Vendor B"
              className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-4 rounded-2xl outline-none font-bold text-lg"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Operational Details</label>
            <textarea 
              name="description"
              placeholder="Briefly explain what needs to be done..."
              className="w-full bg-cream/30 border-2 border-transparent focus:border-rust/20 p-4 rounded-2xl outline-none text-sm font-medium h-24 resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Workflow Status</label>
                <select 
                    name="status"
                    className="w-full bg-cream/40 border-2 border-transparent p-3 rounded-xl outline-none font-bold text-sm"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="review">Needs Review</option>
                    <option value="done">Completed</option>
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Priority Level</label>
                <div className="flex gap-2">
                    {['low', 'medium', 'high'].map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setFormData({...formData, priority: p})}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                                formData.priority === p ? 
                                (p === 'high' ? 'bg-rust border-rust text-white' : 
                                 p === 'medium' ? 'bg-amber border-amber text-white' : 
                                 'bg-sage border-sage text-white') : 
                                'border-mist/10 text-mist'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Target Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        type="date"
                        name="dueDate"
                        className="w-full bg-cream/40 border-2 border-transparent p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Assigned Holder</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        name="assignedTo"
                        placeholder="Owner / Staff Member"
                        className="w-full bg-cream/40 border-2 border-transparent p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.assignedTo}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-mist/10">
            {isEditing ? (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-xs font-bold text-rust hover:bg-rust/5 px-4 py-2 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Archive Task
                </button>
            ) : <div />}
            
            <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="text-sm font-bold text-mist hover:text-ink px-4"
                >
                  Cancel
                </button>
                <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-4 bg-ink text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:shadow-ink/20 active:scale-[0.98] transition-all"
                >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
                <Save className="w-5 h-5" />
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
