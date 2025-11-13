export class MinHeap<T> {
  private heap: T[] = [];
  private minValueIndex: number = 0;

  constructor(private minHeapSize: number, private compare: (a: T, b: T) => number) {}

  get size() { return this.heap.length; }

  private updateHeap(value: T) {
    
    if (this.compare(value, this.heap[this.minValueIndex]) < 0) {
      this.heap.unshift(value);
      this.minValueIndex = 0;
    } else {
      this.heap.push(value);
      this.minValueIndex = this.size - 1;
    }
  }
  
  push(value: T) {
    if (this.size < this.minHeapSize) {
      this.heap.push(value);

      //find index of the smallest value by compare function
      this.minValueIndex = this.heap.findIndex((v) => this.compare(v, value) < 0);
      return;
    }

    //replace the smallest value with the new value and update the minValueIndex
    this.heap[this.minValueIndex] = value;
    this.minValueIndex = this.heap.findIndex((v) => this.compare(v, value) < 0);
    return;
  }

  peek() {
    return this.heap[0];
  }

  toArray() {
    return [...this.heap];
  }

  toObjectArray() {
    return this.heap.map((value) => ({ value }));
  }
}