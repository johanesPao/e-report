export const toTitle = (kalimat: string) => {
  return kalimat
    .toLowerCase()
    .split(" ")
    .map((kata) => {
      return kata.replace(kata[0], kata[0].toUpperCase());
    })
    .join(" ");
};
