package pat.pat1015;

import java.util.*;

/**
 * 1015 德才论 (25分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805307551629312
 *
 * @author yangyi
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
