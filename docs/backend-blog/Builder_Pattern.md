---
title: 建造者模式
createTime: 2025/06/20 03:12:25
permalink: /article/zciaj60y/
tags:
- 设计模式
- 构建型模式
---

这是一个非常实用的创建型模式，它旨在将一个**复杂对象的构建过程**与其**最终表示**分离，使得同样的构建过程可以创建出不同的表示。

### 一、 什么是建造者模式？

#### 1. 核心思想
当我们需要创建一个复杂的对象，这个对象由多个部分组成，并且这些部分的创建顺序和组合方式是多变的，如果用一个构造函数来处理，会导致构造函数参数过多且难以维护（即“重叠构造函数”或“伸缩构造函数”问题）。

建造者模式通过以下方式解决这个问题：
1.  **分步构建：** 将复杂对象的创建过程拆解成一步步简单的操作。
2.  **封装过程：** 将这些构建步骤封装在一个“建造者”（Builder）对象中。
3.  **隔离表示：** 客户端只需要与建造者交互，告诉它需要哪些部件，而无需关心这些部件是如何被装配到最终产品中的。

#### 2. 通俗比喻：组装电脑
这是解释建造者模式最经典的例子。
*   **复杂对象（Product）：** 一台完整的电脑 (`Computer`)。
*   **组成部分：** CPU、内存（RAM）、硬盘（Storage）、显卡（GPU）等。
*   **构建步骤：** 安装CPU、安装内存、安装硬盘...
*   **不同的表示：** 游戏电脑（高端CPU、大内存、顶级显卡）和办公电脑（普通CPU、够用内存、集成显卡）。

如果你用一个构造函数来创建电脑：
`new Computer("Intel i9", "32GB", "1TB SSD", "RTX 4090", "Water Cooling", ...)`
这个构造函数会变得非常长，而且参数顺序容易出错，很多参数可能是可选的。

建造者模式就像一个专业的电脑装机员（Builder）。你只需要告诉他：
1.  “给我装个i9的CPU。” (`builder.buildCPU("Intel i9")`)
2.  “内存要32GB的。” (`builder.buildRAM("32GB")`)
3.  ...
最后，你对装机员说：“好了，把装好的电脑给我。” (`builder.build()`)，他就给你一台完整且配置正确的电脑。

---

### 二、 如何实现建造者模式？

建造者模式有两种主流的实现方式：
1.  **经典建造者模式（GoF版）：** 包含四个角色：Product, Builder, ConcreteBuilder, Director。
2.  **现代链式建造者模式（Fluent Builder）：** 更常用，更简洁，通常使用静态内部类实现。

#### 1. 经典建造者模式

##### a) 角色
*   **Product（产品）：** 要创建的复杂对象，如 `Computer`。
*   **Builder（抽象建造者）：** 一个接口，定义了创建产品各个部分的方法（如 `buildCPU()`）和一个返回最终产品的方法（如 `getComputer()`）。
*   **ConcreteBuilder（具体建造者）：** 实现了Builder接口，负责具体部件的创建和装配。如 `GamingComputerBuilder`。
*   **Director（指挥者/导演）：** 负责调用Builder中的方法，**定义和控制构建的顺序和算法**。它将客户端与构建过程隔离开。

##### b) 代码实例

```java
// 1. Product (产品)
class Computer {
    private String cpu;
    private String ram;
    private String storage;
    // ... 其他部件

    public void setCpu(String cpu) { this.cpu = cpu; }
    public void setRam(String ram) { this.ram = ram; }
    public void setStorage(String storage) { this.storage = storage; }

    @Override
    public String toString() {
        return "Computer [cpu=" + cpu + ", ram=" + ram + ", storage=" + storage + "]";
    }
}

// 2. Builder (抽象建造者)
interface ComputerBuilder {
    void buildCpu();
    void buildRam();
    void buildStorage();
    Computer getComputer();
}

// 3. ConcreteBuilder (具体建造者)
class GamingComputerBuilder implements ComputerBuilder {
    private Computer computer = new Computer();

    @Override
    public void buildCpu() {
        computer.setCpu("Intel Core i9");
    }
    @Override
    public void buildRam() {
        computer.setRam("32GB DDR5");
    }
    @Override
    public void buildStorage() {
        computer.setStorage("2TB NVMe SSD");
    }
    @Override
    public Computer getComputer() {
        return computer;
    }
}

// 4. Director (指挥者)
class ComputerDirector {
    // 指挥建造过程
    public Computer construct(ComputerBuilder builder) {
        builder.buildCpu();
        builder.buildRam();
        builder.buildStorage();
        return builder.getComputer();
    }
}

// 客户端调用
public class Client {
    public static void main(String[] args) {
        // 创建一个指挥者
        ComputerDirector director = new ComputerDirector();
        // 创建一个游戏电脑的建造者
        ComputerBuilder gamingBuilder = new GamingComputerBuilder();
        
        // 指挥者使用建造者来构建电脑
        Computer gamingComputer = director.construct(gamingBuilder);
        
        System.out.println("成功构建一台游戏电脑: " + gamingComputer);
    }
}
```

