import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Sample events (in a real app, these would come from your store)
  const events = [
    { id: '1', title: 'Upload Episode 1', date: '2025-01-25', type: 'publish' },
    { id: '2', title: 'Blog Post Deadline', date: '2025-01-28', type: 'deadline' },
    { id: '3', title: 'Team Meeting', date: '2025-01-30', type: 'meeting' },
  ];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'publish': return 'bg-green-100 text-green-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-2">Schedule and track your content across all platforms</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map(date => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            const isSelected = isSameDay(date, selectedDate);

            return (
              <div
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="space-y-3">
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'publish' ? 'bg-green-500' :
                  event.type === 'deadline' ? 'bg-red-500' :
                  event.type === 'meeting' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{event.type}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}