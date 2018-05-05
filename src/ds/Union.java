package ds;

import java.util.HashSet;
import java.util.Set;

/**
 * A = A∪B
 *
 * @author yangyi 2018年05月04日18:15:39
 */
public class Union {

    public static void main(String[] args) {
        Set<String> a = new HashSet<>();
        a.add("张三");
        a.add("李四");
        a.add("王五");
        Set<String> b = new HashSet<>();
        b.add("赵六");
        b.add("张三");
        b.add("李四");

        System.out.println("before");
        System.out.println("a:" + a.toString());

        for (String s : b) {
            if (!a.contains(s)) {
                a.add(s);
            }
        }

        System.out.println("after");
        System.out.println("a:" + a.toString());
    }

}
