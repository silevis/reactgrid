export const formatDate = (date: Date, format: string) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  let formattedDate = format;
  formattedDate = formattedDate.replace("YYYY", year.toString());
  formattedDate = formattedDate.replace("MM", month.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("DD", day.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("HH", hours.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("mm", minutes.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("ss", seconds.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("SSS", milliseconds.toString().padStart(3, "0"));

  return formattedDate;
};
