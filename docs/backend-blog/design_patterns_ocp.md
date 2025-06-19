---
title: 开闭原则
createTime: 2025/06/20 02:48:31
permalink: /article/zz035q5d/
tags:
- 设计模式
---

### 一、 什么是开闭原则 (OCP)？

#### 1. 核心定义

> **软件实体（类、模块、函数等）应该对扩展开放，对修改关闭。**
> (Software entities should be open for extension, but closed for modification.)

这个定义听起来有点矛盾，我们来拆解一下：

*   **对扩展开放 (Open for Extension):**
    这意味着当软件需要增加新功能时，你可以通过**添加新代码**来实现，而不是修改现有代码。系统的行为是可以被扩展的。就像给你的手机安装一个新 App，你扩展了手机的功能，但没有拆开手机去修改它的硬件。

*   **对修改关闭 (Closed for Modification):**
    这意味着一个模块一旦开发完成、经过测试、运行稳定，它的**源代码就不应该被随意修改**。因为修改现有代码可能会引入新的 bug，影响到已经正常工作的功能，增加回归测试的成本和风险。

**核心思想：** 通过使用**抽象**（如接口或抽象类）来构建一个稳定的核心，然后通过实现这个抽象来创建新的、可扩展的部分。这样，当需求变化时，我们只需要创建新的实现类并“插入”到系统中，而不需要动摇那个稳定的核心。

#### 2. 为什么它很重要？

*   **提高稳定性：** 不修改老代码，就不会破坏原有的功能，系统更加稳定可靠。
*   **提高可维护性：** 新增功能都封装在新的类中，代码结构清晰，易于理解和维护。
*   **提高灵活性和可扩展性：** 系统可以轻松地适应新需求，因为添加新功能就像搭积木一样，只需要增加新的“积木块”，而不用改变积木的插槽。

---

### 二、 代码实例

我们用一个非常经典的例子——**计算不同形状的面积**——来演示。

#### 场景
假设我们有一个 `AreaCalculator` 类，它的工作是计算一组形状的总面积。

#### 1. 违反开闭原则的例子 (不好的设计)

在这个设计中，`AreaCalculator` 知道每一种具体的形状。

```java
// 形状类
class Rectangle {
    public double width;
    public double height;
}

class Circle {
    public double radius;
}

// 面积计算器
class AreaCalculator {
    // 计算面积的方法
    public double calculateTotalArea(Object[] shapes) {
        double totalArea = 0;
        for (Object shape : shapes) {
            if (shape instanceof Rectangle) {
                Rectangle rect = (Rectangle) shape;
                totalArea += rect.width * rect.height;
            } else if (shape instanceof Circle) {
                Circle circle = (Circle) shape;
                totalArea += Math.PI * circle.radius * circle.radius;
            }
            // ... 每增加一种形状，都必须在这里加一个 else if ...
        }
        return totalArea;
    }
}
```

**问题分析：**

这个 `AreaCalculator` 类是**对修改开放的**。

*   **痛点：** 如果现在我们需要增加一个新的形状，比如 `Triangle` (三角形)，我们必须做什么？
    1.  创建 `Triangle` 类。
    2.  **修改 `AreaCalculator` 类的 `calculateTotalArea` 方法**，在里面增加一个 `else if (shape instanceof Triangle)` 的逻辑。

这就违反了“对修改关闭”的原则。每次增加新功能，我们都在修改一个已经写好并且测试过的核心类，这非常危险。

---

#### 2. 遵循开闭原则的重构 (好的设计)

现在，我们使用**抽象**来重构这个设计，使其遵循开闭原则。

**第1步：创建抽象层**

我们定义一个抽象的 `Shape` 接口，它规定了所有“形状”都必须有一个计算自己面积的方法。

```java
// 1. 创建一个抽象的 Shape 接口（我们的“契约”）
interface Shape {
    double calculateArea(); // 所有形状都必须实现这个方法
}
```

**第2步：创建具体的实现类**

让每个具体的形状类都实现 `Shape` 接口。

```java
// 2. 让具体的类实现这个接口
class Rectangle implements Shape {
    public double width;
    public double height;

    @Override
    public double calculateArea() {
        return width * height;
    }
}

class Circle implements Shape {
    public double radius;

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

**第3步：重构计算器**

`AreaCalculator` 现在不再依赖于具体的 `Rectangle` 或 `Circle`，而是依赖于抽象的 `Shape` 接口。

```java
// 3. 重构计算器，让它依赖于抽象而不是具体实现
class AreaCalculator {
    // 这个方法现在是“对修改关闭”的
    public double calculateTotalArea(Shape[] shapes) {
        double totalArea = 0;
        for (Shape shape : shapes) {
            // 它不关心具体是什么形状，只管调用契约中定义的方法
            totalArea += shape.calculateArea();
        }
        return totalArea;
    }
}
```

**优势分析：**

现在，`AreaCalculator` 类是**对修改关闭**的。它的逻辑非常稳定，无论未来有多少种形状，它的代码都**不需要任何改动**。

**第4步：展示“对扩展开放”**

如果现在我们想增加 `Triangle` (三角形)呢？

```java
// 4. 轻松扩展新功能，而无需修改任何现有代码

// a. 创建新的 Triangle 类并实现 Shape 接口
class Triangle implements Shape {
    public double base;
    public double height;

    @Override
    public double calculateArea() {
        return 0.5 * base * height;
    }
}

// b. 在使用时，直接将新形状加入即可
public class Main {
    public static void main(String[] args) {
        AreaCalculator calculator = new AreaCalculator();
        
        Shape[] shapes = {
            new Rectangle(10, 5), 
            new Circle(7),
            new Triangle(8, 4) // <-- 看，我们无缝地加入了新形状！
        };
        
        double totalArea = calculator.calculateTotalArea(shapes);
        System.out.println("Total area: " + totalArea);
        // AreaCalculator 类完全不知道 Triangle 的存在，但依然能正确工作！
    }
}
```
我们只是**添加**了一个新的 `Triangle` 类，而完全没有**修改** `AreaCalculator`、`Rectangle` 或 `Circle` 的代码。

这就是**“对扩展开放，对修改关闭”**的完美体现。

### 总结

| | 违反 OCP 的设计 | 遵循 OCP 的设计 |
| :--- | :--- | :--- |
| **核心逻辑** | `if/else` 或 `switch` 判断具体类型 | 依赖抽象接口，调用接口方法 |
| **新增功能时** | **修改**核心类的代码 | **添加**新的实现类 |
| **耦合性** | 高耦合（计算器与具体形状紧密耦合） | 低耦合（计算器只与抽象接口耦合） |
| **风险** | 高（修改可能引入bug） | 低（新增代码不影响旧代码） |
| **维护性** | 差 | 好 |