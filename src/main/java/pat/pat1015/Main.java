package pat.pat1015;

import java.util.*;

/**
 * 1015 德才论 (25分)
 * 宋代史学家司马光在《资治通鉴》中有一段著名的“德才论”：“是故才德全尽谓之圣人，才德兼亡谓之愚人，德胜才谓之君子，才胜德谓之小人。凡取人之术，苟不得圣人，君子而与之，与其得小人，不若得愚人。”
 * <p>
 * 现给出一批考生的德才分数，请根据司马光的理论给出录取排名。
 * <p>
 * 输入格式：
 * <p>
 * 输入第一行给出 3 个正整数，分别为：N（≤10
 * ​5
 * ​​ ），即考生总数；L（≥60），为录取最低分数线，即德分和才分均不低于 L 的考生才有资格被考虑录取；H（<100），为优先录取线——德分和才分均不低于此线的被定义为“才德全尽”，此类考生按德才总分从高到低排序；才分不到但德分到线的一类考生属于“德胜才”，也按总分排序，但排在第一类考生之后；德才分均低于 H，但是德分不低于才分的考生属于“才德兼亡”但尚有“德胜才”者，按总分排序，但排在第二类考生之后；其他达到最低线 L 的考生也按总分排序，但排在第三类考生之后。
 * <p>
 * 随后 N 行，每行给出一位考生的信息，包括：准考证号 德分 才分，其中准考证号为 8 位整数，德才分为区间 [0, 100] 内的整数。数字间以空格分隔。
 * <p>
 * 输出格式：
 * <p>
 * 输出第一行首先给出达到最低分数线的考生人数 M，随后 M 行，每行按照输入格式输出一位考生的信息，考生按输入中说明的规则从高到低排序。当某类考生中有多人总分相同时，按其德分降序排列；若德分也并列，则按准考证号的升序输出。
 * <p>
 * 输入样例：
 * <p>
 * 14 60 80
 * 10000001 64 90
 * 10000002 90 60
 * 10000011 85 80
 * 10000003 85 80
 * 10000004 80 85
 * 10000005 82 77
 * 10000006 83 76
 * 10000007 90 78
 * 10000008 75 79
 * 10000009 59 90
 * 10000010 88 45
 * 10000012 80 100
 * 10000013 90 99
 * 10000014 66 60
 * 输出样例：
 * <p>
 * 12
 * 10000013 90 99
 * 10000012 80 100
 * 10000003 85 80
 * 10000011 85 80
 * 10000004 80 85
 * 10000007 90 78
 * 10000006 83 76
 * 10000005 82 77
 * 10000002 90 60
 * 10000014 66 60
 * 10000008 75 79
 * 10000001 64 90
 *
 * @author yangyi 2020年10月20日15:16:06
 */
public class Main {

    private static class Student {
        private int id;
        private int mind;
        private int talent;

        public Student(int id, int mind, int talent) {
            this.id = id;
            this.mind = mind;
            this.talent = talent;
        }
    }

    private static class DescComparator implements Comparator<Student> {

        @Override
        public int compare(Student o1, Student o2) {
            int score1 = o1.mind + o1.talent;
            int score2 = o2.mind + o2.talent;
            //总分降序
            if (score1 < score2) {
                return 1;
            } else if (score1 > score2) {
                return -1;
            } else {
                //两者总分相等，德分降序
                if (o1.mind < o2.mind) {
                    return 1;
                } else if (o1.mind > o2.mind) {
                    return -1;
                } else {
                    //德分也相等，准考证升序
                    if (o1.id < o2.id) {
                        return -1;
                    } else if (o1.id > o2.id) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        //输入的考生人数
        int n = scanner.nextInt();
        //录取的最低分数线
        int l = scanner.nextInt();
        //优先录取线
        int h = scanner.nextInt();

        //学号、德分、才分
        List<Student> first = new LinkedList<>();
        List<Student> second = new LinkedList<>();
        List<Student> third = new LinkedList<>();
        List<Student> end = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            int id = scanner.nextInt();
            int mind = scanner.nextInt();
            int talent = scanner.nextInt();

            if (mind >= h && talent >= h) {
                //第一顺位: 才德全尽，此类考生按德才总分从高到低排序
                first.add(new Student(id, mind, talent));
            } else if (talent < h && talent >= l && mind >= h) {
                //第二顺位: 德胜才，才分不到但德分到线的一类考生属于“德胜才”，也按总分排序，但排在第一类考生之后
                second.add(new Student(id, mind, talent));
            } else if (mind < h && talent < h && talent >= l && mind >= talent) {
                //第三顺位: 德才分均低于H，但是德分不低于才分的考生属于“才德兼亡”但尚有“德胜才”者，按总分排序，但排在第二类考生之后
                third.add(new Student(id, mind, talent));
            } else if (mind >= l && talent >= l) {
                //其他达到最低线 L 的考生也按总分排序，但排在第三类考生之后
                end.add(new Student(id, mind, talent));
            }
        }

        first.sort(new DescComparator());
        second.sort(new DescComparator());
        third.sort(new DescComparator());
        end.sort(new DescComparator());
        List<Student> result = new LinkedList<>();
        result.addAll(first);
        result.addAll(second);
        result.addAll(third);
        result.addAll(end);

        System.out.println(result.size());
        for (Student student : result) {
            System.out.println(student.id + " " + student.mind + " " + student.talent);
        }
    }
}
