---
title: 桥接模式
createTime: 2025/06/20 03:20:50
permalink: /article/mgausvdp/
tags:
- 设计模式
- 结构型模式
---

### 1. 一句话概括
桥接模式是一种结构型设计模式，它旨在**将抽象部分与它的实现部分分离，使它们都可以独立地变化**。

### 2. 生活中的比喻：遥控器与电视机
想象一下你家里的遥控器和电视机。

*   **遥控器（抽象部分）**：它定义了一系列操作，比如“开/关”、“换台”、“调音量”。这些是高层级的抽象功能。你可以有不同类型的遥控器，比如“基础遥控器”、“带学习功能的遥控器”、“智能遥控器”。
*   **电视机（实现部分）**：它是真正执行这些操作的设备。你可以有不同品牌的电视机，比如“索尼电视”、“三星电视”、“小米电视”。每个品牌的电视机实现“开/关”等功能的方式（内部电路、信号协议）是不同的。

**桥接模式的作用**：
如果没有桥接模式，你可能需要为每个品牌的电视机都设计一个专用的遥控器：`索尼遥控器`、`三星遥控器`... 如果你又想增加一个“智能遥控器”的功能，你就得为每个品牌再造一个：`智能索尼遥控器`、`智能三星遥控器`... 这会导致类的数量爆炸式增长。

桥接模式就像一个**通用协议**。遥控器只负责发出标准的“换台”信号，而电视机则负责接收这个标准信号并用自己的方式去实现换台。这样，遥控器（抽象）和电视机（实现）就可以独立发展了。你可以随意更换电视机品牌，而不用换遥控器；你也可以升级你的遥控器，而不用换电视机。遥控器和电视机之间的连接，就是那个“桥”。

---

### 3. 解决的问题：类的“笛卡尔积”爆炸
在软件设计中，我们经常会遇到一个类有两个或多个独立变化的维度。

**经典案例：形状与颜色**

假设我们要绘制不同颜色的形状。
*   **维度1（形状）**：圆形、正方形、三角形...
*   **维度2（颜色）**：红色、蓝色、绿色...

如果使用继承来实现，会是这样：

```
           Shape
          /     \
      Circle   Square
     /   \     /   \
RedCircle BlueCircle RedSquare BlueSquare
```

**问题显而易见**：
*   **类数量爆炸**：每增加一种新形状（如三角形），就需要为它增加所有颜色的子类（`RedTriangle`, `BlueTriangle`...）。每增加一种新颜色（如绿色），就需要为所有形状增加子类（`GreenCircle`, `GreenSquare`...）。这是 M x N 的增长关系。
*   **扩展性差**：代码库变得非常臃肿和难以维护。

**桥接模式的解决方案**：
将这两个维度分开，让它们通过“组合”关系连接，而不是继承。

*   **抽象部分**：`Shape` (形状)
*   **实现部分**：`Color` (颜色)

`Shape` 类内部持有一个 `Color` 对象的引用。当 `Shape` 需要绘制自己时，它会调用 `Color` 对象的方法来填充颜色。

