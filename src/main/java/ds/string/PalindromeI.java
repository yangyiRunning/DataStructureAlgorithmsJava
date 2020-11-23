package ds.string;

/**
 * 验证回文串
 * <p>
 * <p>
 * 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
 * <p>
 * 说明：本题中，我们将空字符串定义为有效的回文串。
 * <p>
 * 示例 1:
 * <p>
 * 输入: "A man, a plan, a canal: Panama"
 * 输出: true
 * 示例 2:
 * <p>
 * 输入: "race a car"
 * 输出: false
 */
public class PalindromeI {

    public boolean isPalindrome(String s) {
        if ("".equals(s)) {
            return true;
        }
        String lowerString = s.toLowerCase();
        StringBuilder stringBuilder = new StringBuilder();
        char[] chars = lowerString.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            if ((chars[i] >= 'a' && chars[i] <= 'z') || (chars[i] >= '0' && chars[i] <= '9')) {
                stringBuilder.append(chars[i]);
            }
        }
        return stringBuilder.toString().equals(stringBuilder.reverse().toString());
    }

    public static void main(String[] args) {
        String a = "A man, a plan, a canal: Panama";
        String b = "race a car";
        PalindromeI palindromeI = new PalindromeI();
        System.out.println(palindromeI.isPalindrome(a));
        System.out.println(palindromeI.isPalindrome(b));
    }
}
