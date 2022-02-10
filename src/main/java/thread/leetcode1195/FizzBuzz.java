package thread.leetcode1195;

import java.util.concurrent.Semaphore;
import java.util.function.IntConsumer;

/**
 * 交替打印字符串
 * LeetCode https://leetcode-cn.com/problems/fizz-buzz-multithreaded/
 *
 * @author yangyi 2022年02月08日16:02:25
 */
public class FizzBuzz {

    private int n;
    private Semaphore semaphoreFizz, semaphoreBuzz, semaphoreFB;
    private Semaphore semaphoreNumber;

    public FizzBuzz(int n) {
        this.n = n;
        semaphoreFizz = new Semaphore(0);
        semaphoreBuzz = new Semaphore(0);
        semaphoreFB = new Semaphore(0);
        semaphoreNumber = new Semaphore(1);
    }

    // printFizz.run() outputs "fizz".
    public void fizz(Runnable printFizz) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 != 0) {
                semaphoreFizz.acquire();
                printFizz.run();
                semaphoreNumber.release();
            }
        }
    }

    // printBuzz.run() outputs "buzz".
    public void buzz(Runnable printBuzz) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            if (i % 5 == 0 && i % 3 != 0) {
                semaphoreBuzz.acquire();
                printBuzz.run();
                semaphoreNumber.release();
            }
        }
    }

    // printFizzBuzz.run() outputs "fizzbuzz".
    public void fizzbuzz(Runnable printFizzBuzz) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                semaphoreFB.acquire();
                printFizzBuzz.run();
                semaphoreNumber.release();
            }
        }
    }

    // printNumber.accept(x) outputs "x", where x is an integer.
    public void number(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            semaphoreNumber.acquire();
            if (i % 3 == 0 && i % 5 != 0) {
                semaphoreFizz.release();
            } else if (i % 5 == 0 && i % 3 != 0) {
                semaphoreBuzz.release();
            } else if (i % 3 == 0 && i % 5 == 0) {
                semaphoreFB.release();
            } else {
                printNumber.accept(i);
                semaphoreNumber.release();
            }
        }
    }

    public static void main(String[] args) {
        FizzBuzz fizzBuzz = new FizzBuzz(15);
        Runnable printFizz = () -> System.out.println("fizz");
        Runnable printBuzz = () -> System.out.println("buzz");
        Runnable printFB = () -> System.out.println("fizzbuzz");
        //线程A
        new Thread(() -> {
            try {
                fizzBuzz.fizz(printFizz);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        //线程B
        new Thread(() -> {
            try {
                fizzBuzz.buzz(printBuzz);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        //线程C
        new Thread(() -> {
            try {
                fizzBuzz.fizzbuzz(printFB);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        //线程D
        new Thread(() -> {
            try {
                fizzBuzz.number(System.out::println);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
