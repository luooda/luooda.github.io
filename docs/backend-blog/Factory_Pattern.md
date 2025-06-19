---
title: 工厂模式
createTime: 2025/06/20 03:09:03
permalink: /article/p2dblgp1/
tags:
- 设计模式
- 构建型模式
---

## 工厂模式

“工厂模式”其实不是指一个单一的模式，而是一个模式“家族”的总称。它们的核心思想都是一样的：**将对象的创建过程（实例化）封装起来，让客户端代码与具体的类解耦。**

想象一下，你不用亲自动手去组装一台电脑（`new Computer()`），而是去一家电脑工厂，告诉他们你想要什么配置，工厂就把组装好的电脑给你。这个“工厂”就是工厂模式的核心。

这个家族主要包含三个成员，难度和复杂度递增：

1.  **简单工厂模式 (Simple Factory Pattern)** - 最常用，但不是官方GoF设计模式。
2.  **工厂方法模式 (Factory Method Pattern)** - 官方GoF设计模式。
3.  **抽象工厂模式 (Abstract Factory Pattern)** - 官方GoF设计模式。

---

### 一、 简单工厂模式 (Simple Factory Pattern)

#### 1. 核心思想
创建一个专门的工厂类，它有一个创建方法。你向这个方法传入一个参数（比如一个字符串或枚举），它根据这个参数来决定创建并返回哪一种具体的产品实例。

#### 2. 通俗比喻
就像一个**咖啡店的点餐台**。你告诉店员（工厂）：“我想要一杯拿铁”或“我想要一杯美式”。店员根据你的要求（参数），去制作并给你相应的咖啡（产品）。

#### 3. 代码实例
场景：一个咖啡店可以制作拿铁（Latte）和美式（Americano）咖啡。

```java
// 1. 产品抽象接口
interface Coffee {
    String getName();
}

// 2. 具体产品类
class LatteCoffee implements Coffee {
    @Override
    public String getName() {
        return "拿铁咖啡";
    }
}

class AmericanoCoffee implements Coffee {
    @Override
    public String getName() {
        return "美式咖啡";
    }
}

// 3. 简单工厂类
class SimpleCoffeeFactory {
    // 静态方法，根据类型创建咖啡
    public static Coffee createCoffee(String type) {
        if ("latte".equalsIgnoreCase(type)) {
            return new LatteCoffee();
        } else if ("americano".equalsIgnoreCase(type)) {
            return new AmericanoCoffee();
        } else {
            throw new IllegalArgumentException("不支持的咖啡类型: " + type);
        }
    }
}

// 客户端调用
public class Client {
    public static void main(String[] args) {
        Coffee latte = SimpleCoffeeFactory.createCoffee("latte");
        System.out.println("点了一杯: " + latte.getName());

        Coffee americano = SimpleCoffeeFactory.createCoffee("americano");
        System.out.println("点了一杯: " + americano.getName());
    }
}
```

#### 4. 优缺点
*   **优点：**
    *   将对象的创建和使用完全分离，客户端无需关心具体产品的类名。
    *   结构简单，易于理解和使用。
*   **缺点：**
    *   **违反了开闭原则**。如果想增加一种新的咖啡（比如卡布奇诺），就必须**修改** `SimpleCoffeeFactory` 类的代码，在 `createCoffee` 方法中增加一个 `else if` 分支。
    *   工厂类的职责过重，所有产品的创建逻辑都集中在一个类中，不利于维护。

---

### 二、 工厂方法模式 (Factory Method Pattern)

#### 1. 核心思想
定义一个用于创建对象的**抽象工厂接口**，但将实际的创建工作**延迟到子类**中去完成。每个子类工厂负责创建一种具体的产品。

#### 2. 通俗比喻
不再是只有一个万能点餐台，而是开了**多家专卖店**。有一个“拿铁咖啡专卖店”（拿铁工厂）和一个“美式咖啡专卖店”（美式工厂）。你想喝拿铁，就去拿铁专卖店；想喝美式，就去美式专卖店。每个店（子类工厂）只负责生产自己的那一款产品。

#### 3. 代码实例
我们对上面的例子进行重构。

```java
// 产品接口和具体产品类 (与上面相同)
interface Coffee { String getName(); }
class LatteCoffee implements Coffee { /*...*/ }
class AmericanoCoffee implements Coffee { /*...*/ }

// 1. 抽象工厂接口
interface CoffeeFactory {
    Coffee createCoffee();
}

// 2. 具体工厂子类
class LatteCoffeeFactory implements CoffeeFactory {
    @Override
    public Coffee createCoffee() {
        return new LatteCoffee();
    }
}

class AmericanoCoffeeFactory implements CoffeeFactory {
    @Override
    public Coffee createCoffee() {
        return new AmericanoCoffee();
    }
}

// 客户端调用
public class Client {
    public static void main(String[] args) {
        // 想喝拿铁，就找拿铁工厂
        CoffeeFactory latteFactory = new LatteCoffeeFactory();
        Coffee latte = latteFactory.createCoffee();
        System.out.println("从拿铁工厂拿到一杯: " + latte.getName());

        // 想喝美式，就找美式工厂
        CoffeeFactory americanoFactory = new AmericanoCoffeeFactory();
        Coffee americano = americanoFactory.createCoffee();
        System.out.println("从美式工厂拿到一杯: " + americano.getName());
    }
}
```

