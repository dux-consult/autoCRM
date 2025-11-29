import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui';
import { Plus, CheckSquare, Sparkles, Trash2, MoreHorizontal } from 'lucide-react';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await taskService.updateTask(id, { status: 'Completed' });
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.deleteTask(id);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddClick = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tasks & Automation</h2>
                <Button onClick={handleAddClick} className="gap-2">
                    <Plus className="w-4 h-4" /> Create Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Automation Rules Card (Simplified) */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-blue-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Active Workflows
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium">Refill Reminder (Auto-generated)</span>
                                </div>
                                <Badge variant="default">Auto-Call</Badge>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium">Birthday Promo (Champion)</span>
                                </div>
                                <Badge variant="default">Auto-LINE</Badge>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full text-blue-600 mt-2">Manage Workflows</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Real Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {tasks.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">No pending tasks.</div>
                            ) : (
                                tasks.map(task => (
                                    <div key={task.id} className="group flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                        <div className="flex items-start gap-3">
                                            <button
                                                onClick={() => handleComplete(task.id)}
                                                className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${task.status === 'Completed' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                            >
                                                {task.status === 'Completed' && <CheckSquare className="w-3 h-3 text-white" />}
                                            </button>
                                            <div>
                                                <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">For: {task.customerName} • Due {new Date(task.due_date).toLocaleDateString('th-TH')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={task.status === 'Overdue' ? 'danger' : task.status === 'Completed' ? 'default' : 'warning'}>{task.type}</Badge>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEditClick(task)}>
                                                    <MoreHorizontal className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleDelete(task.id)}>
                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                        initialData={editingTask}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            loadTasks();
                        }}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
