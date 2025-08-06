---
title: java_collections
createTime: 2025/08/06 16:37:27
permalink: /article/o08v0duh/
tags:
- java
- 集合类
- 数据结构

---

### **算法题常用数据结构核心操作汇总 (Java)**

掌握正确的数据结构是高效解决算法问题的关键。不同的数据结构在增、删、改、查等操作上具有不同的时间复杂度，选择合适的结构能让您的代码事半功倍。

---

### **1. 动态数组 (Dynamic Array)**

*   **特点**: 逻辑上和物理上都连续的存储空间，支持快速随机访问。
*   **Java 实现**: `java.util.ArrayList`

| 操作 | `ArrayList<E>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Add)** | `add(E element)` | **O(1)** (均摊) | 在末尾添加。当容量不足时扩容，导致单次操作可能为 O(n)。 |
| | `add(int index, E element)` | O(n) | 在中间插入，需要移动后续所有元素。 |
| **删 (Remove)** | `remove(int index)` | O(n) | 从中间删除，需要移动后续所有元素。 |
| **改 (Update)** | `set(int index, E element)` | **O(1)** | **核心优势**：通过索引直接定位，速度极快。 |
| **查 (Get)** | `get(int index)` | **O(1)** | **核心优势**：同上。 |
| **常用** | `size()` | O(1) | 获取大小。 |

---

### **2. 链表 (Linked List)**

*   **特点**: 物理上不连续，通过节点和指针连接。在**首尾**操作非常快。
*   **Java 实现**: `java.util.LinkedList`

| 操作 | `LinkedList<E>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Add)** | `addFirst(E e)`, `addLast(E e)` | **O(1)** | **核心优势**：在两端添加。 |
| **删 (Remove)** | `removeFirst()`, `removeLast()` | **O(1)** | **核心优势**：在两端删除。 |
| **改 (Update)** | `set(int index, E element)` | O(n) | 速度慢，需要先遍历找到该索引。 |
| **查 (Get)** | `getFirst()`, `getLast()` | **O(1)** | 获取两端元素。 |
| | `get(int index)` | O(n) | 速度慢，需要遍历。 |

> **注意**: `LinkedList` 实现了 `Deque` 接口，因此它常常被用作栈或队列。

---

### **3. 栈 (Stack - LIFO)**

*   **特点**: 后进先出 (Last-In, First-Out)。
*   **Java 实现**: **推荐使用 `java.util.ArrayDeque`**

| 操作 | `ArrayDeque<E>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Push)** | `push(E e)` | O(1) (均摊) | 元素入栈顶。 |
| **删 (Pop)** | `pop()` | O(1) (均摊) | 元素出栈顶。 |
| **查 (Peek)** | `peek()` | O(1) | 查看栈顶元素，不删除。 |
| **常用** | `isEmpty()` | O(1) | 判断是否为空。 |
| **场景** | \- | \- | DFS、括号匹配、表达式求值、单调栈。 |

---

### **4. 队列 (Queue - FIFO)**

*   **特点**: 先进先出 (First-In, First-Out)。
*   **Java 实现**: **推荐使用 `java.util.LinkedList` 或 `java.util.ArrayDeque`**

| 操作 | `Queue<E>` 接口方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Enqueue)** | `offer(E e)` | O(1) (均摊) | 元素入队尾。 |
| **删 (Dequeue)** | `poll()` | O(1) (均摊) | 元素出队头。 |
| **查 (Peek)** | `peek()` | O(1) | 查看队头元素，不删除。 |
| **常用** | `isEmpty()` | O(1) | 判断是否为空。 |
| **场景** | \- | \- | BFS、层序遍历。 |

---

### **5. 优先队列 (Priority Queue / Heap)**

*   **特点**: 每次出队的都是优先级最高的元素。底层由**堆**实现。
*   **Java 实现**: `java.util.PriorityQueue` (默认是**最小堆**)

| 操作 | `PriorityQueue<E>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Add)** | `offer(E e)` | **O(log n)** | 添加元素并维护堆结构。 |
| **删 (Poll)** | `poll()` | **O(log n)** | 移除并返回堆顶元素（最小元）。 |
| **查 (Peek)** | `peek()` | **O(1)** | 查看堆顶元素。 |
| **常用** | `isEmpty()`, `size()` | O(1) | \- |
| **场景** | \- | \- | Dijkstra/Prim 算法、Top K 问题、合并 K 个有序链表。 |

> **Tip**: 创建最大堆: `new PriorityQueue<>(Comparator.reverseOrder());` 或 `new PriorityQueue<>((a, b) -> b - a);`

---

### **6. 哈希集合 (HashSet)**

