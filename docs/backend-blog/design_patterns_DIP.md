---
title: 依赖倒转原则
createTime: 2025/06/20 02:56:29
permalink: /article/zw70ykgp/
tags:
- 设计模式
---


### 一、 什么是依赖倒转原则 (DIP)？

#### 1. 核心定义

这个原则包含两个关键部分：

> **A. 高层模块不应该依赖于低层模块。两者都应该依赖于抽象。**
> (High-level modules should not depend on low-level modules. Both should depend on abstractions.)
>
> **B. 抽象不应该依赖于细节。细节应该依赖于抽象。**
> (Abstractions should not depend on details. Details should depend on abstractions.)

#### 2. 通俗解释

让我们把这些定义变得通俗易懂：

*   **高层模块 vs 低层模块：**
    *   **高层模块**是执行主要业务逻辑、调用其他模块来完成任务的模块。可以理解为“指挥者”或“老板”。
    *   **低层模块**是提供具体功能、实现基础操作的模块。可以理解为“执行者”或“工人”。
    *   例如，在一个“汽车”类中，“汽车”是高层模块，而“引擎”、“轮胎”是低层模块。

*   **什么是“依赖”？**
    *   如果一个类A中用到了另一个类B（比如作为成员变量、方法参数或在方法中`new`了一个B的实例），我们就说“类A依赖于类B”。

*   **“倒转”的是什么？**
    *   在传统的、不好的设计中，依赖关系是单向的：**高层模块 → 低层模块**（老板直接依赖于某个特定的工人）。
    *   依赖倒转原则要求我们**“倒转”**这个依赖方向。它不是让低层模块去依赖高层模块，而是引入一个**“抽象层”（接口或抽象类）**，让高层和低层都依赖这个抽象层。
    *   新的依赖关系变为：**高层模块 → 抽象层 ← 低层模块**。
    *   依赖的方向从“具体”倒向了“抽象”，这就是“倒转”的含义。

**核心思想：** 不要面向实现编程，而要面向接口编程。你的代码应该依赖于“它需要什么功能”（接口），而不是“谁提供了这个功能”（具体的类）。

---

### 二、 代码实例：开关与灯泡

这是一个非常经典的例子，能清晰地展示依赖倒转原则的作用。

#### 1. 违反DIP的设计 (不好的设计)

在这个设计中，`Switch`（开关，高层模块）直接依赖于 `LightBulb`（灯泡，低层模块）。

```java
// 低层模块：一个具体的灯泡类
class LightBulb {
    public void turnOn() {
        System.out.println("LightBulb: The light bulb is on.");
    }

    public void turnOff() {
        System.out.println("LightBulb: The light bulb is off.");
    }
}

// 高层模块：开关类
// 它直接依赖于具体的 LightBulb 类
class Switch {
    // 强耦合：Switch 和 LightBulb 紧紧地绑在了一起
    private LightBulb bulb; 

    public Switch() {
        this.bulb = new LightBulb(); // 直接创建低层模块的实例
    }

    // 操作开关
    public void flip(boolean on) {
        if (on) {
            bulb.turnOn();
        } else {
            bulb.turnOff();
        }
    }
}

// 使用
public class Main {
    public static void main(String[] args) {
        Switch mySwitch = new Switch();
        mySwitch.flip(true); // 打开灯
        mySwitch.flip(false); // 关闭灯
    }
}
```

**问题分析：**

*   **耦合性太强：** `Switch` 类和 `LightBulb` 类紧密地耦合在一起。`Switch` 只能控制 `LightBulb`。
*   **扩展性极差：** 如果我们现在想让这个开关去控制一个`Fan`（风扇）怎么办？我们必须**修改 `Switch` 类的内部代码**，比如添加 `if/else` 判断，或者干脆创建一个新的 `FanSwitch` 类。这违反了**开闭原则**。

---

#### 2. 遵循DIP的重构 (好的设计)

现在，我们引入一个抽象层来“倒转”这个依赖。

