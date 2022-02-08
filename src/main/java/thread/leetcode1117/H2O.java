package thread.leetcode1117;

import java.util.concurrent.Semaphore;

/**
 * H2O 生成
 * LeetCode 1117 https://leetcode-cn.com/problems/building-h2o/
 *
 * @author yangyi 2022年02月08日15:39:38
 */
public class H2O {

    private Semaphore semaphoreH,semaphoreO;

    public H2O() {
        semaphoreH = new Semaphore(2);
        semaphoreO = new Semaphore(0);
    }

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        semaphoreH.acquire();
        // releaseHydrogen.run() outputs "H". Do not change or remove this line.
        releaseHydrogen.run();
        semaphoreO.release();
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        semaphoreO.acquire(2);
        // releaseOxygen.run() outputs "O". Do not change or remove this line.
        releaseOxygen.run();
        semaphoreH.release(2);
    }

}