#### 2. 现代链式建造者模式 (Fluent Builder)

这种方式更流行，因为它更简洁，可读性更好。它通常省略了 `Director` 角色，将构建步骤的灵活性交给了客户端。

##### a) 特点
*   使用静态内部类作为 `Builder`。
*   `Builder` 的每个设置方法都返回 `this`（Builder自身），以支持**链式调用**。
*   `Product` 的构造函数是私有的，只能通过 `Builder` 来创建。

##### b) 代码实例

```java
// 1. Product (产品) - 构造函数私有，通常是不可变的
public class Computer {
    private final String cpu;
    private final String ram;
    private final String storage;
    private final String gpu; // 可选参数

    // 私有构造函数，接收一个Builder作为参数
    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ram = builder.ram;
        this.storage = builder.storage;
        this.gpu = builder.gpu;
    }

    @Override
    public String toString() {
        return "Computer [cpu=" + cpu + ", ram=" + ram + ", storage=" + storage + ", gpu=" + gpu + "]";
    }

    // 2. Builder (静态内部类)
    public static class Builder {
        // 拥有与外部类相同的字段
        private String cpu;
        private String ram;
        private String storage;
        private String gpu; // 可选

        // 构造函数可以包含必需参数
        public Builder(String cpu, String ram) {
            this.cpu = cpu;
            this.ram = ram;
        }

        // 设置可选参数的方法，返回Builder自身以支持链式调用
        public Builder storage(String storage) {
            this.storage = storage;
            return this;
        }

        public Builder gpu(String gpu) {
            this.gpu = gpu;
            return this;
        }

        // 最终的build()方法，创建并返回外部类实例
        public Computer build() {
            return new Computer(this);
        }
    }
}

// 客户端调用
public class Client {
    public static void main(String[] args) {
        // 使用链式调用，代码可读性极高
        Computer gamingComputer = new Computer.Builder("Intel i9", "32GB")
                                            .storage("2TB SSD")
                                            .gpu("NVIDIA RTX 4090")
                                            .build();
        
        System.out.println("游戏电脑配置: " + gamingComputer);

        Computer officeComputer = new Computer.Builder("Intel i5", "16GB")
                                            .storage("512GB SSD")
                                            // 不设置GPU，使用默认值(null)
                                            .build();
        
        System.out.println("办公电脑配置: " + officeComputer);
    }
}
```

---

### 三、 优缺点与适用场景

#### 优点
1.  **封装性好：** 将构建过程与产品表示分离，客户端无需知道产品的内部组成和装配细节。
2.  **更好的控制构建过程：** 可以对构建过程进行更精细的控制，一步步地构建。
3.  **可读性高：** 链式调用使得代码意图清晰，易于阅读和维护。
4.  **易于扩展：** 增加新的具体建造者（`ConcreteBuilder`）很方便，符合开闭原则。
5.  **避免重叠构造函数：** 完美解决了构造函数参数过多、过长的问题。

#### 缺点
1.  **增加了代码量：** 需要额外创建 `Builder` 类，导致系统中的类数量增加。
2.  对于简单的对象，使用建造者模式会显得“小题大做”，增加不必要的复杂性。

#### 适用场景
1.  **对象有多个可选参数：** 当一个类的构造函数参数超过4-5个，并且很多是可选的时候，强烈建议使用建造者模式。
2.  **对象的创建过程复杂且分步：** 创建过程需要遵循特定的步骤或算法。
3.  **需要创建不可变对象：** 如链式调用示例，`Computer` 对象一旦通过 `build()` 创建，其状态就不能再改变，是线程安全的。
4.  **实际应用案例：**
    *   Java中的 `StringBuilder` 和 `StringBuffer`。
    *   `OkHttp` 库中的 `Request.Builder`。
    *   `MyBatis` 中的 `SqlSessionFactoryBuilder`。
    - 安卓开发中的 `AlertDialog.Builder`。

### 四、 与工厂模式的区别

这是一个常见的面试题。
*   **建造者模式 (Builder):** 关注的是**如何一步步地创建出一个复杂对象**。它关心的是对象的“组装过程”。客户端通常需要参与到对象的构建中（指定部件）。
*   **工厂模式 (Factory):** 关注的是**直接创建出不同类型的完整对象**。它关心的是“结果”，隐藏了整个创建过程。客户端只需要说“我要A”，工厂就返回一个完整的A。

简单说：**建造者模式是“怎么造”的问题，工厂模式是“造哪个”的问题。**