**第1步：创建抽象层**

我们定义一个“可被开关控制的设备”的接口（抽象）。

```java
// 1. 创建一个抽象接口（我们的“契约”）
interface Switchable {
    void turnOn();
    void turnOff();
}
```

**第2步：细节依赖于抽象**

让低层模块（具体的设备）实现这个接口。

```java
// 2. 让低层模块实现这个接口
class LightBulb implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("LightBulb: The light bulb is on.");
    }

    @Override
    public void turnOff() {
        System.out.println("LightBulb: The light bulb is off.");
    }
}

// 我们可以轻松地扩展新的低层模块
class Fan implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("Fan: The fan is spinning.");
    }

    @Override
    public void turnOff() {
        System.out.println("Fan: The fan has stopped.");
    }
}
```

**第3步：高层模块依赖于抽象**

让高层模块 `Switch` 依赖于 `Switchable` 接口，而不是任何具体的类。

```java
// 3. 让高层模块依赖于抽象接口
class Switch {
    // 依赖于抽象，而不是具体实现
    private Switchable device;

    // 通过构造函数注入依赖（这是实现DIP的常用方法，称为依赖注入）
    public Switch(Switchable device) {
        this.device = device;
    }

    // 开关的操作不关心具体是什么设备，只调用接口定义的方法
    public void flip(boolean on) {
        if (on) {
            device.turnOn();
        } else {
            device.turnOff();
        }
    }
}
```

**第4步：客户端负责“组装”**

现在，由使用 `Switch` 的客户端代码来决定开关到底要控制哪个设备。

```java
public class Main {
    public static void main(String[] args) {
        // --- 场景1：用开关控制灯泡 ---
        // 创建一个具体的设备（低层模块）
        Switchable lightBulb = new LightBulb(); 
        // 将设备“注入”到开关（高层模块）中
        Switch lightSwitch = new Switch(lightBulb); 
        System.out.println("Controlling the light bulb:");
        lightSwitch.flip(true);
        lightSwitch.flip(false);

        System.out.println("\n--------------------------\n");

        // --- 场景2：用同一个开关控制风扇 ---
        // 创建另一个具体的设备
        Switchable fan = new Fan();
        // 将这个新设备注入到同一个设计的开关中
        Switch fanSwitch = new Switch(fan);
        System.out.println("Controlling the fan:");
        fanSwitch.flip(true);
        fanSwitch.flip(false);
    }
}
```

**优势分析：**

*   **低耦合：** `Switch` 类不再知道 `LightBulb` 或 `Fan` 的存在。它只知道它需要一个实现了 `Switchable` 接口的东西。
*   **高灵活性和扩展性：** 我们可以创建任意多的新设备（比如`Toaster`、`Television`），只要它们实现了 `Switchable` 接口，`Switch` 类就**无需任何修改**，可以直接控制它们。这完美地遵循了**开闭原则**。
*   **易于测试：** 我们可以轻松地创建一个`MockSwitchableDevice`的测试替身来测试`Switch`类，而无需依赖于真实的硬件或复杂的类。

### 依赖倒转(DIP) vs 依赖注入(DI) vs 控制反转(IoC)

这三个概念紧密相关，但有所区别：

*   **依赖倒转原则 (DIP):** 是一个**设计原则**。它告诉你“应该怎么做”（要依赖抽象）。
*   **控制反转 (IoC):** 是一个更广泛的**设计思想或范式**。它描述的是一种“控制权”的转移。在我们的例子中，`Switch` 不再自己控制创建哪个设备，而是把这个控制权“反转”给了外部的`Main`方法。
*   **依赖注入 (DI):** 是实现IoC和DIP的一种具体**设计模式**。它是“如何做到”的方法。在例子中，我们通过`Switch`的构造函数将`device`对象传递进去，这就是“构造函数注入”，是DI的一种。

简单记：**DIP是目标，IoC是思想，DI是实现手段。**