package thread.leetcode1116;

import java.util.concurrent.Semaphore;
import java.util.function.IntConsumer;

/**
 * 打印零与奇偶数
 * LeetCode 1116 https://leetcode-cn.com/problems/print-zero-even-odd/
 *
 * @author yangyi 2022年02月08日10:47:55
 */
public class ZeroEvenOdd {

    private int n;
    private Semaphore semaphore0, semaphoreOdd, semaphoreEven;

    public ZeroEvenOdd(int n) {
        this.n = n;
        semaphore0 = new Semaphore(1);
        semaphoreOdd = new Semaphore(0);
        semaphoreEven = new Semaphore(0);
    }

    /**
     * 输出0
     */
    // printNumber.accept(x) outputs "x", where x is an integer.
    public void zero(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            semaphore0.acquire();
            printNumber.accept(0);
            if (i % 2 == 0) {
                semaphoreEven.release();
            } else {
                semaphoreOdd.release();
            }
        }
    }

    /**
     * 输出偶数
     */
    public void even(IntConsumer printNumber) throws InterruptedException {
        for (int i = 2; i <= n; i += 2) {
            semaphoreEven.acquire();
            printNumber.accept(i);
            semaphore0.release();
        }
    }

    /**
     * 输出奇数
     */
    public void odd(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i += 2) {
            semaphoreOdd.acquire();
            printNumber.accept(i);
            semaphore0.release();
        }
    }

    public static void main(String[] args) {
        ZeroEvenOdd zeroEvenOdd = new ZeroEvenOdd(5);
        //线程A输出0
        new Thread(() -> {
            try {
                zeroEvenOdd.zero(System.out::print);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        //线程B输出偶数
        new Thread(() -> {
            try {
                zeroEvenOdd.odd(System.out::print);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        //线程C只输出奇数
        new Thread(() -> {
            try {
                zeroEvenOdd.even(System.out::print);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
