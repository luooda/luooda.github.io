---
title: 里氏代换原则
createTime: 2025/06/20 02:53:48
permalink: /article/r5zq17ed/
tags:
- 设计模式
---

### 一、 什么是里氏代换原则 (LSP)？

#### 1. 核心定义

> **所有引用基类（父类）的地方，必须能够透明地使用其子类的对象，而程序行为不发生改变。**
> (If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of that program.)

#### 2. 通俗解释

这个定义的核心思想是**“行为一致性”**。简单来说，就是：

**一个子类应该可以完全替代它的父类，并且程序不会出现任何错误或异常行为。**

换句话说，子类继承父类时，不应该改变父类已经定义好的行为。子类可以有自己的新行为（扩展），但不能“背叛”父类的原有行为。

一个非常著名的判断标准是：

> “如果它看起来像鸭子，叫起来像鸭子，但需要上电池，那么你可能得到了一个错误的抽象。”

这句话的意思是，一个“玩具鸭”子类虽然在概念上是“鸭子”的一种，但它的行为（需要电池）与真正的鸭子（生物行为）完全不同，因此它不能无缝地替换掉一个真正的鸭子对象。在这种情况下，让“玩具鸭”继承“鸭子”就是违反里氏代换原则的。

#### 3. 子类必须遵守的约定

为了不违反LSP，子类在重写（Override）父类方法时必须遵守：

1.  **子类方法的“前置条件”必须比父类方法更宽松或相同。** (Preconditions cannot be strengthened in a subtype.)
    *   通俗讲：父类能处理的请求，子类也必须能处理。你不能要求子类比父类更“挑剔”。
2.  **子类方法的“后置条件”必须比父类方法更严格或相同。** (Postconditions cannot be weakened in a subtype.)
    *   通俗讲：父类做出的承诺，子类必须兑现，而且可以做得更好，但不能做得更差。子类不能破坏父类方法原有的行为逻辑。
3.  **子类不应该抛出父类没有声明的异常。**

---

### 二、 代码实例：经典的正方形与长方形问题

这是解释LSP最著名的例子。在数学中，正方形（Square）是一种特殊的长方形（Rectangle）。于是，很多人在设计类的时候，很自然地会让 `Square` 类继承 `Rectangle` 类。

让我们看看这样做为什么会违反里氏代换原则。

#### 1. 违反LSP的设计

首先，我们创建一个 `Rectangle` 父类。

```java
// 父类：长方形
class Rectangle {
    protected double width;
    protected double height;

    public void setWidth(double width) {
        this.width = width;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWidth() {
        return width;
    }

    public double getHeight() {
        return height;
    }

    // 计算面积
    public double getArea() {
        return width * height;
    }
}
```
`Rectangle` 类有一个很重要的**隐性行为约定**：`setWidth` 和 `setHeight` 是相互独立的。改变宽度不应该影响高度，反之亦然。

现在，我们创建一个 `Square` 子类，并让它继承 `Rectangle`。

```java
// 子类：正方形
// 为了维持“正方形”的特性（边长相等），我们必须重写 setter 方法
class Square extends Rectangle {
    @Override
    public void setWidth(double side) {
        super.setWidth(side);
        super.setHeight(side); // 破坏了父类的约定：设置宽度时，高度也被改变了！
    }

    @Override
    public void setHeight(double side) {
        super.setWidth(side); // 破坏了父类的约定：设置高度时，宽度也被改变了！
        super.setHeight(side);
    }
}
```

**问题在哪里？**

`Square` 为了维持自己的特性（`width == height`），破坏了父类 `Rectangle` 的行为约定。现在，`setWidth` 和 `setHeight` 不再独立。

让我们看一个使用场景，来证明这个设计是有问题的。假设我们有一个测试方法，它接收一个 `Rectangle` 对象，并期望它的行为是长方形的行为。

```java
// 这是一个客户端或测试类，它依赖于 Rectangle
public class ClientTest {
    // 这个方法期望传入的是一个行为正确的“长方形”
    public static void resizeAndCheck(Rectangle r) {
        // 设置宽度为 20
        r.setWidth(20);
        // 设置高度为 10
        r.setHeight(10);

        // 期望的面积应该是 20 * 10 = 200
        double expectedArea = 200.0;
        double actualArea = r.getArea();
        
        System.out.println("期望面积: " + expectedArea);
        System.out.println("实际面积: " + actualArea);
        
        if (expectedArea == actualArea) {
            System.out.println("测试通过！行为符合预期。");
        } else {
            System.out.println("测试失败！行为不符合预期！");
        }
    }

    public static void main(String[] args) {
        System.out.println("--- 测试长方形对象 ---");
        Rectangle rect = new Rectangle();
        resizeAndCheck(rect); // 传入父类对象

        System.out.println("\n--- 测试正方形对象 ---");
        Square square = new Square();
        resizeAndCheck(square); // 传入子类对象，替换父类对象
    }
}
```

**运行结果：**

```
--- 测试长方形对象 ---
期望面积: 200.0
实际面积: 200.0
测试通过！行为符合预期。

--- 测试正方形对象 ---
期望面积: 200.0
实际面积: 100.0
测试失败！行为不符合预期！
```

**分析：**
当我们将 `Square` 对象传递给 `resizeAndCheck` 方法时，程序出错了。因为 `resizeAndCheck` 方法期望 `setWidth(20)` 和 `setHeight(10)` 之后，面积是 `20 * 10`。但对于 `Square` 对象，调用 `setHeight(10)` 时，它把宽度也改成了10，导致最终面积是 `10 * 10 = 100`。

`Square` 子类对象无法透明地替换 `Rectangle` 父类对象，并保持程序行为正确。因此，这个设计**严重违反了里氏代换原则**。

---

#### 2. 遵循LSP的重构 (好的设计)

如何修正这个问题？核心是认识到，尽管在数学概念上正方形是长方形，但在**行为**上，它们的 setter 方法约定不同，因此它们不适合构成父子继承关系。

一个更好的设计是**打破这种继承关系**，并使用一个更通用的抽象。

```java
// 1. 创建一个更通用的抽象接口或抽象类
interface Shape {
    double getArea();
}

// 2. 长方形实现 Shape 接口
class Rectangle implements Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double getArea() {
        return width * height;
    }
}

// 3. 正方形也实现 Shape 接口，它有自己的构造方式
class Square implements Shape {
    private double side;

    public Square(double side) {
        this.side = side;
    }

    @Override
    public double getArea() {
        return side * side;
    }
}
```

**优势：**

*   **不再有继承带来的行为冲突。** `Rectangle` 和 `Square` 都是独立的 `Shape`，它们各自管理自己的状态，互不干扰。
*   **客户端可以依赖于 `Shape` 抽象。** 如果客户端只需要计算面积，那么它可以与 `Shape` 接口交互，而无需关心具体是 `Rectangle` 还是 `Square`。
*   **设计更清晰、更稳定。** 每个类的职责单一且明确，不会因为继承而产生意外的副作用。

### 总结

里氏代换原则（LSP）的本质是确保继承是一种**“is-a”**的行为关系，而不仅仅是概念关系。子类必须真正地表现得像其父类，遵守父类定义的所有行为约定。如果子类做不到这一点，就不应该使用继承，而应考虑使用组合、聚合或创建共同的接口等其他方式来建立类之间的关系。