package ds;

import java.util.*;

/**
 * 根据字符出现频率排序
 * <p>
 * <p>
 * 给定一个字符串，请将字符串里的字符按照出现的频率降序排列。
 * <p>
 * 示例 1:
 * <p>
 * 输入:
 * "tree"
 * <p>
 * 输出:
 * "eert"
 * <p>
 * 解释:
 * 'e'出现两次，'r'和't'都只出现一次。
 * 因此'e'必须出现在'r'和't'之前。此外，"eetr"也是一个有效的答案。
 * 示例 2:
 * <p>
 * 输入:
 * "cccaaa"
 * <p>
 * 输出:
 * "cccaaa"
 * <p>
 * 解释:
 * 'c'和'a'都出现三次。此外，"aaaccc"也是有效的答案。
 * 注意"cacaca"是不正确的，因为相同的字母必须放在一起。
 * 示例 3:
 * <p>
 * 输入:
 * "Aabb"
 * <p>
 * 输出:
 * "bbAa"
 * <p>
 * 解释:
 * 此外，"bbaA"也是一个有效的答案，但"Aabb"是不正确的。
 * 注意'A'和'a'被认为是两种不同的字符。
 *
 * @author yangyi 2019年02月17日22:18:08
 */
public class FrequencySort {

    public String frequencySort(String s) {
        Map<Character, Integer> map = new LinkedHashMap<>();
        for (int i = 0; i < s.length(); i++) {
            if (!map.containsKey(s.charAt(i))) {
                map.put(s.charAt(i), 1);
            } else {
                map.put(s.charAt(i), map.get(s.charAt(i)) + 1);
            }
        }
        List<Map.Entry<Character, Integer>> entryList = new LinkedList<>(map.entrySet());
        entryList.sort((o1, o2) -> o2.getValue() - o1.getValue());
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < entryList.size(); i++) {
            for (Integer integer = 0; integer < entryList.get(i).getValue(); integer++) {
                stringBuilder.append(entryList.get(i).getKey());
            }
        }
        return stringBuilder.toString();
    }

    public static void main(String[] args) {
        String a = "tree";
        String b = "cccaaa";
        String c = "Aabb";
        FrequencySort frequencySort = new FrequencySort();
        System.out.println(frequencySort.frequencySort(a));
        System.out.println(frequencySort.frequencySort(b));
        System.out.println(frequencySort.frequencySort(c));
    }
}
