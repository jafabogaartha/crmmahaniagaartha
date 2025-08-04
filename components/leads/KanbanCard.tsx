
import React from 'react';
import { Lead } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PencilIcon } from '@heroicons/react/24/solid';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.354 1.687zM8.931 7.341c.227-.352.688-.543 1.138-.515.324.019.58.15.75.312.204.187.318.414.394.66.065.211.102.434.138.671.054.343.042.684-.029 1.011-.115.523-.335.962-.623 1.348-.052.069-.092.134-.118.196-.037.088-.059.183-.059.28.002.172.05.338.14.481.252.392.585.722.973.987.491.332 1.02.535 1.574.593.136.015.272.006.406-.025.293-.069.562-.213.787-.42.109-.101.205-.213.287-.334.093-.139.19-.271.326-.388.163-.142.36-.219.565-.219.241 0 .46.095.619.256.195.196.293.443.293.719-.002.143-.024.283-.068.418-.176.533-.476.992-.881 1.327-.425.348-.922.589-1.461.708-.609.135-1.244.085-1.829-.133-.775-.285-1.481-.74-2.065-1.333-.91-1.025-1.438-2.358-1.43-3.756.002-.6.12-1.188.353-1.735z" /></svg>
);

interface KanbanCardProps {
    lead: Lead;
    productName: string;
    onEdit: (lead: Lead) => void;
    onChat: (lead: Lead) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, productName, onEdit, onChat }) => {
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('leadId', lead.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
    };

    return (
        <Card
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="p-4 mb-4 cursor-grab active:cursor-grabbing shadow-neo-sm dark:shadow-dark-neo-sm"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold">{lead.nama}</h4>
                    <p className="text-sm text-gray-500 dark:text-dark-content/70">{productName}</p>
                </div>
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" className="p-1 shadow-none" onClick={() => onChat(lead)} title="Chat on WhatsApp">
                        <WhatsAppIcon />
                    </Button>
                    <Button variant="ghost" className="p-1 shadow-none" onClick={() => onEdit(lead)} title="Edit Lead">
                        <PencilIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            {lead.inquiry_text && (
                 <p className="text-xs mt-2 p-2 bg-gray-100 dark:bg-base-dark rounded">
                    "{lead.inquiry_text.substring(0, 50)}{lead.inquiry_text.length > 50 ? '...' : ''}"
                </p>
            )}
        </Card>
    );
};
