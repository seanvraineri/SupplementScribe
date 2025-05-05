'use client';

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { Supplement } from '@/types/supplement';

type PrintFormat = 'simple' | 'detailed' | 'comprehensive';

type UserInfo = {
  name: string;
  doctor?: string;
  notes?: string;
};

interface ProtocolPrintViewProps {
  supplements: Supplement[];
  userInfo: UserInfo;
  printFormat: PrintFormat;
  onClose: () => void;
}

const ProtocolPrintView: React.FC<ProtocolPrintViewProps> = ({ 
  supplements, 
  userInfo, 
  printFormat,
  onClose 
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${userInfo.name}-Supplement-Protocol`,
    onAfterPrint: () => {
      onClose();
    },
    // @ts-ignore - The 'content' property is required by react-to-print but TypeScript doesn't recognize it
    content: () => printRef.current,
  });

  // Helper function to group supplements by time of day
  const getSupplementsByTime = () => {
    const morning: Supplement[] = [];
    const afternoon: Supplement[] = [];
    const evening: Supplement[] = [];
    const anytime: Supplement[] = [];

    supplements.forEach(supp => {
      // timeOfDay is an array of strings in the Supplement type
      const timeOfDayArray = supp.timeOfDay || [];
      
      if (timeOfDayArray.some(time => time.toLowerCase().includes('morning'))) {
        morning.push(supp);
      } else if (timeOfDayArray.some(time => 
        time.toLowerCase().includes('afternoon') || time.toLowerCase().includes('noon')
      )) {
        afternoon.push(supp);
      } else if (timeOfDayArray.some(time => 
        time.toLowerCase().includes('evening') || time.toLowerCase().includes('night')
      )) {
        evening.push(supp);
      } else {
        anytime.push(supp);
      }
    });

    return { morning, afternoon, evening, anytime };
  };

  const times = getSupplementsByTime();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Supplement Protocol</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 font-medium text-sm transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Printable Content */}
          <div ref={printRef} className="bg-white text-black p-8 shadow-none">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Supplement Protocol</h1>
              <p className="text-gray-700">Prepared for: {userInfo.name}</p>
              {userInfo.doctor && <p className="text-gray-700">Supervising physician: {userInfo.doctor}</p>}
              <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Morning Supplements */}
            {times.morning.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Morning Supplements</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">Supplement</th>
                      <th className="py-2">Dosage</th>
                      {printFormat !== 'simple' && <th className="py-2">Frequency</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Brand</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Description</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {times.morning.map((supp) => (
                      <tr key={supp.id} className="border-t border-gray-100">
                        <td className="py-3 font-medium">{supp.name}</td>
                        <td className="py-3">{supp.dosage}</td>
                        {printFormat !== 'simple' && <td className="py-3">{supp.frequency}</td>}
                        {printFormat === 'comprehensive' && <td className="py-3">{supp.brand || '-'}</td>}
                        {printFormat === 'comprehensive' && (
                          <td className="py-3">{supp.description || '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Afternoon Supplements */}
            {times.afternoon.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Afternoon Supplements</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">Supplement</th>
                      <th className="py-2">Dosage</th>
                      {printFormat !== 'simple' && <th className="py-2">Frequency</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Brand</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Description</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {times.afternoon.map((supp) => (
                      <tr key={supp.id} className="border-t border-gray-100">
                        <td className="py-3 font-medium">{supp.name}</td>
                        <td className="py-3">{supp.dosage}</td>
                        {printFormat !== 'simple' && <td className="py-3">{supp.frequency}</td>}
                        {printFormat === 'comprehensive' && <td className="py-3">{supp.brand || '-'}</td>}
                        {printFormat === 'comprehensive' && (
                          <td className="py-3">{supp.description || '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Evening Supplements */}
            {times.evening.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Evening Supplements</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">Supplement</th>
                      <th className="py-2">Dosage</th>
                      {printFormat !== 'simple' && <th className="py-2">Frequency</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Brand</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Description</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {times.evening.map((supp) => (
                      <tr key={supp.id} className="border-t border-gray-100">
                        <td className="py-3 font-medium">{supp.name}</td>
                        <td className="py-3">{supp.dosage}</td>
                        {printFormat !== 'simple' && <td className="py-3">{supp.frequency}</td>}
                        {printFormat === 'comprehensive' && <td className="py-3">{supp.brand || '-'}</td>}
                        {printFormat === 'comprehensive' && (
                          <td className="py-3">{supp.description || '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Anytime Supplements */}
            {times.anytime.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Anytime/As Needed Supplements</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">Supplement</th>
                      <th className="py-2">Dosage</th>
                      {printFormat !== 'simple' && <th className="py-2">Frequency</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Brand</th>}
                      {printFormat === 'comprehensive' && <th className="py-2">Description</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {times.anytime.map((supp) => (
                      <tr key={supp.id} className="border-t border-gray-100">
                        <td className="py-3 font-medium">{supp.name}</td>
                        <td className="py-3">{supp.dosage}</td>
                        {printFormat !== 'simple' && <td className="py-3">{supp.frequency}</td>}
                        {printFormat === 'comprehensive' && <td className="py-3">{supp.brand || '-'}</td>}
                        {printFormat === 'comprehensive' && (
                          <td className="py-3">{supp.description || '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Notes */}
            {userInfo.notes && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">Notes</h2>
                <p className="text-gray-700 whitespace-pre-line">{userInfo.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <p>Generated on {new Date().toLocaleDateString()} by SupplementScribe</p>
              <p className="mt-1">Disclaimer: This protocol is not medical advice. Always consult with your healthcare provider before starting any supplement regimen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolPrintView; 