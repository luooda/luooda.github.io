---
title: 装饰器模式
createTime: 2025/06/20 03:18:51
permalink: /article/hpdnlc3p/
tags:
- 设计模式
- 结构型模式
---
这是一个非常巧妙和灵活的结构型模式，它的核心思想是**在不改变原有对象结构的情况下，动态地给一个对象添加一些额外的职责（功能）**。

### 一、 什么是装饰器模式？

#### 1. 核心思想
当你有一个基础对象，并希望在运行时根据需要给它增加各种各样的功能时，如果使用继承，会导致子类数量爆炸，难以管理。装饰器模式提供了一种更好的替代方案。

它通过一种“包装”的方式，将一个对象层层包裹起来。每一层“包装纸”（装饰器）都给被包裹的对象增加了一点新功能，但从外部看来，这个被包裹的对象的核心身份没有改变。

#### 2. 通俗比喻：给咖啡加料
这是解释装饰器模式最经典的比喻。
*   **基础对象 (Component):** 一杯简单的、无任何添加的**黑咖啡**。
*   **装饰器 (Decorator):** 各种各样的**调料**，比如牛奶、糖、奶油、巧克力酱等。

**流程：**
1.  你先拿到一杯黑咖啡（基础对象）。
2.  你想加牛奶，就用“牛奶装饰器”把它包起来。现在你有了一杯“加了牛奶的黑咖啡”。
3.  你还想加糖，就用“糖装饰器”把刚才那杯“加了牛奶的黑咖啡”再包起来。
4.  最终，你得到了一杯“加了糖的、加了牛奶的黑咖啡”。

在这个过程中，无论加了多少料，它本质上还是一杯“咖啡”（接口没有变），但它的功能（风味、价格）已经被动态地增强了。

---

### 二、 为什么要使用装饰器模式？

它主要为了解决**“子类爆炸”**的问题。

继续用咖啡的例子，如果不使用装饰器模式，而是用继承来实现，你会需要：
*   `Coffee` (基类)
*   `CoffeeWithMilk` (子类)
*   `CoffeeWithSugar` (子类)
*   `CoffeeWithMilkAndSugar` (子类)
*   `CoffeeWithMilkAndSugarAndCream` (子类)
*   ...

每增加一种调料，可能的组合数量就会呈指数级增长，这会导致类的数量变得非常庞大且难以维护。装饰器模式通过灵活的组合，完美地解决了这个问题。

---

### 三、 装饰器模式的结构与实现

装饰器模式通常包含四个角色：

1.  **Component（抽象组件）：** 定义了一个对象的接口，可以给这些对象动态地添加职责。在我们的比喻中，就是“咖啡”这个总称。
2.  **ConcreteComponent（具体组件）：** 定义了一个具体的、将被装饰的对象。它是装饰链的起点。比喻中就是那杯“黑咖啡”。
3.  **Decorator（抽象装饰器）：** 继承或实现 `Component` 接口，并且内部持有一个 `Component` 对象的引用（通过组合）。它负责将请求转发给被装饰的对象。
4.  **ConcreteDecorator（具体装饰器）：** 实现了抽象装饰器的类，负责向组件添加新的职责。比喻中就是“牛奶”、“糖”等具体调料。

#### 代码实例
场景：计算一杯加了各种调料的咖啡的总价和描述。

```java
// 1. Component (抽象组件)
interface Coffee {
    double getCost();
    String getDescription();
}

// 2. ConcreteComponent (具体组件)
class SimpleCoffee implements Coffee {
    @Override
    public double getCost() {
        return 10.0; // 一杯黑咖啡10元
    }

    @Override
    public String getDescription() {
        return "黑咖啡";
    }
}

// 3. Decorator (抽象装饰器)
// 它也实现了 Coffee 接口，并且持有一个 Coffee 对象的引用
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    // 默认实现是直接调用被装饰对象的方法
    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
}

// 4. ConcreteDecorator (具体装饰器) - 牛奶
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public double getCost() {
        // 在被装饰对象的价格基础上，加上牛奶的价格
        return super.getCost() + 3.0; // 牛奶3元
    }

    @Override
    public String getDescription() {
        // 在被装饰对象的描述基础上，加上“加牛奶”
        return super.getDescription() + ", 加牛奶";
    }
}

// 4. ConcreteDecorator (具体装饰器) - 糖
class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public double getCost() {
        return super.getCost() + 1.0; // 糖1元
    }

    @Override
    public String getDescription() {
        return super.getDescription() + ", 加糖";
    }
}

// 客户端调用
public class CoffeeShop {
    public static void main(String[] args) {
        // 点一杯最简单的咖啡
        Coffee myCoffee = new SimpleCoffee();
        System.out.println(myCoffee.getDescription() + " - 价格: " + myCoffee.getCost());

        System.out.println("--------------------");

        // 现在给它加点牛奶
        myCoffee = new MilkDecorator(myCoffee);
        System.out.println(myCoffee.getDescription() + " - 价格: " + myCoffee.getCost());
        
        System.out.println("--------------------");

        // 再加点糖
        myCoffee = new SugarDecorator(myCoffee);
        System.out.println(myCoffee.getDescription() + " - 价格: " + myCoffee.getCost());
        
        System.out.println("--------------------");

        // 直接点一杯加了牛奶又加了糖的咖啡
        Coffee anotherCoffee = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
        System.out.println(anotherCoffee.getDescription() + " - 价格: " + anotherCoffee.getCost());
    }
}
```
**运行结果：**
```
黑咖啡 - 价格: 10.0
--------------------
黑咖啡, 加牛奶 - 价格: 13.0
--------------------
黑咖啡, 加牛奶, 加糖 - 价格: 14.0
--------------------
黑咖啡, 加牛奶, 加糖 - 价格: 14.0
```

---

### 四、 优缺点与适用场景

#### 优点
1.  **高度灵活性：** 可以在运行时动态地添加或删除功能，比静态继承灵活得多。
2.  **遵循开闭原则：** 可以通过增加新的装饰器类来扩展功能，而无需修改现有的具体组件类。
3.  **避免子类爆炸：** 用少量的类就能实现各种功能的自由组合。
4.  **职责分离：** 每个装饰器只关心自己的那部分功能，符合单一职责原则。

#### 缺点
1.  **产生许多小对象：** 过度使用会产生大量细粒度的对象，增加系统的复杂性。
2.  **调试困难：** 对于一个被多次装饰的对象，排查问题时需要逐层深入，可能会比较困难。

#### 适用场景
1.  **在不影响其他对象的情况下，以动态、透明的方式给单个对象添加职责。**
2.  **当不能采用继承的方式来扩展功能时**，例如类被声明为 `final`，或者需要扩展的功能组合太多。
3.  **实际应用案例：**
    *   **Java I/O 流** 是最经典的例子。`FileInputStream` 是具体组件，`BufferedInputStream`、`DataInputStream` 等都是装饰器，它们给原始的字节流增加了缓冲、读取基本数据类型等功能。
    *   `java.util.Collections` 中的 `checkedList()`, `synchronizedList()`, `unmodifiableList()` 等方法，它们返回的都是原 `List` 的一个装饰器版本，增加了类型检查、线程同步、不可修改等功能。
    *   GUI框架中为窗口、按钮等组件动态添加边框、滚动条、阴影等效果。