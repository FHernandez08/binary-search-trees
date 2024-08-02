const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array, 0, array.length - 1);
        prettyPrint(this.root);
    }

    buildTree(array, start, end) {
        // base case
        if (start > end) return null;

        // recursive case
        let mid = parseInt((start + end) / 2);
        let root = new Node(array[mid]);

        root.left = this.buildTree(array, start, mid - 1);
        root.right = this.buildTree(array, mid, end);

        return root;
    }

    insert(value, root = null) {
        // base case
        if (root == null) {
            return (root = new Node(value));
        }

        // recursive case
        if (root.data < value) {
            root.right = this.insert(value, root.right);
        }
        else {
            root.left = this.insert(value, root.left);
        }

        return root;
    }

    deleteItem(value, root = null) {
        // base case
        if (root == null) {
            return root;
        }
        
        // recursive case
        if (root.data > value) {
            root.left = this.deleteItem(value, root.left);
        }
        else if (root.data < value) {
            root.right = this.deleteItem(value, root.right);
        }
        else {
            if (root.left == null) {
                return root.right;
            }
            else if (root.right == null) {
                return root.left;
            }

            root.data = minValue(root);
            root.right = this.deleteItem(root.right, root.data);
        }

        return root;
    }

    minValue(root) {
        let min = root.data;
        while (root) {
            min = root.data;
            root = root.left;
        }
        return min;
    }

    find(value, root = this.root) {
        // base cases
        if (root == null) return false;

        if (root == value) return root;

        // recursive case
        if (root.data > value) {
            root.left = this.find(value, root.left);
        }
        else if (root.data < value) {
            root.right = this.find(value, root.right);
        }

        return root;
    }

    levelOrder(root = this.root) {
        const queue = [];
        const result = [];

        if (root == null) return;

        queue.push(root);

        while (queue.length > 0) {
            let current = queue.shift(root);
            result.push(current.data);

            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.left);
        }

        return result;
    }

    inOrder(callback) {
        const result = [];

        const inOrderRecursive = (node) => {
            // if NO node exists
            if (node == null) {
                return;
            }

            inOrderRecursive(node.left);

            if (callback) {
                callback(node);
            }
            else {
                result.push(node.data);
            }

            inOrderRecursive(node.right);
        }

        inOrderRecursive(this.root);
        if (!callback) {
            return result;
        }
    }

    preOrder(callback) {
        const result = [];

        const preOrderRecursive = (node) => {
            if (node == null) {
                return;
            }

            if (callback) {
                callback(node);
            }
            else {
                result.push(node.data);
            }

            preOrderRecursive(node.left);
            preOrderRecursive(node.right);
        }

        preOrderRecursive(this.root);
        
        if (!callback) {
            return result;
        }
    }

    postOrder(callback) {
        const result = [];

        const postOrderRecursive = (node) => {
            if (node == null) {
                return;
            }

            postOrderRecursive(node.left);
            postOrderRecursive(node.right);

            if (callback) {
                callback(node);
            }
            else {
                result.push(node.data);
            }
        }

        postOrderRecursive(this.root);
        
        if (!callback) {
            return result;
        }
    }

    height(node) {
        if (node === null) {
            return -1;
        }

        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(node) {
        const depthRecursively = (currentNode, currentDepth) => {
            if (currentNode === null) {
                return -1;
            }

            if (currentNode === this.root) {
                return currentDepth;
            }

            return depthRecursively(currentNode.parent, currentDepth + 1);
        }

        return depthRecursively(node, 0);
    }

    isBalanced() {
        const checkBalanced = (node) => {
            if (node === null) {
                return true;
            }

            const leftHeight = this.height(node.left);
            const rightHeight = this.height(node.right);

            if (
                Math.abs(leftHeight - rightHeight) <= 1 &&
                checkBalanced(node.left) &&
                checkBalanced(node.right)
            ) {
                return true;
            }
            return false;
        };

        return checkBalanced(this.root);
    }

    rebalance() {
        const nodeArray = this.inOrder();
        this.root = this.buildTree(nodeArray);
    }
}

// Driver script
const arrayLength = 15; // Length of the random numbers array
const randomNumbers = generateRandomNumbersArray(arrayLength);

// Create a binary search tree from the array of random numbers
const tree = new Tree(randomNumbers);

// Confirm that the tree is balanced
console.log("Is the tree balanced?", tree.isBalanced());

// Print out all elements in level, pre, post, and in order
console.log("--- Tree Traversal Before Unbalancing ---");
console.log("Level Order:");
tree.levelOrder(console.log);
console.log("Pre Order:");
tree.preOrder(console.log);
console.log("Post Order:");
tree.postOrder(console.log);
console.log("In Order:");
tree.inOrder(console.log);

// Unbalance the tree by adding several numbers > 100
const unbalancedNumbers = [101, 102, 103];
unbalancedNumbers.forEach((num) => tree.insert(num));

// Confirm that the tree is unbalanced
console.log("Is the tree unbalanced?", !tree.isBalanced());

// Balance the tree by calling rebalance
tree.rebalanced();

// Confirm that the tree is balanced after rebalancing
console.log("Is the tree balanced after rebalancing?", tree.isBalanced());

// Print out all elements in level, pre, post, and in order after rebalancing
console.log("--- Tree Traversal After Rebalancing ---");
console.log("Level Order:");
tree.levelOrder(console.log);
console.log("Pre Order:");
tree.preOrder(console.log);
console.log("Post Order:");
tree.postOrder(console.log);
console.log("In Order:");
tree.inOrder(console.log);