package ds.pointer.leetcode252;

import java.util.Arrays;

/**
 * 252.会议室
 * https://leetcode.cn/problems/meeting-rooms/
 *
 * @author yangyi 2023年09月12日22:31:53
 */
class Solution {

    public boolean canAttendMeetings(int[][] intervals) {
        int n = intervals.length;
        int[] start = new int[n];
        int[] end = new int[n];
        for (int i = 0; i < n; i++) {
            start[i] = intervals[i][0];
            end[i] = intervals[i][1];
        }
        Arrays.sort(start);
        Arrays.sort(end);
        int i = 0;
        while (i < n - 1) {
            if (start[i + 1] < end[i]) {
                return false;
            }
            i++;
        }
        return true;
    }

    public static void main(String[] args) {
        int[][] res = {{0, 30}, {5, 10}, {15, 20}};
        int[][] res2 = {{7, 10}, {2, 4}};
        System.out.println(new Solution().canAttendMeetings(res));
        System.out.println(new Solution().canAttendMeetings(res2));
    }
}
