package thread.leetcode1115;

/**
 * 交替打印FooBar
 * LeetCode 1115 https://leetcode-cn.com/problems/print-foobar-alternately/
 *
 * @author yangyi 2021年05月03日17:51:31
 */
public class FooBar {

    private int n;
    private final Object lock = new Object();

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        synchronized (lock){
            for (int i = 0; i < n; i++) {
                lock.wait();
                // printFoo.run() outputs "foo". Do not change or remove this line.
                printFoo.run();
                lock.notifyAll();
            }
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        synchronized (lock){
            for (int i = 0; i < n; i++) {
                lock.notifyAll();
                lock.wait();
                // printBar.run() outputs "bar". Do not change or remove this line.
                printBar.run();
            }
        }
    }

    public static void main(String[] args) {
        FooBar fooBar = new FooBar(100);
        new Thread(() -> {
            try {
                fooBar.foo(() -> System.out.println("foo"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                fooBar.bar(() -> System.out.println("bar"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
