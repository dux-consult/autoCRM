import React, { useEffect, useState } from 'react';
import { journeyService } from '../../services/journeyService';
import { Table, TableHeader, TableRow, TableHead, TableCell, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Loader2, RefreshCw, ChevronRight, ChevronDown, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

interface ExecutionHistoryProps {
    journeyId: string;
}

export const ExecutionHistory = ({ journeyId }: ExecutionHistoryProps) => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedEnrollmentId, setExpandedEnrollmentId] = useState<string | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await journeyService.getJourneyHistory(journeyId);
            setEnrollments(data || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [journeyId]);

    const toggleExpand = async (enrollmentId: string) => {
        if (expandedEnrollmentId === enrollmentId) {
            setExpandedEnrollmentId(null);
            setLogs([]);
            return;
        }

        setExpandedEnrollmentId(enrollmentId);
        setLoadingLogs(true);
        try {
            const data = await journeyService.getEnrollmentLogs(enrollmentId);
            setLogs(data || []);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge variant="success">Completed</Badge>;
            case 'failed': return <Badge variant="danger">Failed</Badge>;
            case 'active': return <Badge variant="primary">Active</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Execution History</h3>
                <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : enrollments.length === 0 ? (
                <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No execution history found. Run a test or wait for triggers.
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Current Node</TableHead>
                                <TableHead>Started At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <React.Fragment key={enrollment.id}>
                                    <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(enrollment.id)}>
                                        <TableCell>
                                            {expandedEnrollmentId === enrollment.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {enrollment.customer?.first_name} {enrollment.customer?.last_name}
                                            <div className="text-xs text-gray-500">{enrollment.customer?.email}</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">{enrollment.current_node_id || 'Start'}</TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(enrollment.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                    {expandedEnrollmentId === enrollment.id && (
                                        <TableRow className="bg-gray-50">
                                            <TableCell colSpan={5} className="p-4">
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-gray-700">Detailed Logs</h4>
                                                    {loadingLogs ? (
                                                        <div className="flex items-center text-sm text-gray-500"><Loader2 className="w-3 h-3 animate-spin mr-2" /> Loading logs...</div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {logs.map((log) => (
                                                                <div key={log.id} className="flex items-start text-sm">
                                                                    <div className="mr-3 mt-0.5">
                                                                        {log.action === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> :
                                                                            log.action === 'exit' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                                                                                log.action === 'enter' ? <PlayCircle className="w-4 h-4 text-blue-500" /> :
                                                                                    <Clock className="w-4 h-4 text-gray-400" />}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-mono text-xs text-gray-500 mr-2">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                                                                        <span className={`font-medium ${log.action === 'error' ? 'text-red-600' : 'text-gray-900'}`}>{log.message}</span>
                                                                        {log.node_id && <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">Node: {log.node_id}</span>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};
