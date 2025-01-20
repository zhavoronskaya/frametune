class AudioPool {
  private index = 0;
  private pool: HTMLAudioElement[] = [];

  constructor(private src: string, private count: number) {
    for (let i = 0; i < this.count; i++) {
      const audio = new Audio(this.src || undefined);
      this.pool.push(audio);
    }
  }

  play() {
    if (!this.src) return;

    const audio = this.pool[this.index++];
    this.index = this.index < this.pool.length ? this.index : 0;
    audio.play().catch((err) => console.warn("Failed to play"));
  }

  setSrc(src: string) {
    this.src = src;
    this.pool.forEach((a) => (a.src = src));
  }

  get duration() {
    return this.pool[0]?.duration || 0;
  }
}

export default AudioPool;
