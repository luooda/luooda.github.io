---
title: 合成复用原则
createTime: 2025/06/20 03:01:33
permalink: /article/1i9j86ym/
tags:
- 设计模式
---


### 一、 什么是合成复用原则 (CRP)？

#### 1. 核心定义

> **尽量使用对象组合（Composition）或聚合（Aggregation），而不是继承（Inheritance）来达到复用的目的。**
> (Favor composition/aggregation over inheritance.)

#### 2. 通俗解释：两种“复用”方式

当你想复用一个类 `A` 的功能时，通常有两种方式：

1.  **继承（Inheritance）:** 让你的新类 `B` 去继承 `A`。这时，`B` 就自动获得了 `A` 的所有非私有方法和属性。这是一种 **"is-a"**（是一个）的关系。例如，`Dog` is an `Animal`。
2.  **组合/聚合（Composition/Aggregation）:** 在你的新类 `B` 内部，创建一个类 `A` 的实例作为成员变量。当 `B` 需要用到 `A` 的功能时，就调用这个成员变量的方法。这是一种 **"has-a"**（有一个）或 **"part-of"**（是一部分）的关系。例如，A `Car` has an `Engine`。

合成复用原则明确地告诉我们：**应该优先选择第二种方式（has-a）**。

---

### 二、 为什么要优先使用组合，而不是继承？

继承被称为“白盒复用”，而组合被称为“黑盒复用”。这个比喻非常形象地揭示了两者之间的根本区别。

| 特性 | 继承 (Inheritance) - "白盒复用" | 组合/聚合 (Composition/Aggregation) - "黑盒复用" |
| :--- | :--- | :--- |
| **耦合度** | **高耦合**。子类和父类的实现细节紧密地绑定在一起。父类的任何内部实现变化，都可能导致所有子类出现问题。 | **低耦合**。新类只与被组合对象的公共接口（API）发生依赖，不关心其内部实现。只要接口不变，内部实现可以随意修改。 |
| **封装性** | **破坏封装**。父类的实现细节对子类是可见的（至少 `protected` 成员是），子类可能会无意中破坏父类的内部状态。 | **保持封装**。被组合的对象作为一个整体，其内部实现被很好地隐藏起来。 |
| **灵活性** | **差**。继承关系在编译时就已确定，无法在运行时动态改变。而且大多数语言（如Java）不支持多重继承。 | **高**。可以在运行时动态地选择或更换被组合的对象，从而改变新类的行为。可以组合任意多个不同类型的对象。 |
| **关系** | **is-a (是一个)** | **has-a (有一个)** |

**结论：** 组合/聚合的方式使得系统更加灵活，耦合度更低，更容易维护。

---

### 三、 代码实例：汽车与引擎

#### 场景
我们想创建一个 `Car` 类，它需要具备引擎的功能（比如启动）。

#### 1. 错误的方式：使用继承

在这个设计中，我们错误地让 `Car` 继承 `Engine`，仅仅为了复用 `Engine` 的 `start()` 方法。

```java
// 引擎类
class Engine {
    public void start() {
        System.out.println("Engine has started.");
    }
}

// 错误的设计：Car “是”一个 Engine？这在逻辑上不通。
class Car extends Engine {
    public void drive() {
        // 为了开车，需要先启动引擎
        // 因为继承了 Engine，所以可以直接调用 start()
        start(); 
        System.out.println("Car is moving.");
    }
}
```

**问题分析：**

*   **逻辑不通：** “汽车是一个引擎”在现实世界中是荒谬的。这种滥用 `is-a` 关系的设计会导致模型混乱。
*   **耦合性高：** `Car` 和 `Engine` 的实现紧紧绑定。如果 `Engine` 的 `start` 方法改名或修改了逻辑，`Car` 类可能会崩溃。
*   **不灵活：** 如果现在想给汽车换一个“电能引擎”（`ElectricEngine`），怎么办？由于 `Car` 已经继承了 `Engine`，这个继承关系是静态的，无法在运行时更换。

---

#### 2. 正确的方式：使用组合

我们应该认识到，汽车“拥有”一个引擎（Car "has-a" Engine）。

**第1步：定义组件**

`Engine` 是一个独立的组件。为了更好的扩展性，我们可以先定义一个引擎接口。

```java
interface IEngine {
    void start();
}

class GasolineEngine implements IEngine {
    @Override
    public void start() {
        System.out.println("Gasoline engine has started.");
    }
}

class ElectricEngine implements IEngine {
    @Override
    public void start() {
        System.out.println("Electric engine has started. Silent and smooth!");
    }
}
```

**第2步：在新类中组合组件**

`Car` 类内部持有一个 `IEngine` 类型的成员变量。

```java
// 正确的设计：Car “有”一个 Engine
class Car {
    // Car 拥有一个引擎，这是“组合”关系
    private IEngine engine;

    // 通过构造函数注入具体的引擎实例
    public Car(IEngine engine) {
        this.engine = engine;
    }

    // Car 的方法通过调用其组件的方法来完成工作（这被称为“委托”或“转发”）
    public void drive() {
        // 委托引擎去启动
        engine.start(); 
        System.out.println("Car is moving.");
    }
    
    // 可以在运行时更换引擎！
    public void setEngine(IEngine newEngine) {
        this.engine = newEngine;
        System.out.println("Engine has been replaced.");
    }
}
```

**第3步：客户端组装**

```java
public class Main {
    public static void main(String[] args) {
        // --- 组装一辆汽油车 ---
        IEngine gasEngine = new GasolineEngine();
        Car myGasCar = new Car(gasEngine);
        myGasCar.drive();

        System.out.println("\n------------------\n");

        // --- 组装一辆电动车 ---
        IEngine electricEngine = new ElectricEngine();
        Car myElectricCar = new Car(electricEngine);
        myElectricCar.drive();
        
        System.out.println("\n--- 技术升级，给汽油车换上电能引擎 ---");
        myGasCar.setEngine(new ElectricEngine());
        myGasCar.drive();
    }
}
```

**优势分析：**
*   **低耦合、高内聚：** `Car` 类和 `Engine` 类各自独立发展。`Car` 只关心 `IEngine` 接口，不关心是汽油还是电能引擎。
*   **高灵活性：** 如代码所示，我们可以在创建汽车时决定用哪种引擎，甚至可以在运行时更换引擎，这是继承完全无法做到的。
*   **清晰的逻辑关系：** "Car has an Engine" 的模型非常清晰，符合现实世界逻辑。

### 四、 那么什么时候才应该使用继承？

继承并没有被完全禁止，但在使用它时应该非常谨慎。使用继承的**唯一**时机是：

**当子类是父类的一个真正的、纯粹的“特殊类型”（is-a special type of），并且严格遵守里氏代换原则（LSP）时。**

*   **目的不是为了代码复用，而是为了表达类之间的分类关系和实现多态。**
*   例如，`Dog` is an `Animal`，`ArrayList` is a `List`。这些都是非常自然的 `is-a` 关系。子类扩展了父类的概念，而不是从根本上改变它。

### 总结

合成复用原则是构建健壮、灵活、可维护的面向对象系统的基石。它鼓励我们通过组装不同的“零件”（对象）来构建更复杂的系统，而不是通过建立一个庞大而僵化的继承树。记住这个经验法则：**要复用，先考虑“has-a”**。