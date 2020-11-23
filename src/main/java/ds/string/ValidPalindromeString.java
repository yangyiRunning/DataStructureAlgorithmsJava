package ds.string;

/**
 * 验证回文字符串
 *
 * @author yangyi 2019年02月15日18:11:43
 */
public class ValidPalindromeString {

    public boolean validPalindrome(String s) {
        if (s == null || "".equals(s)) {
            return false;
        }
        String res = s.trim().toLowerCase();
        int mid = res.length() >> 1;
        for (int i = 0; i < mid; i++) {
            if (res.charAt(i) != res.charAt(res.length() - 1 - i)) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        String a = "aba";
        String b = "abb";
        String c = "";
        String d = "abca";
        String e = "A man, a plan, a canal: Panama";
        String f = "race a car";
        ValidPalindromeString validPalindromeString = new ValidPalindromeString();
        System.out.println(a + "是否为回文字符串:" + validPalindromeString.validPalindrome(a));
        System.out.println(b + "是否为回文字符串:" + validPalindromeString.validPalindrome(b));
        System.out.println(c + "是否为回文字符串:" + validPalindromeString.validPalindrome(c));
        System.out.println(d + "是否为回文字符串:" + validPalindromeString.validPalindrome(d));
        System.out.println(e + "是否为回文字符串:" + validPalindromeString.validPalindrome(e));
        System.out.println(f + "是否为回文字符串:" + validPalindromeString.validPalindrome(f));
    }
}
