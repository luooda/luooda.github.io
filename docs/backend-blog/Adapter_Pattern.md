---
title: 适配器模式
createTime: 2025/06/20 03:17:29
permalink: /article/q3bxuq5x/
tags:
- 设计模式
- 结构型模式
---

适配器模式是一个非常直观且实用的结构型模式。它的核心作用是**将一个类的接口转换成客户端所期望的另一个接口**，从而使那些原本由于接口不兼容而不能在一起工作的类可以协同工作。


### 一、 什么是适配器模式？

#### 1. 核心思想
当你有两个“模块”或“组件”，它们功能上是你需要的，但接口（方法名、参数、返回值等）却对不上，无法直接协作时，适配器模式就派上用场了。

它引入一个中间的“适配器”层，这个适配器：
*   **面向客户端：** 实现了客户端所期望的接口。
*   **面向被适配者：** 在内部持有对被适配者（Adaptee）的引用。
*   **核心工作：** 在其实现的方法中，将客户端的请求转换成对被适配者相应方法的调用。

#### 2. 通俗比喻：电源适配器/插头转换器
这是解释适配器模式最经典、最形象的比喻。
*   **客户端 (Client):** 你的笔记本电脑，它需要一个**两孔插座**来供电。
*   **被适配者 (Adaptee):** 墙上的**三孔插座**，它能提供电力，但接口不匹配。
*   **适配器 (Adapter):** 一个**三孔转两孔的插头转换器**。

**工作流程：**
1.  适配器的一端是两孔插头，可以插到你的笔记本电脑上（**实现了客户端期望的接口**）。
2.  适配器的另一端是三孔插孔，可以接收来自墙上三孔插座的插头（**持有了被适配者**）。
3.  当你把这个组合插到墙上时，适配器就在内部完成了电流的转换和传导，让你的笔记本电脑成功获得了电力（**将请求进行了转换**）。

通过这个适配器，原本不兼容的笔记本和墙上插座就能协同工作了。

---

### 二、 适配器模式的实现方式

适配器模式主要有两种实现方式：**类适配器**和**对象适配器**。

#### 1. 类适配器模式 (Class Adapter)

*   **实现方式：** 通过**继承**来实现。适配器类**同时继承**被适配的类，并**实现**目标接口。
*   **前提：** 这种方式依赖于多重继承，所以在Java这种单继承语言中，适配器必须继承一个具体的类（Adaptee），而不是接口。这限制了它的使用场景。

##### a) 结构
*   **Target（目标接口）：** 客户端期望的接口。
*   **Adaptee（被适配者）：** 需要被适配的、接口不兼容的类。
*   **Adapter（适配器）：** 继承自 `Adaptee`，同时实现了 `Target` 接口。

##### b) 代码实例
场景：我们有一个只能说中文的人（被适配者），但需要让他和一个只会说英语的英国人（客户端）交流。

```java
// Target (目标接口) - 英国人期望的交流方式
interface EnglishSpeaker {
    String speakEnglish();
}

// Adaptee (被适配者) - 只会说中文的人
class ChinesePerson {
    public String speakChinese() {
        return "你好，世界！";
    }
}

// Adapter (适配器) - 一个会中英双语的翻译官
// 通过继承 ChinesePerson，并实现 EnglishSpeaker 接口
class TranslatorAdapter extends ChinesePerson implements EnglishSpeaker {
    @Override
    public String speakEnglish() {
        // 调用父类（被适配者）的方法，并进行转换
        String chinese = speakChinese();
        // 假设这里有一个翻译引擎
        String english = "Hello, World!"; // 翻译结果
        System.out.println("翻译官将 '" + chinese + "' 翻译为 '" + english + "'");
        return english;
    }
}

// 客户端 - 英国人
public class BritishClient {
    public void communicate(EnglishSpeaker speaker) {
        System.out.println("英国人听到了: " + speaker.speakEnglish());
    }

    public static void main(String[] args) {
        BritishClient client = new BritishClient();
        EnglishSpeaker translator = new TranslatorAdapter();
        client.communicate(translator);
    }
}
```

