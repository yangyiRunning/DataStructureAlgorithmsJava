package ds.binary.leetcode69;

/**
 * x的平方根
 * LeetCode 69. https://leetcode.cn/problems/sqrtx/
 *
 * @author yangyi 2022年07月12日14:16:11
 */
public class Solution {

    public int mySqrt(int x) {
        if (x == 0 || x == 1) {
            return x;
        }
        int start = 0, end = x;
        while (start <= end) {
            int middle = start + (end - start) / 2;
            if (middle < x / middle) {
                start = middle + 1;
            } else if (middle > x / middle) {
                end = middle - 1;
            } else {
                return middle;
            }
        }
        return end;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().mySqrt(4));
        System.out.println(new Solution().mySqrt(8));
    }
}
