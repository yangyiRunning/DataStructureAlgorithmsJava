package ds.binary.leetcode374;

/**
 * 猜数字大小
 * LeetCode 374. https://leetcode.cn/problems/guess-number-higher-or-lower/
 *
 * @author yangyi 2022年07月12日15:04:14
 */
public class Solution {

    private final int pick;

    public Solution(int pick) {
        this.pick = pick;
    }

    public int guessNumber(int num) {
        int start = 0, end = num;
        while (start <= end) {
            int middle = start + (end - start) / 2;
            if (guess(middle) == 1) {
                start = middle + 1;
            } else if (guess(middle) == -1) {
                end = middle - 1;
            } else {
                return middle;
            }
        }
        return -1;
    }

    /**
     * Forward declaration of guess API.
     *
     * @param num your guess
     * @return -1 if num is lower than the guess number
     * 1 if num is higher than the guess number
     * otherwise return 0
     * int guess(int num);
     */
    private int guess(int num) {
        return Integer.compare(pick, num);
    }

    public static void main(String[] args) {
        System.out.println(new Solution(6).guessNumber(10));
        System.out.println(new Solution(1).guessNumber(1));
        System.out.println(new Solution(1).guessNumber(2));
        System.out.println(new Solution(2).guessNumber(2));
    }
}
