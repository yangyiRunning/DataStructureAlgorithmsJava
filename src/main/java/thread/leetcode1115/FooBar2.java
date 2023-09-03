package thread.leetcode1115;

import java.util.concurrent.Semaphore;

/**
 * 交替打印FooBar
 * LeetCode 1115 https://leetcode-cn.com/problems/print-foobar-alternately/
 *
 * @author yangyi 2022年08月11日16:05:19
 */
public class FooBar2 {

    private int n;
    private Semaphore foo = new Semaphore(0);
    private Semaphore bar = new Semaphore(0);

    public FooBar2(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            foo.acquire();
            // printFoo.run() outputs "foo". Do not change or remove this line.
            printFoo.run();
            bar.release();
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            foo.release();
            bar.acquire();
            // printBar.run() outputs "bar". Do not change or remove this line.
            printBar.run();
        }
    }

    public static void main(String[] args) {
        FooBar2 fooBar2 = new FooBar2(100);
        new Thread(() -> {
            try {
                fooBar2.foo(() -> System.out.println("foo"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                fooBar2.bar(() -> System.out.println("bar"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
