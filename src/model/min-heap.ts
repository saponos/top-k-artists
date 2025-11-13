import type { CompareFunction, GetKeyFunction } from "../lib/types.js";

export class MinHeap<T> {
  private readonly heap: T[] = [];
  private readonly indexMap = new Map<string, number>();

  constructor(
    private readonly capacity: number = Number.MAX_SAFE_INTEGER,
    private readonly compare: CompareFunction<T>,
    private readonly getKey: GetKeyFunction<T>,
  ) {}

  get size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  toArray() {
    return [...this.heap];
  }

  push(value: T) {
    if (this.capacity <= 0) return;

    const key = this.getKey(value);
    const existingIndex = this.indexMap.get(key);

    if (existingIndex !== undefined) {
      this.updateExistingEntry(existingIndex, value);
      return;
    }

    if (this.heap.length < this.capacity) {
      this.insertNewEntry(value, key);
      return;
    }

    this.replaceRootIfBetter(value, key);
  }

  private updateExistingEntry(index: number, value: T) {
    this.heap[index] = value;
    this.siftDown(index);
    this.siftUp(index);
  }

  private insertNewEntry(value: T, key: string) {
    this.heap.push(value);
    this.indexMap.set(key, this.heap.length - 1);
    this.siftUp(this.heap.length - 1);
  }

  private replaceRootIfBetter(value: T, key: string) {
    const root = this.heap[0];
    if (root === undefined || this.compare(value, root) <= 0) {
      return;
    }

    this.indexMap.delete(this.getKey(root));
    this.heap[0] = value;
    this.indexMap.set(key, 0);
    this.siftDown(0);
  }

  private siftUp(index: number) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parent]) >= 0) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private siftDown(index: number) {
    const lastIndex = this.heap.length - 1;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;

      if (left <= lastIndex && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right <= lastIndex && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === index) break;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    this.indexMap.set(this.getKey(this.heap[i]), i);
    this.indexMap.set(this.getKey(this.heap[j]), j);
  }
}
