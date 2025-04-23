/**
 * @param {number} n
 * @return {number}
 */
const climbStairs = function(n: number): number {
  if(n === 1) {
      return 1;
  }
  if( n === 2) {
      return 2;
  }

  return climbStairs(n-1) + climbStairs(n-2)
};

climbStairs(4)
