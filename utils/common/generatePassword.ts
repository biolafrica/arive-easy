export default function generateTempPassword(length = 12) {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '@#$!&';
  const allChars = lowercase + uppercase + numbers + symbols;

  const requiredChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ];

  const remainingLength = length - requiredChars.length;
  const remainingChars = Array.from({ length: remainingLength }, () =>
    allChars[Math.floor(Math.random() * allChars.length)]
  );

  const passwordArray = [...requiredChars, ...remainingChars].sort(
    () => Math.random() - 0.5
  );

  return passwordArray.join('');
}