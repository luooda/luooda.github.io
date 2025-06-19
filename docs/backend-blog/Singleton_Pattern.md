---
title: 单例模式
createTime: 2025/06/20 03:06:48
permalink: /article/6tg9zln8/
tags:
- 设计模式
- 构建型模式
---
单例模式是设计模式中最简单、最著名，也最常被讨论的模式之一。它属于**创建型模式**，其核心作用是确保一个类在任何情况下都绝对只有一个实例，并提供一个全局访问点来获取这个唯一的实例。


### 一、 什么是单例模式？

#### 1. 核心思想

想象一下，系统中有一些组件是“全局唯一”的，比如一个管理所有程序配置的`ConfigurationManager`，或者一个记录系统运行日志的`Logger`。如果系统中出现了多个这样的实例，可能会导致数据不一致、资源浪费或者行为错乱。

单例模式就是为了解决这个问题而生的。它通过特定的实现手法，强制一个类只能被实例化一次。

#### 2. 关键要点

要实现一个标准的单例模式，通常需要满足以下三个条件：

1.  **私有化构造函数 (Private Constructor):** 为了防止外部代码通过 `new` 操作符随意创建类的实例，必须将构造函数声明为私有的。
2.  **持有私有的静态实例 (Private Static Instance):** 在类的内部，必须持有一个自身的静态实例。这个实例是独一无二的。
3.  **提供公有的静态访问方法 (Public Static Access Method):** 必须提供一个全局唯一的公共静态方法（通常命名为 `getInstance()`），用于返回那个唯一的实例。

---

### 二、 如何实现单例模式？（附Java代码实例）

单例模式的实现方式有很多种，主要分为两大流派：**饿汉式**和**懒汉式**。它们的核心区别在于：**实例是在类加载时就创建，还是在第一次被使用时才创建。**

#### 1. 饿汉式 (Eager Initialization)

饿汉式非常直接，它在类加载的时候就立即初始化实例。就像一个饿坏了的人，看到食物就立刻吃掉。

**特点：**
*   **优点：** 实现简单，而且是**线程安全**的。因为类的加载过程由JVM保证是线程安全的，所以实例在多线程环境下也不会被创建多次。
*   **缺点：** 无论这个实例后续是否被用到，它都会在类加载时被创建，可能会造成内存资源的浪费。如果实例的创建过程非常耗时，会拖慢应用的启动速度。

**代码实现：**

```java
// 饿汉式单例
public class SingletonEager {

    // 1. 持有私有的静态实例，在类加载时就直接创建
    private static final SingletonEager INSTANCE = new SingletonEager();

    // 2. 私有化构造函数
    private SingletonEager() {
        // 防止通过反射创建实例
        if (INSTANCE != null) {
            throw new IllegalStateException("Cannot create new instance of a singleton class.");
        }
    }

    // 3. 提供公有的静态访问方法
    public static SingletonEager getInstance() {
        return INSTANCE;
    }

    // 其他业务方法
    public void showMessage() {
        System.out.println("Hello from Eager Singleton!");
    }
}
```

#### 2. 懒汉式 (Lazy Initialization)

懒汉式非常“懒”，只有在第一次有人调用 `getInstance()` 方法时，它才会去检查实例是否存在，如果不存在，才创建实例。

**特点：**
*   **优点：** 实现了**延迟加载（Lazy Loading）**，节省了资源。只有在需要时才创建实例，可以加快应用的启动速度。
*   **缺点：** 在多线程环境下，简单的实现方式是**线程不安全**的，需要额外处理才能保证线程安全。

##### a) 基础懒汉式（线程不安全）

```java
// 懒汉式 - 线程不安全
public class SingletonLazyUnsafe {

    private static SingletonLazyUnsafe instance;

    private SingletonLazyUnsafe() {}

    public static SingletonLazyUnsafe getInstance() {
        // 在多线程环境下，多个线程可能同时通过这个if判断，导致创建多个实例
        if (instance == null) {
            instance = new SingletonLazyUnsafe();
        }
        return instance;
    }
}
```
**这种方式绝对不能在多线程环境中使用！**

##### b) 同步方法懒汉式（线程安全，但性能低）

通过给 `getInstance()` 方法加上 `synchronized` 关键字，可以保证线程安全，但代价是性能下降，因为每次调用都会进行同步。

