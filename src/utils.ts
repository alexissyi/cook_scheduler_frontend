export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const stringToMonthYear = (periodString: string) => {
  const monthString = periodString.slice(-2);
  const yearString = periodString.slice(0, 4);
  const month = parseInt(monthString);
  const year = parseInt(yearString);
  return { month: month, year: year };
};

export const monthYearToString = (month: number, year: number) => {
  let monthString = month.toString();
  if (monthString.length < 2) {
    monthString = "0" + monthString;
  }
  let yearString = year.toString();
  while (yearString.length < 4) {
    yearString = "0" + yearString;
  }
  return yearString + "-" + monthString;
};

export const dateToString = (date: Date) => {
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString(); //1-indexing for months
  let day = date.getDate().toString();
  while (year.length < 4) {
    year = "0" + year;
  }
  while (month.length < 2) {
    month = "0" + month;
  }
  while (day.length < 2) {
    day = "0" + day;
  }

  return year + "-" + month + "-" + day;
};

export const getPeriod = (dateString: string): string => {
  return dateString.slice(0, 7);
};

export const getDay = (dateString: string): number => {
  return Number(dateString.slice(8, 10));
};

export const stringToMonth = (dateString: string): number => {
  return Number(dateString.slice(5, 7));
};

export const stringToYear = (dateString: string): number => {
  return Number(dateString.slice(0, 4));
};
