import React, { useEffect, useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { journeyService } from '../services/journeyService';
import { AutomationJourney } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from './ui';

interface JourneyListProps {
    onCreateNew: () => void;
    onEdit: (id: string) => void;
}

export const JourneyList = ({ onCreateNew, onEdit }: JourneyListProps) => {
    const [journeys, setJourneys] = useState<AutomationJourney[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJourneys();
    }, []);

    const loadJourneys = async () => {
        try {
            const data = await journeyService.getAllJourneys();
            setJourneys(data);
        } catch (error) {
            console.error('Error loading journeys:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading journeys...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Automation Journeys</h2>
                    <p className="text-gray-500">Manage your automated customer workflows.</p>
                </div>
                <Button onClick={onCreateNew} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Journey
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {journeys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No journeys found. Create your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            journeys.map((journey) => (
                                <TableRow key={journey.id} className="group">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900">{journey.name}</span>
                                            <span className="text-xs text-gray-500">{journey.description || 'No description'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={journey.status === 'active' ? 'success' : journey.status === 'paused' ? 'warning' : 'secondary'}>
                                            {journey.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {new Date(journey.updated_at || journey.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="sm" onClick={() => onEdit(journey.id)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
