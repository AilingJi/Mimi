console.log('index.js')

function maxDepth(root) {
    if (!root || !root.children) return 0
    let maxSubtreeDepth = 0
    for (let i = 0; i < root.children.length; i++) {
        const child = root.children[i]
        maxSubtreeDepth = Math.max(maxSubtreeDepth, maxDepth(child))
    }
    return maxSubtreeDepth + 1
}

const root = document.getElementById("root")
console.dir(root)
console.log(maxDepth(root))