![Bridge Pattern UML](https://refactoringguru.cn/images/patterns/diagrams/bridge/structure-zh-2x.png)

---

### 4. 桥接模式的结构与参与者

桥接模式包含以下四个核心角色：

1.  **Abstraction (抽象部分)**
    *   定义了高层控制的抽象接口。
    *   内部维护一个指向 `Implementor`（实现部分）对象的引用。
    *   对应例子中的 `Shape` 类。

2.  **RefinedAbstraction (扩展抽象部分)**
    *   继承或实现 `Abstraction`，扩展其接口。
    *   对高层逻辑进行细化。
    *   对应例子中的 `Circle`、`Square` 类。

3.  **Implementor (实现部分接口)**
    *   定义了底层实现类的接口，这个接口不一定要和 `Abstraction` 的接口完全一致。
    *   它只提供基本的操作，`Abstraction` 通过调用这些操作来完成复杂的业务。
    *   对应例子中的 `Color` 接口。

4.  **ConcreteImplementor (具体实现部分)**
    *   实现了 `Implementor` 接口。
    *   是真正执行底层操作的类。
    *   对应例子中的 `RedColor`、`BlueColor` 类。

**核心思想**：**用组合/聚合关系（has-a）代替继承关系（is-a）**。`Abstraction` **拥有**一个 `Implementor`，而不是**是**一个 `Implementor`。

---

### 5. Java 代码示例（形状与颜色）

#### 步骤1: 创建实现部分接口 (Implementor)

```java
// Implementor: 颜色接口
public interface Color {
    void applyColor();
}
```

#### 步骤2: 创建具体实现类 (ConcreteImplementor)

```java
// ConcreteImplementor A: 红色
public class RedColor implements Color {
    @Override
    public void applyColor() {
        System.out.println("Applying red color.");
    }
}

// ConcreteImplementor B: 蓝色
public class BlueColor implements Color {
    @Override
    public void applyColor() {
        System.out.println("Applying blue color.");
    }
}
```

#### 步骤3: 创建抽象部分 (Abstraction)

```java
// Abstraction: 形状类
public abstract class Shape {
    // 桥接的关键：持有一个实现部分的引用
    protected Color color;

    // 通过构造函数将具体实现注入
    public Shape(Color color) {
        this.color = color;
    }

    // 高层逻辑，具体绘制由子类完成
    public abstract void draw();
}
```

#### 步骤4: 创建扩展抽象部分 (RefinedAbstraction)

```java
// RefinedAbstraction A: 圆形
public class Circle extends Shape {
    public Circle(Color color) {
        super(color);
    }

    @Override
    public void draw() {
        System.out.print("Drawing a Circle. ");
        // 调用实现部分的方法
        color.applyColor();
    }
}

// RefinedAbstraction B: 正方形
public class Square extends Shape {
    public Square(Color color) {
        super(color);
    }

    @Override
    public void draw() {
        System.out.print("Drawing a Square. ");
        // 调用实现部分的方法
        color.applyColor();
    }
}
```

#### 步骤5: 客户端调用

```java
public class BridgePatternDemo {
    public static void main(String[] args) {
        // 创建一个红色的圆形
        Shape redCircle = new Circle(new RedColor());
        redCircle.draw();

        // 创建一个蓝色的正方形
        Shape blueSquare = new Square(new BlueColor());
        blueSquare.draw();
        
        // 现在可以自由组合
        // 比如，一个蓝色的圆形
        Shape blueCircle = new Circle(new BlueColor());
        blueCircle.draw();
    }
}
```

**输出结果**:
```
Drawing a Circle. Applying red color.
Drawing a Square. Applying blue color.
Drawing a Circle. Applying blue color.
```

现在，如果想增加一个“绿色”，只需添加 `GreenColor` 类即可，`Shape` 相关的类完全不用修改。如果想增加一个“三角形”，只需添加 `Triangle` 类，`Color` 相关的类也完全不用修改。

---

### 6. 优缺点

#### 优点
1.  **分离抽象和实现**：这是最核心的优点。让两个部分可以独立地扩展，而不会相互影响。
2.  **极大地提高了扩展性**：可以独立地对抽象部分和实现部分进行扩展，符合开闭原则。
3.  **避免了类爆炸**：有效解决了由多维度变化导致的子类数量过多的问题。
4.  **实现细节对客户透明**：客户代码只需与高层的 `Abstraction` 交互，无需关心底层的 `Implementor` 是如何实现的。

#### 缺点
1.  **增加了系统的复杂性**：引入了更多的类和接口，理解和设计上需要花费更多精力。
2.  **需要提前识别出两个独立变化的维度**：如果设计不当，或者维度划分不清晰，使用桥接模式可能会适得其反。

---

### 7. 适用场景

1.  当一个类存在两个或多个独立变化的维度，且你希望这两个维度可以独立扩展时。
2.  当你不希望在抽象和其实现之间有固定的绑定关系时（例如，通过配置文件来决定使用哪个具体实现）。
3.  当你想在多个对象间共享一个实现，但同时要求客户不知道这一点时。
4.  典型的应用场景：
    *   **JDBC 驱动程序**：`java.sql.Driver` 就是一个桥接。Java 应用程序（抽象部分）通过标准的 JDBC 接口与各种数据库驱动（实现部分，如 MySQL Driver, Oracle Driver）交互。
    *   **不同平台的 GUI 工具包**：一个窗口类（抽象）可以在不同操作系统（Windows, Linux, macOS - 实现）上进行绘制。

---

### 8. 与其他模式的比较

*   **与适配器模式（Adapter Pattern）的区别**：
    *   **意图不同**：桥接模式的意图是**分离**抽象和实现，让它们独立变化（设计时就考虑）；适配器模式的意图是**兼容**两个不兼容的接口（通常是事后补救）。
    *   **时机不同**：桥接模式通常在系统设计初期使用；适配器模式则在系统集成或重构时使用。

*   **与策略模式（Strategy Pattern）的区别**：
    *   两者都使用组合，但目的不同。
    *   **策略模式**：关注于封装一系列**算法**，让它们可以互相替换，客户端通常知道有哪些策略并主动选择。它改变的是对象的**行为**。
    *   **桥接模式**：关注于**结构**上的解耦，将抽象和实现分开。客户端通常只与抽象部分交互，实现部分在创建时就已确定。它改变的是对象的**实现**。

希望这份详细的介绍能帮助你彻底理解桥接模式！