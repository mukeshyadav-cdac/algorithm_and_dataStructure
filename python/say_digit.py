def say_digit(digit :int) -> str:
    words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

    if digit == 0:
        return ''

    digit = digit % 10
    remaining = digit // 10
    return words[digit] + say_digit(remaining)
