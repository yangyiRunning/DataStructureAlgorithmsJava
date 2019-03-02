package ds;

import java.util.ArrayList;
import java.util.List;

/**
 * 单词拆分
 * <p>
 * <p>
 * 给定一个非空字符串 s 和一个包含非空单词列表的字典 wordDict，判定 s 是否可以被空格拆分为一个或多个在字典中出现的单词。
 * <p>
 * 说明：
 * <p>
 * 拆分时可以重复使用字典中的单词。
 * 你可以假设字典中没有重复的单词。
 * 示例 1：
 * <p>
 * 输入: s = "leetcode", wordDict = ["leet", "code"]
 * 输出: true
 * 解释: 返回 true 因为 "leetcode" 可以被拆分成 "leet code"。
 * 示例 2：
 * <p>
 * 输入: s = "applepenapple", wordDict = ["apple", "pen"]
 * 输出: true
 * 解释: 返回 true 因为 "applepenapple" 可以被拆分成 "apple pen apple"。
 * 注意你可以重复使用字典中的单词。
 * 示例 3：
 * <p>
 * 输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
 * 输出: false
 *
 * @author yangyi 2019年03月02日16:38:46
 */
public class WordBreak {

    public boolean wordBreak(String s, List<String> wordDict) {
        // 可以类比于背包问题
        int n = s.length();
        // memo[i] 表示 s 中以 i - 1 结尾的字符串是否可被 wordDict 拆分
        boolean[] memo = new boolean[n + 1];
        memo[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (memo[j] && wordDict.contains(s.substring(j, i))) {
                    memo[i] = true;
                    break;
                }
            }
        }
        return memo[n];
    }

    public static void main(String[] args) {
        String a = "leetcode";
        String b = "applepenapple";
        String c = "catsandog";
        List<String> aList = new ArrayList<>();//{"leet", "code"};
        aList.add("leet");
        aList.add("code");
        List<String> bList = new ArrayList<>();//{"apple", "pen"};
        bList.add("apple");
        bList.add("pen");
        List<String> cList = new ArrayList<>();//{"cats", "dog", "sand", "and", "cat"};
        cList.add("cats");
        cList.add("dog");
        cList.add("sand");
        cList.add("and");
        cList.add("cat");
        WordBreak wordBreak = new WordBreak();
        System.out.println(wordBreak.wordBreak(a, aList));
        System.out.println(wordBreak.wordBreak(b, bList));
        System.out.println(wordBreak.wordBreak(c, cList));
    }
}
