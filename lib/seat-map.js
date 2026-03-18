export function getSeatLetters(aircraft = {}) {
  return aircraft.letters || ['A', 'B', 'C', 'D', 'E', 'F'];
}

export function getSeatRows(aircraft = {}) {
  return Array.from({ length: aircraft.rows || 30 }, (_, index) => index + 1);
}

export function getAllSeatIds(aircraft = {}) {
  return getSeatRows(aircraft).flatMap((row) =>
    getSeatLetters(aircraft).map((letter) => `${row}${letter}`)
  );
}

export function buildSeatMap(aircraft = {}, bookedSeats = []) {
  const letters = getSeatLetters(aircraft);
  const rows = getSeatRows(aircraft);
  const businessRows = new Set(aircraft.businessRows || []);
  const booked = new Set(bookedSeats);

  return rows.map((row) => ({
    row,
    cabin: businessRows.has(row) ? 'business' : 'economy',
    seats: letters.map((letter, index) => ({
      id: `${row}${letter}`,
      letter,
      row,
      position: index < 3 ? 'left' : 'right',
      status: booked.has(`${row}${letter}`) ? 'booked' : 'available'
    }))
  }));
}

export function getAvailableSeatCount(aircraft = {}, bookedSeats = []) {
  return getAllSeatIds(aircraft).length - bookedSeats.length;
}
