import { LinkedList, Node } from "./link.ts";
import { defaultEquals, IEqualsFunction } from "../utils/utils.ts";

export class DoublyNode<T> extends Node<T> {
  constructor(
    public element: T,
    public next?: DoublyNode<T>,
    public prev?: DoublyNode<T>,
  ) {
    super(element, next);
  }
}

export default class DoublyLinkedList<T> extends LinkedList<T> {
  declare protected head?: DoublyNode<T>;
  protected tail?: DoublyNode<T>;

  constructor(protected equalsFn: IEqualsFunction<T> = defaultEquals) {
    super(equalsFn);
  }

  push(element: T) {
    const node = new DoublyNode(element);

    if (this.head == null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.count++;
  }

  getHead(): DoublyNode<T> | undefined {
    return this.head;
  }

  insert(element: T, index: number): boolean {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode(element);
      let current = this.head;

      if (index === 0) {
        if (this.head == null) {
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          this.head.prev = node;
          this.head = node;
        }
      } else if (index === this.count) {
        current = this.tail;
        current!.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        const previous = this.getNodeAt(index - 1);
        current = previous!.next;
        node.next = current;
        previous!.next = node;

        current!.prev = node;
        node.prev = previous;
      }
      this.count++;
      return true;
    }
    return false;
  }

  find(
    x: DoublyNode<T>,
    y: DoublyNode<T>,
  ): [DoublyNode<T> | null, DoublyNode<T> | null] {
    let N1 = null;
    let N2 = null;
    let temp = this.getHead()!;

    // Traversing the list
    while (temp !== undefined) {
      if (temp.prev === x.prev && temp.next === x.next) {
        N1 = temp;
      } else if (temp.prev === y.prev && temp.next === y.next) {
        N2 = temp;
      }
      temp = temp.next!;
    }

    return [N1, N2];
  }

  // move a "e" to "at"
  move(e: DoublyNode<T>, at: DoublyNode<T>) {
    if (this.head == null || this.head.next == null || e == at) {
      return;
    }

    // Finding the Nodes
    const p = this.find(e, at);
    const Node1 = p[0]!;
    const Node2 = p[1]!;

    if (Node1 == this.head) {
      this.head = Node2;
    } else if (Node2 == this.head) {
      this.head = Node1;
    }
    if (Node1 == this.tail) {
      this.tail = Node2;
    } else if (Node2 == this.tail) {
      this.tail = Node1;
    }

    // Swapping Node1 and Node2
    let temp = null;
    temp = Node1.next;
    Node1.next = Node2.next;
    Node2.next = temp;

    if (Node1.next != null) {
      Node1.next.prev = Node1;
    }
    if (Node2.next != null) {
      Node2.next.prev = Node2;
    }

    temp = Node1.prev;
    Node1.prev = Node2.prev;
    Node2.prev = temp;

    if (Node1.prev != null) {
      Node1.prev.next = Node1;
    }
    if (Node2.prev != null) {
      Node2.prev.next = Node2;
    }
  }

  private findElement(element: T): DoublyNode<T> | undefined {
    let current = this.head;

    for (let i = 0; i < this.size() && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return current;
      }
      current = current.next;
    }

    return undefined;
  }

  MoveFront(val: T) {
    const e = this.findElement(val);
    if (this.size() == 0 || e == this.getHead()) {
      return;
    }
    this.move(e!, this.getHead()!);
  }

  removeAt(index: number): T | undefined {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        this.head = this.head!.next;
        if (this.count === 1) {
          this.tail = undefined;
        } else {
          this.head!.prev = undefined;
        }
      } else if (index === this.count - 1) {
        current = this.tail;
        this.tail = current!.prev;
        this.tail!.next = undefined;
      } else {
        current = this.getNodeAt(index);
        const previous = current!.prev;
        const next = current!.next;
        previous!.next = next;
        next!.prev = previous;
      }
      this.count--;
      return current!.element;
    }
    return undefined;
  }

  getTail(): DoublyNode<T> | undefined {
    return this.tail;
  }

  clear() {
    super.clear();
    this.tail = undefined;
  }

  inverseToString(): string {
    if (this.tail == null) {
      return "";
    }
    let objString = `${this.tail.element}`;
    let previous = this.tail.prev;
    while (previous != null) {
      objString = `${objString},${previous.element}`;
      previous = previous.prev;
    }
    return objString;
  }
}
