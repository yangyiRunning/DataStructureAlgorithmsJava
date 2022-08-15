package thread.leetcode1114;

import java.util.concurrent.Semaphore;

/**
 * 按序打印
 * LeetCode 1114 https://leetcode-cn.com/problems/print-in-order/
 *
 * @author yangyi 2022年08月11日15:52:55
 */
public class Foo2 {

    private Semaphore firstFinish = new Semaphore(0);
    private Semaphore secondFinish = new Semaphore(0);

    public Foo2() {

    }

    public void first(Runnable printFirst) throws InterruptedException {
        printFirst.run();
        firstFinish.release();
    }

    public void second(Runnable printSecond) throws InterruptedException {
        firstFinish.acquire();
        printSecond.run();
        secondFinish.release();
    }

    public void third(Runnable printThird) throws InterruptedException {
        secondFinish.acquire();
        printThird.run();
    }

    public static void main(String[] args) throws InterruptedException {
        Foo2 foo2 = new Foo2();
        Runnable printFirst = () -> System.out.println("first");
        Runnable printSecond = () -> System.out.println("second");
        Runnable printThird = () -> System.out.println("third");
        new Thread(() -> {
            try {
                foo2.third(printThird);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                foo2.first(printFirst);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                foo2.second(printSecond);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
