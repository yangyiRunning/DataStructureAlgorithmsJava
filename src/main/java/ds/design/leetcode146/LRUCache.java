package ds.design.leetcode146;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * LRU缓存机制
 * 146 LeetCode https://leetcode-cn.com/problems/lru-cache/
 *
 * @author yangyi 2021年03月01日23:49:28
 */
public class LRUCache {

    private LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry eldest) {
                return map.size() > capacity;
            }
        };
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2 /* 缓存容量 */);

        cache.put(1, 1);
        cache.put(2, 2);
        // 返回  1
        System.out.println(cache.get(1));
        // 该操作会使得密钥 2 作废
        cache.put(3, 3);
        // 返回 -1 (未找到)
        System.out.println(cache.get(2));
        // 该操作会使得密钥 1 作废
        cache.put(4, 4);
        // 返回 -1 (未找到)
        System.out.println(cache.get(1));
        // 返回  3
        System.out.println(cache.get(3));
        // 返回  4
        System.out.println(cache.get(4));

    }

}
