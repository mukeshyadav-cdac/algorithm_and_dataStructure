const Power = (n: number):number => {
  if (n === 0) {
    return 1;
  }
  return n * Power(n - 1);
};
console.log(Power(5)); // 120
