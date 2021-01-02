package ds.string;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 分割回文串
 * LeetCode 131 https://leetcode-cn.com/problems/palindrome-partitioning/
 *
 * @author yangyi 2021年01月02日13:23:27
 */
public class Partition {

    private List<List<String>> result = new LinkedList<>();

    public List<List<String>> partition(String s) {
        LinkedList<String> trace = new LinkedList<>();
        backtrace(s, 0, trace);
        return result;
    }

    private void backtrace(String s, int startIndex, LinkedList<String> trace) {
        if (s.length() == startIndex) {
            result.add(new LinkedList<>(trace));
            return;
        }
        for (int i = startIndex; i < s.length(); i++) {
            //startIndex和i之间的子串判断是否为回文串并截取
            if (isPartition(s, startIndex, i)) {
                trace.add(s.substring(startIndex, i + 1));
            } else {
                continue;
            }
            backtrace(s, i + 1, trace);
            trace.removeLast();
        }
    }


    private boolean isPartition(String s, int start, int end) {
        while (start < end) {
            if (s.charAt(start) != s.charAt(end)) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Partition().partition("aab").toArray()));
    }
}
