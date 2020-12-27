package ds.backtrack;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

/**
 * 电话号码的字母组合 (多个集合求组合，不同于单个集合求组合)
 * <p>
 * LeetCode 17 https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/
 *
 * @author yangyi 2020年12月27日14:51:50
 */
public class LetterCombinations {

    private HashMap<Integer, String> phone = new HashMap<>();
    private List<String> result = new LinkedList<>();

    public List<String> letterCombinations(String digits) {
        phone.put(0, "");
        phone.put(1, "");
        phone.put(2, "abc");
        phone.put(3, "def");
        phone.put(4, "ghi");
        phone.put(5, "jkl");
        phone.put(6, "mno");
        phone.put(7, "pqrs");
        phone.put(8, "tuv");
        phone.put(9, "wxyz");

        StringBuilder track = new StringBuilder();
        backtrack(digits, 0, track);
        return result;
    }

    private void backtrack(String digits, int index, StringBuilder track) {
        if ("".equals(digits)) {
            return;
        }
        if (digits.length() == index) {
            result.add(String.valueOf(track));
            return;
        }
        int key = digits.charAt(index) - '0';
        String value = phone.get(key);
        for (int i = 0; i < value.length(); i++) {
            track.append(value.charAt(i));
            backtrack(digits, index + 1, track);
            track.deleteCharAt(track.length() - 1);
        }
    }

    public static void main(String[] args) {
        LetterCombinations letterCombinations = new LetterCombinations();
        System.out.println(Arrays.toString(letterCombinations.letterCombinations("23").toArray()));
    }
}
