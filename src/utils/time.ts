type TTimeOptions = {
  withTimezoneOffset: boolean;
};

export function getLocalISO8601DateTimeString({ withTimezoneOffset }: TTimeOptions = {}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const dateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  if (!withTimezoneOffset) return dateTime;

  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, "0");

  return dateTime + sign + offsetHours + ":" + offsetMinutes;
}
