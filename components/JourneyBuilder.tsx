import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ReactFlowProvider,
    useReactFlow,
    Node,
    OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from './journey/Sidebar';
import { CustomNode } from './journey/CustomNode';
import { PropertiesPanel } from './journey/PropertiesPanel';
import { ExecutionHistory } from './journey/ExecutionHistory';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Loader2, Play, History, Layout, Sparkles, Bot, X } from 'lucide-react';
import { journeyService } from '../services/journeyService';
import { automationEngine } from '../services/automationEngine';
import { aiService } from '../services/aiService';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from './ui';

const nodeTypes = {
    trigger: CustomNode,
    action: CustomNode,
    condition: CustomNode,
    delay: CustomNode,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { label: 'New Customer', description: 'When a user signs up' }
    },
];

interface JourneyBuilderProps {
    journeyId: string | null;
    onBack: () => void;
}

const JourneyBuilderContent = ({ journeyId, onBack }: JourneyBuilderProps) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition, toObject, setViewport } = useReactFlow();
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // Journey Metadata State
    const [name, setName] = useState('Untitled Journey');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'builder' | 'history'>('builder');

    // AI Magic Build State
    const [showMagicBuild, setShowMagicBuild] = useState(false);
    const [magicPrompt, setMagicPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // AI Simulator State
    const [showSimulator, setShowSimulator] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    useEffect(() => {
        if (journeyId) {
            loadJourney(journeyId);
        }
    }, [journeyId]);

    const loadJourney = async (id: string) => {
        setIsLoading(true);
        try {
            const { journey, latestVersion } = await journeyService.getJourney(id);
            setName(journey.name);
            setDescription(journey.description || '');

            if (latestVersion && latestVersion.definition) {
                const { nodes: loadedNodes, edges: loadedEdges } = latestVersion.definition;
                setNodes(loadedNodes || []);
                setEdges(loadedEdges || []);
            }
        } catch (error) {
            console.error('Failed to load journey:', error);
            alert('Failed to load journey');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (isPublish: boolean = false) => {
        if (!name.trim()) {
            alert('Please enter a journey name');
            return;
        }

        setIsSaving(true);
        try {
            const flow = toObject();
            await journeyService.saveJourney(
                journeyId,
                name,
                description,
                flow.nodes,
                flow.edges,
                isPublish
            );
            alert(isPublish ? 'Journey published successfully!' : 'Draft saved successfully!');
            if (!journeyId) {
                onBack();
            }
        } catch (error) {
            console.error('Failed to save journey:', error);
            alert('Failed to save journey');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestRun = async () => {
        if (!journeyId) {
            alert('Please save the journey first');
            return;
        }

        const confirm = window.confirm('This will create a test enrollment for a mock customer. Continue?');
        if (!confirm) return;

        try {
            const startNode = nodes.find(n => n.type === 'trigger');
            if (!startNode) {
                alert('No trigger node found');
                return;
            }

            const mockCustomer = {
                id: 'test-customer-' + Math.random().toString(36).substr(2, 9),
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com'
            };

            await automationEngine.enrollCustomer(journeyId, mockCustomer.id, startNode.id, {
                source: 'manual_test',
                ...mockCustomer
            });

            alert('Test run started! Check the History tab.');
            setActiveTab('history');
        } catch (error) {
            console.error('Test run failed:', error);
            alert('Test run failed');
        }
    };

    const handleMagicBuild = async () => {
        if (!magicPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const flow = await aiService.generateFlow(magicPrompt);
            if (flow && flow.nodes && flow.edges) {
                // Map nodes to ensure they have correct structure/defaults if needed
                const newNodes = flow.nodes.map((n: any) => ({
                    ...n,
                    id: n.id || uuidv4(),
                    data: { ...n.data, description: n.data.description || 'Generated by AI' }
                }));
                setNodes(newNodes);
                setEdges(flow.edges);
                setShowMagicBuild(false);
                setMagicPrompt('');
                setTimeout(() => setViewport({ x: 0, y: 0, zoom: 1 }), 100);
            }
        } catch (error) {
            alert('Failed to generate flow. Please check your API Key or try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSimulate = async () => {
        setIsSimulating(true);
        try {
            const flow = toObject();
            const result = await aiService.simulateJourney({ nodes: flow.nodes, edges: flow.edges });
            setSimulationResult(result);
        } catch (error) {
            alert('Simulation failed.');
        } finally {
            setIsSimulating(false);
        }
    };

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: uuidv4(),
                type,
                position,
                data: { label: label, description: 'Click to configure' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
        setSelectedNode(nodes[0] || null);
    }, []);

    const onUpdateNode = (id: string, data: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data };
                }
                return node;
            })
        );
    };

    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    return (
        <div className="h-[calc(100vh-100px)] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-lg font-semibold text-gray-900 border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-2 -ml-2"
                            placeholder="Journey Name"
                        />
                        <p className="text-sm text-gray-500">Design your customer journey flow</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
                        <button
                            onClick={() => setActiveTab('builder')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'builder' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Layout className="w-4 h-4" />
                            Builder
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <History className="w-4 h-4" />
                            History
                        </button>
                    </div>

                    {activeTab === 'builder' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMagicBuild(true)}
                                className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI Magic Build
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSimulator(true)}
                                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            >
                                <Bot className="w-4 h-4 mr-2" />
                                Simulate
                            </Button>
                            <div className="w-px h-8 bg-gray-200 mx-2"></div>
                            <Button variant="outline" size="sm" onClick={handleTestRun} disabled={!journeyId}>
                                <Play className="w-4 h-4 mr-2" />
                                Test Run
                            </Button>
                            <button
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                Publish Journey
                            </button>
                        </>
                    )}
                </div>
            </div>

            {activeTab === 'builder' ? (
                <div className="flex-1 flex relative">
                    <Sidebar />
                    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onSelectionChange={onSelectionChange}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Controls />
                            <MiniMap />
                            <Background gap={12} size={1} />
                        </ReactFlow>
                    </div>
                    <PropertiesPanel
                        selectedNode={selectedNode}
                        onClose={() => setSelectedNode(null)}
                        onUpdate={onUpdateNode}
                    />
                </div>
            ) : (
                <div className="flex-1 p-6 overflow-auto bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <ExecutionHistory journeyId={journeyId!} />
                    </div>
                </div>
            )}

            {/* Magic Build Modal */}
            {showMagicBuild && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                                <Sparkles className="w-5 h-5" />
                                AI Magic Flow Generator
                            </CardTitle>
                            <button onClick={() => setShowMagicBuild(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Describe the automation flow you want to build. AI will generate the nodes and connections for you.
                            </p>
                            <textarea
                                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                placeholder="e.g., When a new customer signs up, wait 2 days, then send a welcome email. If they don't open it, send a LINE message."
                                value={magicPrompt}
                                onChange={(e) => setMagicPrompt(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setShowMagicBuild(false)}>Cancel</Button>
                                <Button
                                    onClick={handleMagicBuild}
                                    disabled={!magicPrompt.trim() || isGenerating}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Flow
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Simulator Modal */}
            {showSimulator && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Bot className="w-5 h-5" />
                                Journey Simulator
                            </CardTitle>
                            <button onClick={() => setShowSimulator(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {!simulationResult && !isSimulating && (
                                <div className="text-center py-8">
                                    <Bot className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-6">
                                        AI will simulate 100 customers passing through this journey to predict outcomes, sales, and potential risks.
                                    </p>
                                    <Button onClick={handleSimulate} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Start Simulation
                                    </Button>
                                </div>
                            )}

                            {isSimulating && (
                                <div className="text-center py-12">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600">Simulating 100 customer journeys...</p>
                                </div>
                            )}

                            {simulationResult && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                            <p className="text-sm text-green-600 font-medium">Est. Total Sales</p>
                                            <p className="text-2xl font-bold text-green-700">฿{simulationResult.totalSales.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                                            <p className="text-sm text-blue-600 font-medium">Conversion Rate</p>
                                            <p className="text-2xl font-bold text-blue-700">{simulationResult.conversionRate}%</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                                            <p className="text-sm text-red-600 font-medium">Drop-off Rate</p>
                                            <p className="text-2xl font-bold text-red-700">{simulationResult.dropOffRate}%</p>
                                        </div>
                                    </div>

                                    {simulationResult.risks && simulationResult.risks.length > 0 && (
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                            <h4 className="font-bold text-orange-800 mb-2">Potential Risks</h4>
                                            <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                                                {simulationResult.risks.map((risk: string, i: number) => (
                                                    <li key={i}>{risk}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button variant="outline" onClick={() => setSimulationResult(null)}>Run Again</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export const JourneyBuilder = (props: JourneyBuilderProps) => {
    return (
        <ReactFlowProvider>
            <JourneyBuilderContent {...props} />
        </ReactFlowProvider>
    );
};
