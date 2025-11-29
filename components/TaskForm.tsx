import React, { useState, useEffect } from 'react';
import { Customer, Task } from '../types';
import { customerService } from '../services/customerService';
import { taskService } from '../services/taskService';
import { Button, Input } from './ui';

interface TaskFormProps {
    initialData?: Task;
    onSuccess: () => void;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(initialData?.title || '');
    const [type, setType] = useState(initialData?.type || 'Call');
    const [dueDate, setDueDate] = useState(
        initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [customerId, setCustomerId] = useState(initialData?.customer_id || '');

    useEffect(() => {
        const loadCustomers = async () => {
            const data = await customerService.getCustomers();
            setCustomers(data);
        };
        loadCustomers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                title,
                type,
                due_date: dueDate,
                customer_id: customerId,
                status: initialData?.status || 'Pending'
            };

            if (initialData) {
                await taskService.updateTask(initialData.id, taskData);
            } else {
                await taskService.createTask(taskData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Task Title</label>
                <Input
                    placeholder="e.g. Call to follow up"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="LINE">LINE</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Related Customer</label>
                <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    required
                >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
                </Button>
            </div>
        </form>
    );
};
