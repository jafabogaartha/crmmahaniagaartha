
import React from 'react';
import { Lead, LeadStage } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    stage: LeadStage;
    leads: Lead[];
    productMap: Map<string, string>;
    onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
    onEditLead: (lead: Lead) => void;
    onChat: (lead: Lead) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, leads, productMap, onUpdateLeadStage, onEditLead, onChat }) => {
    const [isOver, setIsOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) {
            onUpdateLeadStage(leadId, stage);
        }
    };
    
    const stageColors = {
        [LeadStage.ON_PROGRESS]: 'border-blue-500',
        [LeadStage.CLOSING]: 'border-green-500',
        [LeadStage.LOSS]: 'border-red-500',
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-gray-100 dark:bg-base-dark rounded-lg flex flex-col`}
        >
            <div className={`font-bold text-lg p-3 border-b-4 ${stageColors[stage]}`}>
                {stage} ({leads.length})
            </div>
            <div className={`p-2 h-full overflow-y-auto transition-colors ${isOver ? 'bg-gray-200 dark:bg-neutral' : ''}`}>
                {leads.map(lead => (
                    <KanbanCard 
                        key={lead.id} 
                        lead={lead} 
                        productName={productMap.get(lead.product_id) || 'N/A'}
                        onEdit={onEditLead}
                        onChat={onChat}
                    />
                ))}
            </div>
        </div>
    );
};
