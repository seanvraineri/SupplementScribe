'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Supplement } from '@/types/supplement';

interface CalendarViewProps {
  supplements: Supplement[];
  onToggleTaken: (id: number, date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  trackingData?: {
    supplementId: number;
    taken: boolean;
  }[];
}

export default function CalendarView({ supplements, onToggleTaken }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  // Generate calendar days for the current month view
  useEffect(() => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Add days from previous month to fill the start of the calendar
    const daysFromPrevMonth = firstDayWeekday;
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      const date = new Date(year, month - 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    // Add days from next month to fill the end of the calendar
    const totalDaysToShow = 42; // 6 rows of 7 days
    const daysToAdd = totalDaysToShow - days.length;
    
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    // Simulate tracking data (mock data for 30 days back)
    const mockDataDays = days.map(day => {
      // Only add tracking data for days up to today
      if (day.date <= new Date()) {
        return {
          ...day,
          trackingData: supplements.map(supplement => {
            // Random boolean with higher chance of true (80%)
            const taken = Math.random() < 0.8;
            return {
              supplementId: supplement.id,
              taken
            };
          })
        };
      }
      return day;
    });
    
    setCalendarDays(mockDataDays);
  }, [currentDate, selectedDate, supplements]);
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };
  
  const handleToggleSupplementTaken = (id: number) => {
    onToggleTaken(id, selectedDate);
  };

  // Filter supplements data for selected date
  const selectedDateTrackingData = calendarDays.find(day => 
    isSameDay(day.date, selectedDate)
  )?.trackingData || [];
  
  // Calculate completion rate for selected date
  const selectedDateCompletionRate = selectedDateTrackingData.length > 0
    ? Math.round((selectedDateTrackingData.filter(item => item.taken).length / selectedDateTrackingData.length) * 100)
    : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg">Tracking Calendar</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-500 text-xs font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            // Calculate adherence percentage for the day
            const dayCompletionRate = day.trackingData 
              ? Math.round((day.trackingData.filter(item => item.taken).length / day.trackingData.length) * 100) 
              : 0;
              
            const isFutureDay = day.date > new Date();
              
            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={isFutureDay}
                className={`
                  p-1 rounded-lg text-sm relative h-12 flex flex-col items-center justify-center
                  ${day.isSelected ? 'ring-2 ring-gray-900' : ''}
                  ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  ${day.isToday ? 'font-bold' : ''}
                  ${isFutureDay ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                `}
              >
                <span className="z-10">{day.date.getDate()}</span>
                
                {day.trackingData && dayCompletionRate > 0 && (
                  <div 
                    className={`
                      absolute bottom-0 left-0 right-0 h-1.5 rounded-b-lg
                      ${dayCompletionRate === 100 ? 'bg-green-500' : 
                        dayCompletionRate >= 75 ? 'bg-emerald-400' :
                        dayCompletionRate >= 50 ? 'bg-amber-400' :
                        dayCompletionRate >= 25 ? 'bg-orange-400' : 'bg-red-400'}
                    `}
                    style={{ opacity: dayCompletionRate / 100 }}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected date supplements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {selectedDateTrackingData.length > 0 && (
            <div className="flex items-center">
              <div className="h-2 w-16 bg-gray-100 rounded-full mr-2">
                <div 
                  className={`
                    h-2 rounded-full
                    ${selectedDateCompletionRate === 100 ? 'bg-green-500' : 
                      selectedDateCompletionRate >= 75 ? 'bg-emerald-400' :
                      selectedDateCompletionRate >= 50 ? 'bg-amber-400' :
                      selectedDateCompletionRate >= 25 ? 'bg-orange-400' : 'bg-red-400'}
                  `}
                  style={{ width: `${selectedDateCompletionRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{selectedDateCompletionRate}%</span>
            </div>
          )}
        </div>
        
        {selectedDateTrackingData.length > 0 ? (
          <div className="space-y-2">
            {supplements.map(supplement => {
              const trackingItem = selectedDateTrackingData.find(
                item => item.supplementId === supplement.id
              );
              
              return (
                <motion.div
                  key={supplement.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    p-3 rounded-lg border flex items-center
                    ${trackingItem?.taken 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white'}
                  `}
                >
                  <button 
                    onClick={() => handleToggleSupplementTaken(supplement.id)}
                    className={`
                      w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3
                      ${trackingItem?.taken 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-gray-400'}
                    `}
                    disabled={selectedDate > new Date()}
                  >
                    {trackingItem?.taken && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center">
                      <h4 className="text-sm font-medium text-gray-900 mr-2">{supplement.name}</h4>
                      <div className="text-xs text-gray-500">{supplement.dosage}</div>
                    </div>
                    {supplement.timeOfDay && (
                      <div className="text-xs text-gray-500 mt-0.5">{supplement.timeOfDay.join(', ')}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          selectedDate > new Date() ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Future date - no tracking data available yet.</p>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No supplements tracked for this date.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
} 