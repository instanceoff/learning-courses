export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomUsername = () => {
  return `User-${getRandomNumber(1, Number.MAX_SAFE_INTEGER)}`;
};
