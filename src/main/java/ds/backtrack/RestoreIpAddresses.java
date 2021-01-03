package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 复原IP地址
 * LeetCode 93 https://leetcode-cn.com/problems/restore-ip-addresses/
 *
 * @author yangyi 2021年01月03日12:52:54
 */
public class RestoreIpAddresses {

    private List<String> result = new LinkedList<>();

    public List<String> restoreIpAddresses(String s) {
        LinkedList<String> trace = new LinkedList<>();
        backtrace(s, 0, trace);
        return result;
    }

    private void backtrace(String s, int startIndex, LinkedList<String> trace) {
        if (trace.size() == 4) {
            if (startIndex == s.length()) {
                result.add(String.join(".", trace));
            }
            return;
        }
        for (int i = 1; i <= 3; i++) {
            if (s.length() - startIndex < i) {
                break;
            }
            String sub = s.substring(startIndex, startIndex + i);
            if (sub.length() > 1 && sub.startsWith("0")) {
                continue;
            }
            if (i == 3 && Integer.valueOf(sub) > 255) {
                continue;
            }
            trace.add(sub);
            backtrace(s, startIndex + i, trace);
            trace.removeLast();
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new RestoreIpAddresses().restoreIpAddresses("25525511135").toArray()));
        System.out.println(Arrays.toString(new RestoreIpAddresses().restoreIpAddresses("0000").toArray()));
        System.out.println(Arrays.toString(new RestoreIpAddresses().restoreIpAddresses("1111").toArray()));
        System.out.println(Arrays.toString(new RestoreIpAddresses().restoreIpAddresses("010010").toArray()));
        System.out.println(Arrays.toString(new RestoreIpAddresses().restoreIpAddresses("101023").toArray()));
    }
}
