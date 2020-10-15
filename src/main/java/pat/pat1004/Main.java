package pat.pat1004;

import java.util.Scanner;

/**
 * 读入 n（>0）名学生的姓名、学号、成绩，分别输出成绩最高和成绩最低学生的姓名和学号。
 * <p>
 * 输入格式：
 * <p>
 * 每个测试输入包含 1 个测试用例，格式为
 * <p>
 * 第 1 行：正整数 n
 * 第 2 行：第 1 个学生的姓名 学号 成绩
 * 第 3 行：第 2 个学生的姓名 学号 成绩
 * ... ... ...
 * 第 n+1 行：第 n 个学生的姓名 学号 成绩
 * 其中姓名和学号均为不超过 10 个字符的字符串，成绩为 0 到 100 之间的一个整数，这里保证在一组测试用例中没有两个学生的成绩是相同的。
 * <p>
 * 输出格式：
 * <p>
 * 对每个测试用例输出 2 行，第 1 行是成绩最高学生的姓名和学号，第 2 行是成绩最低学生的姓名和学号，字符串间有 1 空格。
 * <p>
 * 输入样例：
 * <p>
 * 3
 * Joe Math990112 89
 * Mike CS991301 100
 * Mary EE990830 95
 * 输出样例：
 * <p>
 * Mike CS991301
 * Joe Math990112
 *
 * @author yangyi 2020年10月15日19:04:26
 */
public class Main {

    static class Student {
        private String name;
        private String number;
        private int score;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Student[] students = new Student[n];
        int minScore = Integer.MAX_VALUE;
        int minIndex = -1;
        int maxScore = Integer.MIN_VALUE;
        int maxIndex = -1;
        for (int i = 0; i < students.length; i++) {
            students[i] = new Student();
            students[i].name = scanner.next();
            students[i].number = scanner.next();
            students[i].score = scanner.nextInt();
            if (students[i].score <= minScore) {
                minScore = students[i].score;
                minIndex = i;
            }
            if (students[i].score > maxScore) {
                maxScore = students[i].score;
                maxIndex = i;
            }
        }
        System.out.println(students[maxIndex].name + " " + students[maxIndex].number);
        System.out.println(students[minIndex].name + " " + students[minIndex].number);
    }
}
