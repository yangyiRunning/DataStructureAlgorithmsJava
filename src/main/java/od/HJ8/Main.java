package od.HJ8;

import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

/**
 * @author yangyi 2023年08月29日16:09:39
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        TreeMap<Integer, Integer> tree = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            int key = in.nextInt();
            int value = in.nextInt();
            if (tree.containsKey(key)) {
                tree.put(key, tree.getOrDefault(key, 0) + value);
            } else {
                tree.put(key, value);
            }
        }
        for (Map.Entry<Integer, Integer> integerIntegerEntry : tree.entrySet()) {
            System.out.println(integerIntegerEntry.getKey() + " " + integerIntegerEntry.getValue());
        }
    }
}
