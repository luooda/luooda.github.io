---
title: 迪米特法则
createTime: 2025/06/20 03:00:19
permalink: /article/errtgte0/
tags:
- 设计模式
---


### 一、 什么是迪米特法则 (LoD)？

#### 1. 核心定义

> **一个对象应该对其他对象有尽可能少的了解。**
> (Each unit should have only limited knowledge about other units: only units "closely" related to the current unit.)

#### 2. 通俗解释：不要和“陌生人”说话

迪米特法则有一个非常著名的比喻：**“只和你的直接朋友交谈，不要和朋友的朋友（陌生人）说话。”**

在面向对象的世界里，这意味着一个方法 `m` 属于对象 `O`，那么在方法 `m` 的内部，它只应该调用以下这几类对象的成员方法：

1.  **对象 `O` 本身**（`this`）。
2.  **作为方法 `m` 的参数传入的对象。**
3.  **在方法 `m` 内部创建的对象。**
4.  **对象 `O` 的直接成员/组件对象**（实例变量）。

**一句话概括：** 如果你想调用一个方法，要么是自己的，要么是朋友的，但绝对不要去调用朋友的朋友的方法。

#### 3. 什么是“朋友的朋友”？

在代码中，这通常表现为一长串的 `get` 方法调用，也就是所谓的**“火车失事”代码（Train Wreck）**：
`object.getA().getB().getC().doSomething();`

在这个例子中：
*   `object` 是你的**直接朋友**。
*   `getA()` 返回的对象 `A` 是你朋友的**朋友**。
*   `getB()` 返回的对象 `B` 是你朋友的朋友的**朋友**。

你为了完成一个任务，深入到了另一个对象（`object`）的内部结构中，这严重违反了迪米-特法则。

---

### 二、 代码实例：顾客结账

#### 场景
一个顾客（`Customer`）有一张银行卡（`Card`），卡里有余额。现在收银员（`Cashier`）需要向这位顾客收费。

#### 1. 违反LoD的设计 (不好的设计)

在这个设计中，收银员 `Cashier` 知道了太多关于 `Customer` 的内部结构（即顾客有一张卡）。

```java
// 朋友的朋友：银行卡
class Card {
    private double balance = 1000.0;

    public double getBalance() {
        return balance;
    }

    public void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
            System.out.println("成功取款: " + amount + "，剩余余额: " + balance);
        } else {
            System.out.println("余额不足！");
        }
    }
}

// 直接朋友：顾客
class Customer {
    // Customer 拥有一个 Card，这是它的内部细节
    private Card card = new Card();

    public Card getCard() {
        return card;
    }
}

// 调用者：收银员
class Cashier {
    // 这个方法违反了迪米特法则
    public void charge(Customer customer, double amount) {
        // 1. 从 customer 获取 card (获取朋友的朋友)
        Card card = customer.getCard(); 
        
        // 2. 直接操作这个“陌生人”对象
        if (card.getBalance() >= amount) {
            card.withdraw(amount);
            System.out.println("收银员成功收款: " + amount);
        } else {
            System.out.println("收银员发现顾客余额不足，收款失败。");
        }
    }
}
```

**问题分析：**

*   **代码是“火车失事”风格的：** `customer.getCard().withdraw(amount)`（虽然这里分了两步写，但本质是一样的）。
*   **高耦合：** `Cashier` 类不仅依赖于 `Customer` 类，还依赖于 `Card` 类。它知道了 `Customer` 是通过 `Card` 来付款的。
*   **破坏封装：** `Customer` 的内部支付方式（用卡支付）被暴露给了 `Cashier`。
*   **可维护性差：** 如果未来 `Customer` 的支付方式变了，比如增加了微信支付 `WeChatPay`，那么 `Cashier` 类的 `charge` 方法就必须被**修改**！它需要增加逻辑来判断顾客到底是用卡还是用微信支付，这违反了开闭原则。

---

#### 2. 遵循LoD的重构 (好的设计)

我们应该让 `Customer` 自己处理自己的事情（如何付款），`Cashier` 只需要告诉 `Customer` “请付钱”即可。

**第1步：在“直接朋友”类中封装行为**

在 `Customer` 类中添加一个 `pay` 方法，把与 `Card` 的交互封装在内部。

```java
// 银行卡类保持不变
class Card {
    // ... (同上)
}

// 直接朋友：顾客
class Customer {
    private Card card = new Card();
    // 也可以有其他支付方式，比如 private WeChatPay wechatPay;

    // 关键！提供一个高层服务，隐藏内部实现
    public boolean pay(double amount) {
        // Customer 自己和自己的“直接朋友”（card）打交道
        if (card.getBalance() >= amount) {
            card.withdraw(amount);
            return true; // 支付成功
        }
        return false; // 支付失败
    }
}

// 调用者：收银员
class Cashier {
    // 这个方法现在遵循了迪米特法则
    public void charge(Customer customer, double amount) {
        // 只和“直接朋友”Customer 交互，告诉它做事
        boolean success = customer.pay(amount);
        
        if (success) {
            System.out.println("收银员成功收款: " + amount);
        } else {
            System.out.println("收银员被告知支付失败。");
        }
    }
}
```

**优势分析：**

*   **低耦合：** `Cashier` 现在只依赖于 `Customer`，它完全不知道 `Card` 的存在。
*   **强封装：** `Customer` 如何付款是它自己的秘密。`Cashier` 只关心支付的结果（成功或失败）。
*   **高可维护性和扩展性：** 如果 `Customer` 以后想用微信支付，只需要修改 `Customer` 类内部的 `pay` 方法即可，`Cashier` 类**完全不需要任何改动**。

```java
// 比如，Customer 类可以这样修改，而 Cashier 不受影响
class Customer {
    private Card card = new Card();
    private WeChatPay wechatPay = new WeChatPay();
    
    public boolean pay(double amount) {
        // 可以在内部自己决定用哪种方式支付
        if (wechatPay.isAvailable()) {
            return wechatPay.processPayment(amount);
        } else {
            // ... 用卡支付的逻辑 ...
        }
    }
}
```

### 总结

| | 违反 LoD 的设计 | 遵循 LoD 的设计 |
| :--- | :--- | :--- |
| **核心思想** | 我要深入了解你，然后自己动手。 | 我不关心你怎么做，你把事给我办好就行。 |
| **代码特征** | `a.getB().getC().doSomething()` | `a.doSomething()` |
| **耦合关系** | 调用者与多个类（朋友、朋友的朋友）耦合 | 调用者只与直接朋友耦合 |
| **封装性** | 差，内部实现细节暴露 | 好，内部实现被隐藏 |
| **维护性** | 差，一个内部改动可能引发连锁反应 | 好，改动被限制在单个类内部 |

迪米特法则是一个旨在降低类之间耦合度的指导原则。通过让每个对象只与它的“直接朋友”通信，我们可以创建出更加独立、健壮和易于维护的模块，这使得整个软件系统更加灵活和稳定。