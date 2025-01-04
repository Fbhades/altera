import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Reservation {
    id: number;
    flightid: number;
    userid: number;
    mealid: number;
    price: number;
    done: boolean;
    created_at: string;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservations: Reservation[];
}

export function HistoryModal({ isOpen, onClose, reservations }: HistoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[600px] bg-white rounded-lg shadow-lg z-[100]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Reservation History</DialogTitle>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Flight ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meal</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                        {new Date(reservation.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{reservation.flightid}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{reservation.mealid}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">${reservation.price}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            reservation.done 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {reservation.done ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reservations.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No reservation history found</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 