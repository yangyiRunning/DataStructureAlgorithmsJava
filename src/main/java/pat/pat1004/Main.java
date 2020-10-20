package pat.pat1004;

import java.util.Scanner;

/**
 * 1004 成绩排名 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805321640296448
 *
 * @author yangyi
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
