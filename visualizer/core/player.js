/**
 * 回放器：只管"走到第几步"，不认识任何具体算法，也不碰 DOM。
 *
 * 为什么用一次性 setTimeout 递归而不是 setInterval：
 *   1. 调速要立刻生效。setInterval 的周期在创建时就定了，改速度得先 clear 再重建，
 *      稍微写漏一次就会出现两个定时器同时推进、步骤跳着走的问题。
 *   2. 单步执行本身可能比一个间隔慢（大图重绘），setInterval 会把积压的回调
 *      一次性排进来，视觉上是"卡一下然后连跳好几步"。
 * 递归 setTimeout 每次只安排下一步，天然不会积压。
 */
export class Player {
  #steps = [];
  #index = 0;
  #speed = 8;
  #timer = null;
  #onChange;

  /**
   * @param {(state: {step: object|null, index: number, total: number, playing: boolean}) => void} onChange
   */
  constructor({ onChange }) {
    this.#onChange = onChange;
  }

  get steps() { return this.#steps; }
  get index() { return this.#index; }
  get total() { return this.#steps.length; }
  get playing() { return this.#timer !== null; }
  get speed() { return this.#speed; }

  /** 载入一段新轨迹，停在第一步（不自动播，交给调用方决定） */
  load(steps) {
    this.pause();
    this.#steps = Array.isArray(steps) ? steps : [];
    this.#index = 0;
    this.#emit();
  }

  goto(index) {
    if (!this.#steps.length) {
      this.#index = 0;
      this.#emit();
      return;
    }
    const clamped = Math.max(0, Math.min(index, this.#steps.length - 1));
    if (clamped === this.#index) {
      // 拖到同一个位置也要重绘一次：进度条被拖动时偶尔会和内部状态错开半格
      this.#emit();
      return;
    }
    this.#index = clamped;
    this.#emit();
  }

  next() { this.goto(this.#index + 1); }
  prev() { this.goto(this.#index - 1); }
  first() { this.goto(0); }
  last() { this.goto(this.#steps.length - 1); }

  play() {
    if (this.#timer !== null) return;
    if (!this.#steps.length) return;
    // 已经在末尾，再点播放就从头开始，避免"点了没反应"
    if (this.#index >= this.#steps.length - 1) this.#index = 0;
    this.#tick();
  }

  pause() {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    this.#emit();
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  setSpeed(v) {
    this.#speed = Math.max(0.5, Math.min(30, Number(v) || 1));
    // 播放中调速：下一拍的延迟由 #tick 重新计算，这里不用管
    if (this.playing) this.#emit();
  }

  #tick = () => {
    this.#timer = null;
    this.#emit();
    if (this.#index >= this.#steps.length - 1) {
      this.pause();
      return;
    }
    this.#timer = setTimeout(() => {
      this.#index += 1;
      this.#tick();
    }, 1000 / this.#speed);
  };

  #emit() {
    this.#onChange({
      step: this.#steps[this.#index] ?? null,
      index: this.#index,
      total: this.#steps.length,
      playing: this.#timer !== null,
    });
  }
}
