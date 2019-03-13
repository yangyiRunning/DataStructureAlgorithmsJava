package ds;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * 最常见的单词
 * <p>
 * <p>
 * 给定一个段落 (paragraph) 和一个禁用单词列表 (banned)。返回出现次数最多，同时不在禁用列表中的单词。题目保证至少有一个词不在禁用列表中，而且答案唯一。
 * <p>
 * 禁用列表中的单词用小写字母表示，不含标点符号。段落中的单词不区分大小写。答案都是小写字母。
 * <p>
 * <p>
 * <p>
 * 示例：
 * <p>
 * 输入:
 * paragraph = "Bob hit a ball, the hit BALL flew far after it was hit."
 * banned = ["hit"]
 * 输出: "ball"
 * 解释:
 * "hit" 出现了3次，但它是一个禁用的单词。
 * "ball" 出现了2次 (同时没有其他单词出现2次)，所以它是段落里出现次数最多的，且不在禁用列表中的单词。
 * 注意，所有这些单词在段落里不区分大小写，标点符号需要忽略（即使是紧挨着单词也忽略， 比如 "ball,"），
 * "hit"不是最终的答案，虽然它出现次数更多，但它在禁用单词列表中。
 * <p>
 * <p>
 * 说明：
 * <p>
 * 1 <= 段落长度 <= 1000.
 * 1 <= 禁用单词个数 <= 100.
 * 1 <= 禁用单词长度 <= 10.
 * 答案是唯一的, 且都是小写字母 (即使在 paragraph 里是大写的，即使是一些特定的名词，答案都是小写的。)
 * paragraph 只包含字母、空格和下列标点符号!?',;.
 * 不存在没有连字符或者带有连字符的单词。
 * 单词里只包含字母，不会出现省略号或者其他标点符号。
 *
 * @author yangyi 2019年02月17日19:04:33
 */
public class MostCommonWord {

    public String mostCommonWord(String paragraph, String[] banned) {
        String newString = paragraph.replaceAll("[\\pP\\pS\\pZ]", " ");
        for (int i = 0; i < banned.length; i++) {
            newString = newString.replace(banned[i], "");
        }

        String[] res = newString.split(" ");
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < res.length; i++) {
            res[i] = res[i].toLowerCase();
            if (!"".equals(res[i])) {
                if (!map.containsKey(res[i])) {
                    map.put(res[i], 1);
                } else {
                    map.put(res[i], map.get(res[i]) + 1);
                }
            }
        }
        int max = Integer.MIN_VALUE;
        String key = "";
        for (Map.Entry<String, Integer> stringIntegerEntry : map.entrySet()) {
            if (stringIntegerEntry.getValue() > max) {
                max = stringIntegerEntry.getValue();
                key = stringIntegerEntry.getKey();
            }
        }
        return key;
    }

    public static void main(String[] args) {
        String a = "Bob hit a ball, the hit BALL flew far after it was hit.";
        String c = "Bob";
        String[] b = {"hit"};
        String[] d = {};
        String e = "a, a, a, a, b,b,b,c, c";
        String[] f = {"a"};
        MostCommonWord mostCommonWord = new MostCommonWord();
        System.out.println(a + "中除去" + Arrays.toString(b) + "后出现次数最多的单词是:" + mostCommonWord.mostCommonWord(a, b));
        System.out.println(c + "中除去" + Arrays.toString(d) + "后出现次数最多的单词是:" + mostCommonWord.mostCommonWord(c, d));
        System.out.println(e + "中除去" + Arrays.toString(f) + "后出现次数最多的单词是:" + mostCommonWord.mostCommonWord(e, f));
    }
}