```java
// 懒汉式 - 线程安全，但性能不佳
public class SingletonLazySynchronized {

    private static SingletonLazySynchronized instance;

    private SingletonLazySynchronized() {}

    // 使用 synchronized 关键字确保线程安全
    public static synchronized SingletonLazySynchronized getInstance() {
        if (instance == null) {
            instance = new SingletonLazySynchronized();
        }
        return instance;
    }
}
```

##### c) 双重检查锁定 (Double-Checked Locking, DCL) - 推荐的懒汉式

这是目前被广泛推荐的一种高效且线程安全的懒汉式实现。它结合了懒加载和高性能。

```java
// 懒汉式 - 双重检查锁定（推荐）
public class SingletonDCL {

    // 使用 volatile 关键字确保多线程下的可见性和禁止指令重排
    private static volatile SingletonDCL instance;

    private SingletonDCL() {}

    public static SingletonDCL getInstance() {
        // 第一次检查：如果实例已存在，直接返回，避免不必要的同步
        if (instance == null) {
            // 同步块：只在实例未创建时进入
            synchronized (SingletonDCL.class) {
                // 第二次检查：防止多个线程同时通过第一次检查后重复创建实例
                if (instance == null) {
                    instance = new SingletonDCL();
                }
            }
        }
        return instance;
    }
}
```
**关键点：**
*   `volatile` 关键字是必须的。它保证了当一个线程修改 `instance` 变量时，新值对其他线程是立即可见的，并且可以防止JVM的指令重排序优化，避免拿到一个“半初始化”的对象。

#### 3. 静态内部类 (Static Inner Class) - 最佳实践之一

这种方式结合了饿汉式和懒汉式的优点，是实现单例模式的**最佳实践**之一。

```java
// 静态内部类单例（推荐）
public class SingletonStaticInner {

    private SingletonStaticInner() {}

    // 1. 使用私有静态内部类来持有实例
    private static class SingletonHolder {
        private static final SingletonStaticInner INSTANCE = new SingletonStaticInner();
    }

    // 2. 提供公共访问方法
    public static SingletonStaticInner getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```
**工作原理：**
*   **懒加载：** 只要不调用 `getInstance()` 方法，`SingletonHolder` 内部类就不会被加载，其内部的 `INSTANCE` 也自然不会被创建。
*   **线程安全：** 当第一次调用 `getInstance()` 时，JVM会加载 `SingletonHolder` 类。类的加载过程是线程安全的，所以 `INSTANCE` 在创建时天然就是线程安全的，且只会创建一次。

---

### 三、 单例模式的优缺点

#### 优点

1.  **全局唯一访问点：** 确保了实例的唯一性，并提供一个易于访问的全局入口。
2.  **节约系统资源：** 由于只有一个实例，避免了对资源的重复占用，特别是在实例创建开销大的情况下（如数据库连接池）。
3.  **数据一致性：** 对于需要共享状态的组件（如配置管理器），单例模式可以保证所有部分访问的都是同一个状态，避免了数据不一致的问题。

#### 缺点

1.  **扩展性差：** 由于没有抽象层，单例类的扩展很困难（通常是 final 的，无法被继承）。
2.  **违反单一职责原则：** 一个类既要负责自己的业务逻辑，又要负责保证自己是单例的，这在一定程度上违反了单一职责原则。
3.  **可能隐藏依赖关系：** 代码中的任何地方都可以通过 `Singleton.getInstance()` 来获取实例，这使得类之间的依赖关系变得不清晰，不利于理解和测试。
4.  **对测试不友好：** 当需要测试一个依赖于单例的类时，很难用一个“模拟对象”（Mock Object）来替换那个单例实例，导致单元测试困难。

---

### 四、 应用场景

单例模式适用于以下场景：

*   **无状态的工具类：** 如日志记录器（Logger）、线程池（ThreadPool）。
*   **全局配置管理器：** 读取和管理整个应用程序的配置信息。
*   **数据库连接池：** 整个应用共享一个数据库连接池，避免频繁创建和销毁连接。
*   **操作系统级的资源管理器：** 如Windows的任务管理器、回收站，它们在整个系统中都只能有一个。
*   **网站计数器、Web应用的Application对象等。**