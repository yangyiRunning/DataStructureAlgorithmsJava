package ds.string;

import java.util.LinkedList;
import java.util.List;

/**
 * Fizz Buzz
 * <p>
 * 写一个程序，输出从 1 到 n 数字的字符串表示。
 * <p>
 * 1. 如果 n 是3的倍数，输出“Fizz”；
 * <p>
 * 2. 如果 n 是5的倍数，输出“Buzz”；
 * <p>
 * 3.如果 n 同时是3和5的倍数，输出 “FizzBuzz”。
 * <p>
 * 示例：
 * <p>
 * n = 15,
 * <p>
 * 返回:
 * [
 * "1",
 * "2",
 * "Fizz",
 * "4",
 * "Buzz",
 * "Fizz",
 * "7",
 * "8",
 * "Fizz",
 * "Buzz",
 * "11",
 * "Fizz",
 * "13",
 * "14",
 * "FizzBuzz"
 * ]
 *
 * @author yangyi 2019年02月12日18:23:50
 */
public class FizzBuzz {

    public List<String> fizzBuzz(int n) {
        List<String> result = new LinkedList<>();
        for (int i = 1; i < n+1; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                result.add("FizzBuzz");
            } else if (i % 5 == 0) {
                result.add("Buzz");
            } else if (i % 3 == 0) {
                result.add("Fizz");
            } else {
                result.add(String.valueOf(i));
            }
        }
        return result;
    }

    public static void main(String[] args) {
        FizzBuzz fizzBuzz = new FizzBuzz();
        List<String> result = fizzBuzz.fizzBuzz(15);
        for (String s : result) {
            System.out.println(s);
        }
    }
}
