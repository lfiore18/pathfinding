// Priority queue
// - elements are arranged based on their priority values
// - when adding elements, they're inserted based on their priority
// - items with high priority are inserted near the front, low priority items go at the back


// For djikstra's algorithm, we still have a perimeter that expands
// but we store the cells of the perimeter according to their movement costs:
// - cells that cost more to move to go to the back of the queue
// - cells that cost less to move to go to the front of the queue
// or it's more accurate to say, cells are inserted into the queue according to their movement costs
// and are therefore searched first


// JavaScript code to implement Priority Queue
// using Linked List
// Node
class Node {
 
    // Lower values indicate
    // higher priority
    constructor() {
        this.data = 0;
        this.priority = 0;
        this.next = null;
    }
}
 
var node = new Node();
 
// Function to Create A New Node
function newNode(d, p) {
    var temp = new Node();
    temp.data = d;
    temp.priority = p;
    temp.next = null;
 
    return temp;
}
 
// Return the value at head
function peek(head) {
    return head.data;
}
 
// Removes the element with the
// highest priority from the list
function pop(head) {
    var temp = head;
    head = head.next;
    return head;
}
 
// Function to push according to priority
function push(head, d, p) {
    var start = head;
 
    // Create new Node
    var temp = newNode(d, p);
 
    // Special Case: The head of list
    // has lesser priority than new node.
    // So insert new node before head node
    // and change head node.
    if (head.priority < p) {
 
        // Insert New Node before head
        temp.next = head;
        head = temp;
    }
    else {
 
        // Traverse the list and find a
        // position to insert new node
        while (start.next != null && start.next.priority > p) {
            start = start.next;
        }
 
        // Either at the ends of the list
        // or at required position
        temp.next = start.next;
        start.next = temp;
    }
    return head;
}
 
// Function to check is list is empty
function isEmpty(head) {
    return head == null ? 1 : 0;
}
 
// Driver code
// Create a Priority Queue
// 7.4.5.6
// var pq = newNode(4, 1);
// pq = push(pq, 5, 2);
// pq = push(pq, 6, 3);
// pq = push(pq, 7, 0);
 
// while (isEmpty(pq) == 0) {
//     console.log(peek(pq)," ");
//     pq = pop(pq);
// }