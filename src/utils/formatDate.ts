export const formatDate = (date: Date, format: string) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let formattedDate = format;
  formattedDate = formattedDate.replace("YYYY", year.toString());
  formattedDate = formattedDate.replace("MM", month.toString().padStart(2, "0"));
  formattedDate = formattedDate.replace("DD", day.toString().padStart(2, "0"));

  return formattedDate;
};
