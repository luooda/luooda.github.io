---
title: 享元模式
createTime: 2025/06/20 03:28:26
permalink: /article/56cg85ba/
tags:
- 设计模式
- 结构型模式
---
### 1. 一句话概括
享元模式是一种结构型设计模式，它旨在**通过共享尽可能多的相似对象来最小化内存使用或计算开销**，通常用于处理大量细粒度的对象。

---

### 2. 生活中的比喻：咖啡店的菜单

想象一下你在一家繁忙的咖啡店点单。
*   有成百上千的顾客，每个人都可能点“拿铁”、“美式”或“卡布奇诺”。
*   如果咖啡店为**每一位**点“拿铁”的顾客都创建一个全新的、独立的“拿铁”对象（包含配方、价格、名称等所有信息），那将是巨大的浪费。因为所有“拿铁”的配方和价格都是一样的。

**享元模式的做法**：
咖啡店内部只创建**一个**“拿铁”对象、**一个**“美式”对象和**一个**“卡布奇诺”对象。这些就是**享元（Flyweight）**。
*   当顾客A点一杯拿铁时，咖啡店把共享的“拿铁”对象给他。
*   当顾客B也点一杯拿铁时，咖啡店把**同一个**共享的“拿铁”对象也给他。

那么，如何区分这两杯拿铁呢？比如顾客A要大杯，顾客B要加糖。这些**个性化的信息**（大杯、加糖）不存储在共享的“拿铁”对象里，而是作为**外部状态（Extrinsic State）**在需要时传递给它。

*   **共享的部分（内在状态）**：咖啡种类（拿铁）、配方、基础价格。
*   **不共享的部分（外在状态）**：杯型、桌号、是否加糖、顾客姓名。

通过这种方式，无论有多少顾客，系统中关于咖啡种类的核心对象始终只有几个，极大地节省了内存。

---

### 3. 核心思想：内在状态与外在状态的分离

这是理解享元模式的**关键**。

*   **内在状态（Intrinsic State）**：
    *   存储在享元对象内部。
    *   是对象可以共享的、不随上下文变化的信息。
    *   例如：字符'A'的字形，棋子的颜色和类型（黑色的“车”）。
    *   内在状态使得享元对象可以被复用。

*   **外在状态（Extrinsic State）**：
    *   由客户端计算或存储。
    *   是随上下文变化的信息，不能被共享。
    *   在需要时由客户端传递给享元对象的方法。
    *   例如：字符'A'在文档中的位置（行、列），棋子在棋盘上的位置（x, y）。

享元模式的本质就是：**将对象的属性划分为内在状态和外在状态，然后将内在状态相同的对象进行共享。**

