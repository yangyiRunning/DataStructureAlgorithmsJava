package thread.leetcode1117;

import java.util.concurrent.Semaphore;

/**
 * H2O 生成
 * LeetCode 1117 https://leetcode-cn.com/problems/building-h2o/
 *
 * @author yangyi 2022年08月11日17:49:01
 */
public class H2O {

    private Semaphore h = new Semaphore(2);
    private Semaphore o = new Semaphore(0);

    public H2O() {

    }

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        h.acquire();
        // releaseHydrogen.run() outputs "H". Do not change or remove this line.
        releaseHydrogen.run();
        o.release();
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        o.acquire(2);
        // releaseOxygen.run() outputs "O". Do not change or remove this line.
        releaseOxygen.run();
        h.release(2);
    }

    public static void main(String[] args) {
        Runnable h = () -> System.out.println("h");
        Runnable o = () -> System.out.println("o");
        int n = 3;
        H2O h2O = new H2O();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    for (int i = 0; i < n * 2; i++) {
                        h2O.hydrogen(h);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    for (int i = 0; i < n; i++) {
                        h2O.oxygen(o);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

}