#### 4. 优缺点
*   **优点：**
    *   **完美遵循了开闭原则**。如果想增加卡布奇诺，只需要新增 `CappuccinoCoffee` 类和 `CappuccinoCoffeeFactory` 类即可，无需修改任何现有代码。
    *   每个工厂只负责一个产品，职责清晰。
    *   客户端代码与具体产品解耦。
*   **缺点：**
    *   每增加一个产品，就需要相应地增加一个工厂类，导致系统中的**类数量成倍增加**，增加了系统的复杂度和代码量。

---

### 三、 抽象工厂模式 (Abstract Factory Pattern)

#### 1. 核心思想
提供一个接口，用于创建**一系列相关或相互依赖的对象（一个产品族）**，而无需指定它们具体的类。这是“工厂的工厂”。

#### 2. 通俗比喻
现在不是卖单品了，而是卖**“套餐”**。比如有一个“意式风情套餐工厂”，它能生产“拿铁咖啡”和“提拉米苏蛋糕”；还有一个“美式经典套餐工厂”，它能生产“美式咖啡”和“布朗尼蛋糕”。你只需要选择一个套餐工厂，就能得到一整套风格匹配的产品。

#### 3. 代码实例
场景：咖啡店现在不仅卖咖啡，还卖甜点，并且希望咖啡和甜点能搭配成套餐。

```java
// 1. 抽象产品接口
interface Coffee { String getName(); }
interface Dessert { String getName(); }

// 2. 具体产品类
class LatteCoffee implements Coffee { /*...*/ }
class AmericanoCoffee implements Coffee { /*...*/ }
class Tiramisu implements Dessert { public String getName() { return "提拉米苏"; } }
class Brownie implements Dessert { public String getName() { return "布朗尼"; } }

// 3. 抽象工厂接口 (定义了能生产哪些产品)
interface DessertFactory {
    Coffee createCoffee();
    Dessert createDessert();
}

// 4. 具体工厂子类 (定义了具体生产什么风格的产品)
class ItalianDessertFactory implements DessertFactory {
    @Override
    public Coffee createCoffee() {
        return new LatteCoffee();
    }
    @Override
    public Dessert createDessert() {
        return new Tiramisu();
    }
}

class AmericanDessertFactory implements DessertFactory {
    @Override
    public Coffee createCoffee() {
        return new AmericanoCoffee();
    }
    @Override
    public Dessert createDessert() {
        return new Brownie();
    }
}

// 客户端调用
public class Client {
    public static void main(String[] args) {
        System.out.println("--- 顾客A选择意式套餐 ---");
        DessertFactory italianFactory = new ItalianDessertFactory();
        Coffee italianCoffee = italianFactory.createCoffee();
        Dessert italianDessert = italianFactory.createDessert();
        System.out.println("获得: " + italianCoffee.getName() + " 和 " + italianDessert.getName());

        System.out.println("\n--- 顾客B选择美式套餐 ---");
        DessertFactory americanFactory = new AmericanDessertFactory();
        Coffee americanCoffee = americanFactory.createCoffee();
        Dessert americanDessert = americanFactory.createDessert();
        System.out.println("获得: " + americanCoffee.getName() + " 和 " + americanDessert.getName());
    }
}
```

#### 4. 优缺点
*   **优点：**
    *   **隔离了具体类的创建**，客户端只与抽象接口交互。
    *   **易于交换产品族**。想把整个系统从“意式风格”切换到“美式风格”，只需要更换具体的工厂实例即可。
    *   **保证了产品之间的兼容性**。一个具体工厂生产出来的产品，一定是互相匹配的。
*   **缺点：**
    *   **扩展新的产品等级非常困难**。如果想给所有套餐都增加一个“茶（Tea）”的选项，就必须修改抽象工厂 `DessertFactory` 接口，这会导致所有实现了该接口的子类工厂都要进行修改，违反了开闭原则。这是它最主要的弊端。
    *   系统结构最复杂，需要理解和维护的类最多。

### 总结对比

| 特性 | 简单工厂模式 | 工厂方法模式 | 抽象工厂模式 |
| :--- | :--- | :--- | :--- |
| **核心** | 一个工厂类，根据参数创建不同产品 | 定义创建接口，由子类工厂创建产品 | 定义接口，创建**一系列**相关的产品 |
| **产品关系** | 单一产品 | 单一产品 | **产品族（套餐）** |
| **复杂度** | ★☆☆ | ★★☆ | ★★★ |
| **开闭原则** | **违反** | **遵守** | 对**新增产品族**遵守，对**新增产品等级**违反 |
| **适用场景** | 产品种类少，不经常变化的简单场景 | 单一产品需要扩展，系统设计遵循开闭原则 | 需要创建一系列相互关联、风格统一的产品时 |