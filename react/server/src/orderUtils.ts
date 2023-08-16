export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const randomDigits = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${year}${month}${day}-${randomDigits}`;
}