#### 2. 对象适配器模式 (Object Adapter) - 更常用

*   **实现方式：** 通过**组合（持有对象引用）**来实现。适配器类实现目标接口，并在内部持有一个被适配者类的实例。
*   **优点：** 更加灵活。因为组合比继承的耦合度更低，适配器可以适配一个类的任何子类。这是**推荐使用**的方式。

##### a) 结构
*   **Target（目标接口）：** 客户端期望的接口。
*   **Adaptee（被适配者）：** 需要被适配的、接口不兼容的类。
*   **Adapter（适配器）：** 实现了 `Target` 接口，并在内部持有 `Adaptee` 的一个实例。

##### b) 代码实例
我们用对象适配器的方式重构上面的例子。

```java
// Target 和 Adaptee 类与上面完全相同
interface EnglishSpeaker { String speakEnglish(); }
class ChinesePerson { public String speakChinese() { return "你好，世界！"; } }

// Adapter (适配器) - 现在通过组合的方式持有 ChinesePerson
class TranslatorAdapter implements EnglishSpeaker {
    // 持有被适配者对象的引用
    private ChinesePerson adaptee;

    public TranslatorAdapter(ChinesePerson adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public String speakEnglish() {
        // 调用被适配者实例的方法，并进行转换
        String chinese = adaptee.speakChinese();
        String english = "Hello, World!"; // 翻译结果
        System.out.println("翻译官将 '" + chinese + "' 翻译为 '" + english + "'");
        return english;
    }
}

// 客户端 - 英国人
public class BritishClient {
    public void communicate(EnglishSpeaker speaker) {
        System.out.println("英国人听到了: " + speaker.speakEnglish());
    }

    public static void main(String[] args) {
        BritishClient client = new BritishClient();
        // 创建被适配者实例
        ChinesePerson chinesePerson = new ChinesePerson();
        // 创建适配器，并将被适配者注入
        EnglishSpeaker translator = new TranslatorAdapter(chinesePerson);
        client.communicate(translator);
    }
}
```

---

### 三、 类适配器 vs. 对象适配器

| 特性 | 类适配器 | 对象适配器 (推荐) |
| :--- | :--- | :--- |
| **实现方式** | 继承 | 组合 |
| **耦合度** | 高。适配器与被适配者是父子关系。 | 低。适配器与被适配者是弱关联。 |
| **灵活性** | 差。无法适配一个类的子类。 | 好。可以适配被适配者及其所有子类。 |
| **重写行为** | 可以重写被适配者的方法。 | 不能重写被适配者的方法，只能通过其接口调用。 |

---

### 四、 优缺点与适用场景

#### 优点
1.  **兼容性好：** 可以让任何两个没有关联的类一起运行。
2.  **提高了类的复用性：** 可以复用一些已存在的、但接口不符合要求的类。
3.  **透明性：** 客户端可以调用同一接口，而完全不知道背后是适配器在工作，符合开闭原则（对客户端而言）。

#### 缺点
1.  **增加了系统复杂度：** 过多地使用适配器，会让系统非常零乱，不易整体进行把握。
2.  对于类适配器，由于语言限制（如Java单继承），使用场景受限。

#### 适用场景
1.  **系统需要使用现有的类，而这些类的接口不符合系统的需要时。**（最核心的场景）
2.  **想要创建一个可以复用的类，该类可以与一些不相关的类或不可预见的类协同工作。**
3.  **在设计后期，需要兼容老版本或第三方提供的、无法修改源码的组件时。**
4.  **实际应用案例：**
    *   `java.io.InputStreamReader` 就是一个适配器，它将 `InputStream`（字节流）适配成 `Reader`（字符流）。
    *   `java.util.Arrays.asList()` 方法，它将一个数组适配成一个 `List`。
    *   各种框架中用于连接不同版本API或集成第三方SDK的场景。