package ds.pointer.target05;

import java.util.Arrays;

/**
 * 替换空格
 * 剑指offer 05 https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/
 *
 * @author yangyi 2021年01月19日17:21:34
 */
public class Solution {

    public String replaceSpace(String s) {
        int spaceCount = 0;
        char[] chars = s.toCharArray();
        for (char c : chars) {
            if (c == ' ') {
                spaceCount++;
            }
        }
        char[] newChars = Arrays.copyOf(chars, chars.length + spaceCount * 2);
        for (int oldIndex = chars.length - 1, newIndex = newChars.length - 1; oldIndex < newIndex; oldIndex--, newIndex--) {
            if (newChars[oldIndex] != ' ') {
                newChars[newIndex] = newChars[oldIndex];
            } else {
                newChars[newIndex--] = '0';
                newChars[newIndex--] = '2';
                newChars[newIndex] = '%';
            }
        }
        return new String(newChars);
    }

    public static void main(String[] args) {
        String string = "we are Chinese";
        String string1 = "            ";
        String string2 = "";
        String string3 = " ";
        String string4 = " we are Chinese ";
        Solution replaceBlankInString = new Solution();
        System.out.println(replaceBlankInString.replaceSpace(string));
        System.out.println(replaceBlankInString.replaceSpace(string1));
        System.out.println(replaceBlankInString.replaceSpace(string2));
        System.out.println(replaceBlankInString.replaceSpace(string3));
        System.out.println(replaceBlankInString.replaceSpace(string4));
    }
}
