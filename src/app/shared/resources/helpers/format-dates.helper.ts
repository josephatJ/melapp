export function formatDateToYYMMDD(dateValue: any, reverse: boolean = false) {
  return reverse
    ? formatMonthOrDate(dateValue.getDate(), 'd') +
        '-' +
        formatMonthOrDate(dateValue.getMonth() + 1, 'm') +
        '-' +
        dateValue.getFullYear()
    : dateValue.getFullYear() +
        '-' +
        formatMonthOrDate(dateValue.getMonth() + 1, 'm') +
        '-' +
        formatMonthOrDate(dateValue.getDate(), 'd');
}

function formatMonthOrDate(value: any, type: any) {
  if (type == 'm' && value.toString().length == 1) {
    return '0' + value;
  } else if (type == 'd' && value.toString().length == 1) {
    return '0' + value;
  } else {
    return value.toString();
  }
}

export function returnTwoChars(value: any): string {
  if (value.toString().length == 1) {
    return '0' + value;
  } else {
    return value.toString();
  }
}

export function getLastDateByMonthAndYear(month: string, year: number): string {
  return month === 'January' ||
    month === 'March' ||
    month === 'May' ||
    month === 'July' ||
    month === 'October' ||
    month === 'December'
    ? '31'
    : month === 'February' && year % 4 === 0
    ? '29'
    : month === 'February'
    ? '28'
    : '30';
}

export function generateTwoYearsOptions(year: number): any[] {
  return [0, 1]?.map((n: number) => {
    return {
      id: (year - n).toString(),
      value: (year - n).toString(),
      label: (year - n).toString(),
      name: (year - n).toString(),
    };
  });
}

export function getLastMonth(): string {
  let lastMonth = '';
  const currentDate = new Date();
  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  const mon = (previousMonthDate.getMonth() + 1).toString();
  lastMonth =
    mon == '1'
      ? 'January'
      : mon == '2'
      ? 'February'
      : mon == '3'
      ? 'March'
      : mon == '4'
      ? 'April'
      : mon == '5'
      ? 'May'
      : mon === '6'
      ? 'June'
      : mon === '7'
      ? 'July'
      : mon == '8'
      ? 'August'
      : mon == '9'
      ? 'September'
      : mon == '10'
      ? 'October'
      : mon == '11'
      ? 'November'
      : 'December';
  return lastMonth;
}