*   **特点**: 存储不重复的元素，无序。
*   **Java 实现**: `java.util.HashSet`

| 操作 | `HashSet<E>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Add)** | `add(E e)` | O(1) (均摊) | 如果元素已存在则添加失败。 |
| **删 (Remove)** | `remove(Object o)` | O(1) (均摊) | 删除指定元素。 |
| **查 (Query)** | `contains(Object o)` | **O(1)** (均摊) | **核心优势**：极快地判断元素是否存在。 |
| **常用** | `size()` | O(1) | 获取元素数量。 |
| **场景** | \- | \- | 去重、快速查找元素是否存在。 |

---

### **7. 哈希映射 (HashMap)**

*   **特点**: 存储键值对 (`<Key, Value>`)，无序。
*   **Java 实现**: `java.util.HashMap`

| 操作 | `HashMap<K, V>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增/改** | `put(K key, V value)` | O(1) (均摊) | 添加或更新键值对。 |
| **删 (Remove)** | `remove(Object key)` | O(1) (均摊) | 根据键删除。 |
| **查 (Get)** | `get(Object key)` | O(1) (均摊) | 根据键查找值。 |
| **查 (Query)** | `containsKey(Object key)` | O(1) (均摊) | **核心优势**：极快地判断键是否存在。 |
| **常用** | `keySet()`, `values()` | O(1) | 获取键集或值集合。 |
| **场景** | \- | \- | 频次统计、缓存、建立映射关系。 |

---

### **8. 有序树集合/映射 (TreeSet/TreeMap)**

*   **特点**: 基于**平衡二叉搜索树（红黑树）**，元素始终保持有序。
*   **Java 实现**: `java.util.TreeSet`, `java.util.TreeMap`

| 操作 | `TreeMap<K, V>` 方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增/改** | `put(K key, V value)` | **O(log n)** | 添加/修改，并保持有序。 |
| **删** | `remove(Object key)` | **O(log n)** | 删除，并保持有序。 |
| **查** | `get(Object key)` | **O(log n)** | 查找。 |
| **特殊查询** | `firstKey()`, `lastKey()` | O(log n) | 查找最小/最大键。 |
| | `floorKey()`, `ceilingKey()` | O(log n) | 查找小于等于/大于等于某值的键。 |
| **场景** | \- | \- | 需要有序数据、查找最近邻元素、区间问题。 |

---

### **9. 图 (Graph)**

*   **特点**: 由顶点和边构成，是一种**抽象模型**，需手动实现。
*   **Java 实现**: 常用**邻接表** `List<List<Integer>>` 或 `List<List<Edge>>`

| 操作 | 邻接表方法 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Add Edge)** | `graph.get(u).add(v);` | O(1) | 添加一条从 u 到 v 的边。 |
| **删 (Remove Edge)** | `graph.get(u).remove(v);` | O(degree(u)) | 需要遍历 u 的邻居列表。 |
| **查 (Iterate)** | `for (int neighbor : graph.get(u))` | O(degree(u)) | 遍历 u 的所有邻居。 |
| **场景** | \- | \- | 所有图论问题：DFS, BFS, 最短路径, 拓扑排序等。 |

---

### **10. 并查集 (Union-Find)**

*   **特点**: 高效地管理不相交集合的合并与查询。需**手动实现**。
*   **Java 实现**: 通常使用一个 `parent` 数组。

| 操作 | 常用方法名 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **合并** | `union(int i, int j)` | **~O(1)** (均摊) | 合并 i 和 j 所在的集合。 |
| **查找** | `find(int i)` | **~O(1)** (均摊) | 查找 i 所在集合的根。 |
| **查询** | `isConnected(int i, int j)` | **~O(1)** (均摊) | 判断 i 和 j 是否在同一集合。 |
| **场景** | \- | \- | 判断图的连通性、Kruskal 算法求最小生成树、检测环。 |

---

### **11. 字典树 (Trie / Prefix Tree)**

*   **特点**: 高效地存储和检索字符串集合，尤其擅长前缀相关的操作。需**手动实现**。
*   **Java 实现**: 使用嵌套的 `Node` 类。

| 操作 | 常用方法名 | 时间复杂度 | 备注 / 常用场景 |
| :--- | :--- | :--- | :--- |
| **增 (Insert)** | `insert(String word)` | O(L) | 插入一个单词，L 为单词长度。 |
| **查 (Search)** | `search(String word)` | O(L) | 查找一个完整的单词是否存在。 |
| **查 (Prefix)** | `startsWith(String prefix)` | O(L) | 查找是否存在以某前缀开头的单词。 |
| **场景** | \- | \- | 搜索引擎自动补全、拼写检查、IP 路由。 |