![Flyweight Pattern UML](https://refactoring.guru/images/patterns/diagrams/flyweight/structure.png)

---

### 4. 享元模式的结构与参与者

1.  **Flyweight (享元接口)**
    *   定义了一个接口，具体享元对象通过这个接口接收并作用于外在状态。
    *   通常包含一个 `operation(extrinsicState)` 方法。

2.  **ConcreteFlyweight (具体享元)**
    *   实现了 `Flyweight` 接口。
    *   为内在状态增加存储空间。
    *   `ConcreteFlyweight` 的对象必须是可共享的。它所存储的状态必须是内在的。

3.  **UnsharedConcreteFlyweight (非共享具体享元)** - (可选)
    *   并非所有 `Flyweight` 子类都需要被共享。如果一个对象的状态无法完全分离出内在状态，就可以设计为非共享的。但这种情况比较少见。

4.  **FlyweightFactory (享元工厂)**
    *   负责创建和管理享元对象。
    *   它维护一个“池”（通常是 `HashMap`），用于存储已经创建的享元对象。
    *   当客户端请求一个享元对象时，工厂会检查池中是否已存在，如果存在则返回，否则就创建一个新的，存入池中再返回。
    *   这保证了所有具有相同内在状态的对象只存在一个实例。

5.  **Client (客户端)**
    *   持有对享元对象的引用。
    *   计算或存储外在状态，并在需要时将其传递给享元对象。

---

### 5. Java 代码示例（绘制棋子）

假设我们要在棋盘上绘制很多棋子。棋子的类型（车、马、炮）和颜色是固定的（内在状态），但它们在棋盘上的位置是变化的（外在状态）。

#### 步骤1: 创建享元接口 (Flyweight)

```java
// 坐标类，用于表示外在状态
class Position {
    int x, y;
    public Position(int x, int y) { this.x = x; this.y = y; }
}

// Flyweight: 棋子接口
public interface ChessPiece {
    // operation() 方法，接收外在状态
    void display(Position position);
}
```

#### 步骤2: 创建具体享元类 (ConcreteFlyweight)

```java
// ConcreteFlyweight: 具体的棋子实现
public class ConcreteChessPiece implements ChessPiece {
    // 内在状态：颜色和类型
    private final String color;
    private final String type;

    public ConcreteChessPiece(String color, String type) {
        this.color = color;
        this.type = type;
        System.out.println("创建了一个棋子: " + color + " " + type);
    }

    @Override
    public void display(Position position) {
        System.out.println("在 (" + position.x + ", " + position.y + ") 位置显示一个 " + color + " 的 " + type);
    }
}
```

#### 步骤3: 创建享元工厂 (FlyweightFactory)

```java
import java.util.HashMap;
import java.util.Map;

// FlyweightFactory: 棋子工厂
public class ChessPieceFactory {
    private static final Map<String, ChessPiece> piecePool = new HashMap<>();

    public static ChessPiece getPiece(String color, String type) {
        String key = color + "_" + type;
        
        // 如果池中没有，则创建并放入池中
        if (!piecePool.containsKey(key)) {
            piecePool.put(key, new ConcreteChessPiece(color, type));
        }
        
        // 从池中返回对象
        return piecePool.get(key);
    }
    
    public static int getPoolSize() {
        return piecePool.size();
    }
}
```

#### 步骤4: 客户端调用

```java
public class FlyweightPatternDemo {
    public static void main(String[] args) {
        // 获取黑色的“车”
        ChessPiece blackRook1 = ChessPieceFactory.getPiece("黑色", "车");
        blackRook1.display(new Position(0, 0));

        // 再次获取黑色的“车”
        ChessPiece blackRook2 = ChessPieceFactory.getPiece("黑色", "车");
        blackRook2.display(new Position(0, 1));
        
        // 获取白色的“马”
        ChessPiece whiteKnight = ChessPieceFactory.getPiece("白色", "马");
        whiteKnight.display(new Position(1, 2));

        // 验证对象是否被共享
        System.out.println("\nblackRook1 和 blackRook2 是同一个对象吗? " + (blackRook1 == blackRook2));
        
        // 查看池的大小
        System.out.println("享元池中的对象数量: " + ChessPieceFactory.getPoolSize());
    }
}
```

**输出结果**:
```
创建了一个棋子: 黑色 车
在 (0, 0) 位置显示一个 黑色 的 车
在 (0, 1) 位置显示一个 黑色 的 车
创建了一个棋子: 白色 马
在 (1, 2) 位置显示一个 白色 的 马

blackRook1 和 blackRook2 是同一个对象吗? true
享元池中的对象数量: 2
```
从结果可以看出：
1.  我们请求了两次“黑色的车”，但构造函数只被调用了一次，说明对象被复用了。
2.  `blackRook1 == blackRook2` 的结果为 `true`，证明它们是同一个实例。
3.  尽管我们逻辑上创建了3个棋子，但享元池中实际只存储了2个对象。

---

### 6. 优缺点

#### 优点
1.  **极大地减少了内存中对象的数量**：这是享元模式最核心的优点，特别是在需要创建大量相似对象的场景下。
2.  **提高了性能**：减少了内存占用，从而降低了垃圾回收的压力。同时，如果对象创建过程很耗时，共享对象也能节省时间。

#### 缺点
1.  **增加了系统的复杂性**：需要将对象的状态分解为内在和外在两部分，这使得代码逻辑更复杂，可读性变差。
2.  **需要分离状态**：客户端需要自己维护外在状态，这可能会导致客户端代码变得复杂。
3.  **线程安全问题**：享元对象是共享的，如果它们有需要修改的状态（尽管不推荐），就必须考虑线程安全问题。

---

### 7. 适用场景

1.  一个应用程序使用了**大量**的对象。
2.  创建大量对象导致了**高昂的内存开销**，且内存已成为瓶颈。
3.  对象的大部分状态都可以被**外部化**（即变为外在状态）。
4.  移除外在状态后，可以用**相对较少的共享对象**取代大量的非共享对象。
5.  应用程序不依赖于对象的身份（即 `object1 == object2` 是 `true` 还是 `false` 无所谓）。

**经典案例**：
*   **Java 的 `String` 池**：`String s1 = "abc"; String s2 = "abc";` 此时 `s1 == s2` 为 `true`，因为它们共享了同一个字符串对象。
*   **Java 的包装类**：`Integer.valueOf(100)` 会从缓存中获取 `Integer` 对象，对于-128到127之间的值，返回的都是同一个对象。
*   **文本编辑器**：文档中的每个字符都可以是享元对象。
*   **图形应用**：游戏中的粒子效果、森林里成千上万棵树等。