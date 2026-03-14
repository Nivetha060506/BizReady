import { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Calendar,
  User,
  ChevronRight,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import taskService from '../services/taskService';
import TaskModal from '../components/TaskModal';

const TaskCard = ({ task, onEdit, onStatusUpdate }) => {
  const priorityColors = {
    high: 'text-rust',
    medium: 'text-amber',
    low: 'text-sage'
  };

  const statusIcons = {
    todo: <Circle className="w-4 h-4" />,
    inprogress: <Clock className="w-4 h-4 fill-amber/10" />,
    done: <CheckCircle2 className="w-4 h-4 fill-sage/10" />
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-mist/10 shadow-soft group hover:border-rust/20 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
            task.priority === 'high' ? 'bg-rust/5 border-rust/20 text-rust' : 
            task.priority === 'medium' ? 'bg-amber/5 border-amber/20 text-amber' : 
            'bg-sage/5 border-sage/20 text-sage'
        }`}>
            {task.priority} Priority
        </span>
        <button onClick={() => onEdit(task)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-cream rounded-md transition-all">
            <MoreHorizontal className="w-4 h-4 text-mist" />
        </button>
      </div>

      <h5 className="font-bold text-ink text-sm mb-2 leading-tight">{task.title}</h5>
      <p className="text-[10px] text-mist font-medium line-clamp-2 mb-4">{task.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-mist/5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-mist">
            <Calendar className="w-3 h-3" />
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No date'}
        </div>
        <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-cream border-2 border-white flex items-center justify-center text-[10px] font-bold text-ink">
                <User className="w-3 h-3" />
            </div>
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, status, tasks, onAddTask, onEditTask }) => (
  <div className="flex flex-col h-full min-w-[300px] max-w-[350px]">
    <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-ink uppercase tracking-widest text-xs">{title}</h3>
            <span className="w-5 h-5 rounded-full bg-ink text-paper text-[10px] font-black flex items-center justify-center">
                {tasks.length}
            </span>
        </div>
        <button 
           onClick={() => onAddTask(status)}
           className="p-1.5 hover:bg-white rounded-lg text-mist hover:text-rust transition-all shadow-sm"
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
    
    <div className="flex-1 space-y-4 overflow-y-auto px-1 pb-4 custom-scrollbar">
        {tasks.map(task => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} />
        ))}
        {tasks.length === 0 && (
            <div className="py-12 border-2 border-dashed border-mist/10 rounded-3xl flex flex-col items-center justify-center text-center px-6">
                <Circle className="w-8 h-8 text-mist/20 mb-2" />
                <p className="text-[10px] font-bold text-mist uppercase tracking-widest">No tasks yet</p>
            </div>
        )}
    </div>
  </div>
);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Kanban Board</h1>
          <p className="text-mist font-medium">Keep your business operations on track with visual workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast('Advanced filtering coming soon!', { icon: '🔍' })}
            className="btn-outline flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => handleAddTask('todo')}
            className="btn-primary flex items-center gap-2 bg-rust shadow-rust/20"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-8 h-full min-w-max pb-4">
            <Column 
                title="To Do" 
                status="todo" 
                tasks={tasks.filter(t => t.status === 'todo')} 
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
            />
            <Column 
                title="In Progress" 
                status="inprogress" 
                tasks={tasks.filter(t => t.status === 'inprogress')} 
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
            />
            <Column 
                title="Done" 
                status="done" 
                tasks={tasks.filter(t => t.status === 'done')} 
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
            />
        </div>
      </div>

      {isModalOpen && (
        <TaskModal 
          task={selectedTask} 
          defaultStatus={defaultStatus}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchTasks}
        />
      )}
    </div>
  );
};

export default Tasks;
