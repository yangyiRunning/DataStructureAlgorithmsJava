package ds;

import java.util.*;

/**
 * 前K个高频单词
 * <p>
 * 给一非空的单词列表，返回前 k 个出现次数最多的单词。
 * <p>
 * 返回的答案应该按单词出现频率由高到低排序。如果不同的单词有相同出现频率，按字母顺序排序。
 * <p>
 * 示例 1：
 * <p>
 * 输入: ["i", "love", "leetcode", "i", "love", "coding"], k = 2
 * 输出: ["i", "love"]
 * 解析: "i" 和 "love" 为出现次数最多的两个单词，均为2次。
 * 注意，按字母顺序 "i" 在 "love" 之前。
 * <p>
 * <p>
 * 示例 2：
 * <p>
 * 输入: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], k = 4
 * 输出: ["the", "is", "sunny", "day"]
 * 解析: "the", "is", "sunny" 和 "day" 是出现次数最多的四个单词，
 * 出现次数依次为 4, 3, 2 和 1 次。
 * <p>
 * <p>
 * 注意：
 * <p>
 * 假定 k 总为有效值， 1 ≤ k ≤ 集合元素数。
 * 输入的单词均由小写字母组成。
 * <p>
 * <p>
 * 扩展练习：
 * <p>
 * 尝试以 O(n log k) 时间复杂度和 O(n) 空间复杂度解决。
 *
 * @author yangyi 2019年02月18日13:10:04
 */
public class TopKWord {

    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> map = new TreeMap<>();
        for (int i = 0; i < words.length; i++) {
            if (!map.containsKey(words[i])) {
                map.put(words[i], 1);
            } else {
                map.put(words[i], map.get(words[i]) + 1);
            }
        }
        PriorityQueue<String> priorityQueue = new PriorityQueue<>(k,
                new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        if(map.get(o1).equals(map.get(o2))){
                            return o1.compareTo(o2) * -1;
                        }else{
                            return map.get(o1).compareTo(map.get(o2));
                        }
                    }
                });
        for (Map.Entry<String, Integer> stringIntegerEntry : map.entrySet()) {
            if (priorityQueue.size() < k) {
                priorityQueue.offer(stringIntegerEntry.getKey());
            } else if (stringIntegerEntry.getValue() > map.get(priorityQueue.peek())) {
                priorityQueue.poll();
                priorityQueue.offer(stringIntegerEntry.getKey());
            }
        }
        LinkedList<String> result = new LinkedList<>();
        while (!priorityQueue.isEmpty()) {
            result.addFirst(priorityQueue.poll());
        }
        return result;
    }

    public static void main(String[] args) {
        String[] a = {"i", "love", "leetcode", "i", "love", "coding"};
        String[] b = {"the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"};
        String[] c = {"i"};
        TopKWord topKWord = new TopKWord();
        System.out.println(Arrays.toString(topKWord.topKFrequent(a, 1).toArray()));
        System.out.println(Arrays.toString(topKWord.topKFrequent(a, 2).toArray()));
        System.out.println(Arrays.toString(topKWord.topKFrequent(b, 4).toArray()));
        System.out.println(Arrays.toString(topKWord.topKFrequent(c, 4).toArray()));
    }
}
