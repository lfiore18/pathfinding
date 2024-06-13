class PriorityQueue {
    constructor() {
        this.items = [];
    }

    // Method to add an element to the queue
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        // Iterate through the items and add the new element in the correct position
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > queueElement.priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        // If the element has the lowest priority, add it at the end
        if (!added) {
            this.items.push(queueElement);
        }
    }

    // Method to remove and return the element with the highest priority (lowest cost)
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().element;
    }

    // Method to get the element with the highest priority (lowest cost) without removing it
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0].element;
    }

    // Method to check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Method to clear the queue
    clear() {
        this.items = [];
    }
}

// Example usage
const pq = new PriorityQueue();

// Adding elements with priorities (costs)
pq.enqueue({ y: 2, x: 3 }, 1);
pq.enqueue({ y: 11, x: 2 }, 1);
pq.enqueue({ y: 5, x: 6 }, 2);

console.log(pq.front());

// Getting and removing the element with the highest priority (lowest cost)
console.log(pq.dequeue()); // { y: 11, x: 2 }
console.log(pq.dequeue()); // { y: 2, x: 3 }
console.log(pq.dequeue()); // { y: 5, x: 6 }
