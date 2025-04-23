const SayDigit = (num: number): string => {
  const arr: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  if (num === 0) {
    return '';
  }

  const digit = num % 10;
  const remaining = Math.floor(num / 10);

  return SayDigit(remaining) + ' ' + arr[digit];
}

console.log(SayDigit(123)); // one two three
console.log(SayDigit(0)); // zero
console.log(SayDigit(456)); // four five six
