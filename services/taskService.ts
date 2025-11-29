import { supabase } from '../lib/supabase';
import { Task } from '../types';

export const taskService = {
    async getTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                customer:customers (first_name, last_name)
            `)
            .order('due_date', { ascending: true });

        if (error) throw error;
        // Map customer name for UI consistency if needed, or handle in component
        return data.map((task: any) => ({
            ...task,
            customerName: task.customer ? `${task.customer.first_name} ${task.customer.last_name}` : 'Unknown',
            dueDate: new Date(task.due_date).toLocaleDateString('th-TH') // Simple formatting
        })) as Task[];
    },

    async createTask(task: Partial<Task>) {
        const { data, error } = await supabase
            .from('tasks')
            .insert([task])
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async updateTask(id: string, updates: Partial<Task>) {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async deleteTask(id: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
