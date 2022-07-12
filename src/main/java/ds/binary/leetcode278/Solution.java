package ds.binary.leetcode278;

/**
 * 第一个错误的版本
 * LeetCode 278. https://leetcode.cn/problems/first-bad-version/
 *
 * @author yangyi 2022年07月12日17:33:15
 */
public class Solution {

    public int firstBadVersion(int n) {
        int start = 0, end = n;
        while (start < end) {
            int middle = start + (end - start) / 2;
            if (isBadVersion(middle)) {
                end = middle;
            } else {
                start = middle + 1;
            }
        }
        if (start == end && isBadVersion(start)) {
            return start;
        }
        return -1;
    }

    private boolean isBadVersion(int version) {
        if (version == 3) {
            return false;
        } else if (version == 5) {
            return true;
        } else if (version == 4) {
            return true;
        } else {
            return false;
        }
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.firstBadVersion(5));
    }
}
