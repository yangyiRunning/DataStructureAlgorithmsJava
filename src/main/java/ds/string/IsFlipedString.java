package ds.string;

/**
 * 面试题 01.09. 字符串轮转
 * LeetCode https://leetcode-cn.com/problems/string-rotation-lcci/
 *
 * @author yangyi 2021年01月12日14:31:35
 */
public class IsFlipedString {

    public boolean isFlipedString(String s1, String s2) {
        if (s1.length() != s2.length()) {
            return false;
        }
        return (s2 + s2).contains(s1);
    }

    public static void main(String[] args) {
        System.out.println(new IsFlipedString().isFlipedString("waterbottle", "erbottlewat"));
        System.out.println(new IsFlipedString().isFlipedString("aa", "aba"));
    }
}
