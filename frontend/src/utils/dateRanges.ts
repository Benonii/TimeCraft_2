import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const getDateRange = (reportType: 'today' | 'this_week' | 'this_month' | 'custom') => {
    const now = new Date();
    
    switch (reportType) {
        case 'today':
            return {
                startDate: startOfDay(now),
                endDate: endOfDay(now)
            };
        case 'this_week':
            return {
                startDate: startOfWeek(now),
                endDate: endOfWeek(now)
            };
        case 'this_month':
            return {
                startDate: startOfMonth(now),
                endDate: endOfMonth(now)
            };
        default:
            return {
                startDate: startOfDay(now),
                endDate: endOfDay(now)
            };
    }
}; 