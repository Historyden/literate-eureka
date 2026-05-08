import { ReactFlow, Background, Controls, Node, Edge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ConceptNode, MasteryStatus } from '../types';
import { useMemo } from 'react';

interface GraphViewProps {
  concepts: ConceptNode[];
  onNodeClick: (nodeId: string) => void;
  focusedNodeId?: string;
}

const statusColors: Record<MasteryStatus, string> = {
  mastered: '#10b981', // green
  blocked: '#ef4444',  // red
  focus: '#3b82f6',    // blue
  locked: '#6b7280',   // gray
};

const nodeStyle = (status: MasteryStatus, isFocused: boolean) => ({
  background: statusColors[status],
  color: 'white',
  padding: '10px',
  borderRadius: '4px',
  border: isFocused ? '2px solid white' : 'none',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  width: 150,
  textAlign: 'center' as const,
});

export function GraphView({ concepts, onNodeClick, focusedNodeId }: GraphViewProps) {
  const nodes: Node[] = useMemo(() => 
    concepts.map((c, index) => ({
      id: c.id,
      position: { x: index * 250, y: (c.prerequisites.length) * 150 },
      data: { label: c.title },
      style: nodeStyle(c.status, c.id === focusedNodeId),
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    })), [concepts, focusedNodeId]);

  const edges: Edge[] = useMemo(() => {
    const e: Edge[] = [];
    concepts.forEach(c => {
      c.prerequisites.forEach(prereq => {
        e.push({
          id: `e-${prereq}-${c.id}`,
          source: prereq,
          target: c.id,
          animated: c.id === focusedNodeId,
          style: { stroke: c.id === focusedNodeId ? '#FF6321' : '#2A2A2A', strokeWidth: 2 },
        });
      });
    });
    return e;
  }, [concepts, focusedNodeId]);

  return (
    <div className="w-full h-full relative bg-[#0A0A0A]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView
        colorMode="dark"
      >
        <Background color="#1A1A1A" gap={30} size={1} />
      </ReactFlow>
    </div>
  );
}
