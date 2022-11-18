import { defaultEquals, IEqualsFunction } from "../utils/utils.ts";

export class Node<T> {
  constructor(public element: T, public next?: Node<T>) {}
}

export class LinkedList<T> {
  protected count = 0;
  protected head?: Node<T>;

  constructor(protected equalsFn: IEqualsFunction<T> = defaultEquals) {}

  push(element: T) {
    const node = new Node(element);
    let current;

    if (this.head == null) {
      this.head = node;
    } else {
      current = this.getNodeAt(this.size() - 1);
      current!.next = node;
    }

    this.count++;
  }

  getNodeAt(index: number): Node<T> | undefined {
    if (index >= 0 && index <= this.count) {
      let node = this.head;
      for (let i = 0; i < index && node != null; i++) {
        node = node.next;
      }
      return node;
    }
    return undefined;
  }

  getElementAt(index: number): T | undefined {
    return this.getNodeAt(index)?.element;
  }

  insert(element: T, index: number): boolean {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);

      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getNodeAt(index - 1);
        node.next = previous!.next;
        previous!.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index: number): T | undefined {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        this.head = current!.next;
      } else {
        const previous = this.getNodeAt(index - 1);
        current = previous!.next;
        previous!.next = current!.next;
      }
      this.count--;
      return current!.element;
    }
    return undefined;
  }

  remove(element: T): T | undefined {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  indexOf(element: T): number {
    let current = this.head;

    for (let i = 0; i < this.size() && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }

    return -1;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  size(): number {
    return this.count;
  }

  getHead(): Node<T> | undefined {
    return this.head;
  }

  clear() {
    this.head = undefined;
    this.count = 0;
  }

  toString(): string {
    if (this.head == null) {
      return "";
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
}
