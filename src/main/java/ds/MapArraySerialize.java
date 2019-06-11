package ds;

import java.util.*;

/**
 * 基于数组的字典序列化以及反序列化
 * <p>
 * === 字典序列化 ===
 * <p>
 * 我们程序中用到了一个数组 a ，数组的每个元素都是一个字典（map/dict）。
 * 字典的 key/value 都是字符串，字符串中可包含任意字符。
 * <p>
 * 示例:
 * <p>
 * a[0]["k1"] = "v1"
 * a[0]["k2"] = "v2"
 * a[1]["A"] = "XXX"
 * ...
 * <p>
 * 实际使用过程中，我们自定义了一个基于字符串的存储结构，数组元素之间用“换行”分割，
 * 字典元素之间使用“分号”分割， key/value 之间用“等号”分割。
 * 上述数据序列化之后，应该得到一个字符串：
 * <p>
 * "k1=v1;k2=v2\nA=XXX"
 * <p>
 * 请实现一个“保存”函数、一个“加载”函数。
 * <p>
 * text = store(a); //把数组保存到一个字符串中
 * b = load(text);  //把字符串中的内容读取为字典数组
 * 预期结果 b == a （b与a内容完全一样）
 * <p>
 * 请考虑所有边界情况（任意字符、空内容等），不要出现bug。
 * 在满足上述需求的前提下，可自行增加一些规则和约定。
 *
 * @author yangyi 18813143928 2019年06月11日23:00:38
 */
public class MapArraySerialize {

    private static final String SUFFIX = "\\n";

    /**
     * 序列化
     *
     * @param mapArray Java的泛型系统为了兼容1.5之前，是个假泛型，泛型数组？！不存在的
     * @return 返回序列化之后的字符串
     */
    private String store(Object[] mapArray) {
        StringBuilder result = new StringBuilder();
        stopLooper:
        for (Object o : mapArray) {
            Map<String, String> map = (Map<String, String>) o;
            //i用来标记并剔除每个map后面末尾的分号
            int i = 0;
            for (Map.Entry<String, String> stringStringEntry : map.entrySet()) {
                //排除key的异常情况
                //1. key里有" "的
                //2. key直接为null的
                //3. key为特殊字符的
                //均看做异常
                String key = stringStringEntry.getKey();
                if (key == null || key.contains(" ") || key.contains("\\\\n")) {
                    //彻底的跳出这两层循环
                    break stopLooper;
                }
                result.append(key)
                        .append("=")
                        .append(stringStringEntry.getValue());
                if (i < map.size() - 1) {
                    result.append(";");
                }
                i++;
            }
            result.append(SUFFIX);
        }
        return result.substring(0, result.length() - SUFFIX.length());
    }

    /**
     * 反序列化
     *
     * @param input 输入的等待反序列化的字符串
     * @return 返回反序列化后的数组
     */
    private Object[] load(String input) {
        //因为数组的长度未知，所以借助List这个中介来转成数组
        //又因为只涉及增删操作，所以选取链表数组(LinkedList)的结构
        // (其实数据量不大，LinkedList还是ArrayList的性能区别可以忽略)
        List<Map<String, String>> result = new LinkedList<>();
        String[] mapStringArray = input.split("\\\\n");
        for (String mapString : mapStringArray) {
            Map<String, String> stringStringMap = new TreeMap<>();
            String[] kvStringArray = mapString.split(";");
            for (String kvString : kvStringArray) {
                String[] kv = kvString.split("=");
                if (kv.length == 2) {
                    stringStringMap.put(kv[0], kv[1]);
                }
            }
            result.add(stringStringMap);
        }
        return result.toArray();
    }

    /**
     * 构建几个测试用例（为保证K有序而且输出美观，用了TreeMap红黑树结构而没有用HashMap）
     */
    public static void main(String[] args) {
        Map<String, String> maps_1 = new TreeMap<>();
        maps_1.put("k1", "v1");
        maps_1.put("k2", "v2");
        maps_1.put("A", "XXX");

        Map<String, String> maps_2 = new TreeMap<>();
        maps_2.put("kk1", "vv1");
        maps_2.put("kk2", "vv2");
        maps_2.put("B", "YYY");

        Map<String, String> maps_3 = new TreeMap<>();
        maps_3.put("kkk1", "vvv1");
        maps_3.put("kkk2", "vvv2");
        maps_3.put("C", "ZZZ");

        //异常用例，实现Comparator以保证红黑树的key可以为null
        //如果不处理，默认抛出NPE，所以想用最好还是处理一下
        Map<String, String> maps_4 = new TreeMap<>((o1, o2) -> {
            if (o1 == null) {
                return 1;
            } else {
                return o2.charAt(0) - o1.charAt(0);
            }
        });
        maps_4.put(" ", "AAAA");
        maps_4.put("  ", "BBBB");
        maps_4.put("\\\\n", "CCCC");
        maps_4.put(null, "DDDD");
        maps_4.put(" E", "EEEE");
        maps_4.put("F ", "FFFF");
        maps_4.put("\\\\n ", "GGGG");
        maps_4.put(" \\\\n", "HHHH");


        Object[] objects = {maps_1, maps_2, maps_3, maps_4};

        MapArraySerialize mapArraySerialize = new MapArraySerialize();
        String result = mapArraySerialize.store(objects);
        System.out.println("输出序列化结果:");
        System.out.println(result);
        System.out.println();
        System.out.println("------------优雅的分割线-------------");
        System.out.println();
        System.out.println("将上方输出的序列化结果再反序列化一遍:");
        Object[] objectsResult = mapArraySerialize.load(result);
        System.out.println(Arrays.toString(objectsResult));
        System.out.println();
        System.out.println("------------优雅的分割线-------------");
        System.out.println();
        System.out.println("再将反序列化得出来的数组原路序列化回去，用equals比较一下");
        String resultFinal = mapArraySerialize.store(objectsResult);
        System.out.println("第二次序列化的结果为:");
        System.out.println(resultFinal);
        System.out.println();
        System.out.println("------------优雅的分割线-------------");
        System.out.println();
        if (resultFinal.equals(result)) {
            System.out.println("比较结果为:完全相等");
        } else {
            System.out.println("比较结果为:不相等");
        }
    }
}
