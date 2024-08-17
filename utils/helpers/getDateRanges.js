export function getDateRanges() {
  const today = new Date();
  
  // Current Day
  const currentDay = today.toISOString().split('T')[0];
  
  // Previous Day
  const previousDayDate = new Date(today);
  previousDayDate.setDate(today.getDate() - 1);
  const previousDay = previousDayDate.toISOString().split('T')[0];

  // Current Week
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - dayOfWeek); // Set to previous Sunday
  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6); // Set to next Saturday

  // Previous Week
  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7); // Go back 7 days
  const endOfPreviousWeek = new Date(endOfCurrentWeek);
  endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 7); // Go back 7 days

  // Current Month
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed, so 7 = August
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
  const endOfCurrentMonth = today; // Today's date

  // Previous Month
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfLastMonth = new Date(currentYear, currentMonth, 0); // 0th day of the current month gives us the last day of the previous month

  // Current Year
  const startOfCurrentYear = new Date(currentYear, 0, 1);
  const endOfCurrentYear = today; // Today's date

  // Previous Year
  const startOfPreviousYear = new Date(currentYear - 1, 0, 1);
  const endOfPreviousYear = new Date(currentYear - 1, 11, 31);

  return {
    currentDayRange: {
      startDate: currentDay,
      endDate: currentDay
    },
    previousDayRange: {
      startDate: previousDay,
      endDate: previousDay
    },
    currentWeekRange: {
      startDate: startOfCurrentWeek.toISOString().split('T')[0],
      endDate: endOfCurrentWeek.toISOString().split('T')[0]
    },
    previousWeekRange: {
      startDate: startOfPreviousWeek.toISOString().split('T')[0],
      endDate: endOfPreviousWeek.toISOString().split('T')[0]
    },
    currentMonthRange: {
      startDate: startOfCurrentMonth.toISOString().split('T')[0],
      endDate: endOfCurrentMonth.toISOString().split('T')[0]
    },
    lastMonthRange: {
      startDate: startOfLastMonth.toISOString().split('T')[0],
      endDate: endOfLastMonth.toISOString().split('T')[0]
    },
    currentYearRange: {
      startDate: startOfCurrentYear.toISOString().split('T')[0],
      endDate: endOfCurrentYear.toISOString().split('T')[0]
    },
    lastYearRange: {
      startDate: startOfPreviousYear.toISOString().split('T')[0],
      endDate: endOfPreviousYear.toISOString().split('T')[0]
    }
  };
}

export const getYearDateRanges = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed, January is 0
  const dateRanges = [];

  for (let month = 0; month <= currentMonth; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0); // Last day of the month

    dateRanges.push({ startDate, endDate });
  }

  return dateRanges;
};
