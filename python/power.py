def power(n:int) -> int:
    if n == 0:
        return 1
    else:
        return n * power(n - 1)
