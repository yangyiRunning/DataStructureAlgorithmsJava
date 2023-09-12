package ds.pointer.leetcode253;

import java.util.Arrays;

/**
 * 253. 会议室 II
 * https://leetcode.cn/problems/meeting-rooms-ii/
 *
 * @author yangyi 2023年09月12日23:15:50
 */
class Solution {

    public int minMeetingRooms(int[][] intervals) {
        int n = intervals.length;
        int[] start = new int[n];
        int[] end = new int[n];
        for (int i = 0; i < n; i++) {
            start[i] = intervals[i][0];
            end[i] = intervals[i][1];
        }
        Arrays.sort(start);
        Arrays.sort(end);
        int result = 0, count = 0;
        int i = 0, j = 0;
        while (i < n && j < n) {
            if (start[i] < end[j]) {
                count++;
                i++;
            } else {
                count--;
                j++;
            }
            result = Math.max(result, count);
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] res = {{0, 30}, {5, 10}, {15, 20}};
        int[][] res2 = {{7, 10}, {2, 4}};
        System.out.println(new Solution().minMeetingRooms(res));
        System.out.println(new Solution().minMeetingRooms(res2));
    }
}
