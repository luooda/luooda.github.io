---
title: 组合模式
createTime: 2025/06/20 03:26:34
permalink: /article/tcnz3zyl/
tags:
- 设计模式
- 结构型模式
---
### 1. 一句话概括
组合模式是一种结构型设计模式，它**将对象组合成树形结构以表示“部分-整体”的层次结构**，使得客户端对单个对象（叶子节点）和组合对象（容器节点）的使用具有一致性。

---

### 2. 生活中的比喻：公司组织架构

想象一下公司的组织结构图：
*   **CEO**
    *   **技术部 (部门)**
        *   张三 (程序员)
        *   李四 (程序员)
    *   **市场部 (部门)**
        *   王五 (市场专员)
        *   赵六 (市场专员)
        *   **华南区 (子部门)**
            *   孙七 (销售)

在这个结构中：
*   **普通员工**（如张三、王五）是**叶子节点（Leaf）**。他们不能再包含其他下属。
*   **部门/子部门**（如技术部、华南区）是**容器节点（Composite）**。它们可以包含员工，也可以包含其他子部门。

**组合模式的核心思想**：无论是一个普通员工，还是一个部门，它们都有一些共同的行为。比如，计算薪资成本。
*   一个员工的薪资成本就是他自己的工资。
*   一个部门的薪资成本是该部门下所有员工和所有子部门的薪资成本之和。

组合模式允许你用同样的方式对待“员工”和“部门”。你可以对公司里的任何一个单元（不管是个人还是整个部门）调用 `calculateSalary()` 方法，而无需编写 `if-else` 来判断它到底是个人还是部门。

---

### 3. 解决的问题：处理树形结构的复杂性

当处理像文件系统、GUI窗口、组织架构这样的树形结构时，我们经常需要区分两种对象：
1.  **基本对象（Primitive Objects）**：树的叶子，不能再分解。
2.  **容器对象（Container Objects）**：树的枝干，可以包含基本对象和其他容器对象。

**问题**：如果客户端代码需要遍历这个树形结构并执行操作，它通常需要写大量的条件判断逻辑来区分当前处理的是叶子节点还是容器节点。

```java
// 伪代码，展示了不使用组合模式的麻烦
void processNode(Object node) {
    if (node instanceof Employee) {
        // 处理员工的逻辑
    } else if (node instanceof Department) {
        // 处理部门的逻辑
        // 并且需要递归处理部门下的所有子节点
        for (Object child : ((Department)node).getChildren()) {
            processNode(child);
        }
    }
}
```
这样的代码非常笨拙，且违反了开闭原则。每当你增加一种新的节点类型，就需要修改这个方法。

**组合模式的解决方案**：
创建一个**统一的组件接口（Component）**，让叶子节点（Leaf）和容器节点（Composite）都实现这个接口。这样，客户端就可以通过这个统一接口来操作树中的所有对象，而无需关心其具体类型。

![Composite Pattern UML](https://refactoringguru.cn/images/patterns/diagrams/composite/structure-zh-2x.png)

---

### 4. 组合模式的结构与参与者

1.  **Component (组件)**
    *   是组合中所有对象的抽象基类（或接口）。
    *   声明了叶子节点和容器节点共有的接口，如 `operation()`。
    *   （可选）可以声明用于管理子组件的接口，如 `add()`, `remove()`, `getChild()`。

2.  **Leaf (叶子)**
    *   表示树结构中的叶子节点对象，它没有子节点。
    *   实现了 `Component` 接口中定义的操作。
    *   对于管理子组件的方法（如`add`, `remove`），它通常会抛出异常或什么都不做。

3.  **Composite (容器/组合)**
    *   表示树结构中的容器节点，可以包含子节点（可以是 Leaf 或其他 Composite）。
    *   实现了 `Component` 接口。
    *   它实现了管理子组件的方法（`add`, `remove`等）。
    *   它对 `operation()` 的实现通常是**递归**的，即遍历其所有子组件，并调用子组件的 `operation()` 方法。

4.  **Client (客户端)**
    *   通过 `Component` 接口与组合结构中的对象交互，无需区分叶子和容器。

---

### 5. Java 代码示例（文件系统）

让我们用最经典的文件系统例子来实现组合模式。一个文件夹可以包含文件和其他文件夹。

#### 步骤1: 创建组件接口 (Component)

```java
// Component: 定义了文件和文件夹的通用行为
public interface FileSystemNode {
    String getName();
    void print(String prefix); // 打印名称，并用前缀来表示层级
}
```

#### 步骤2: 创建叶子类 (Leaf)

```java
// Leaf: 文件类
public class File implements FileSystemNode {
    private String name;

    public File(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void print(String prefix) {
        System.out.println(prefix + "- " + name);
    }
}
```

#### 步骤3: 创建容器类 (Composite)

```java
import java.util.ArrayList;
import java.util.List;

// Composite: 文件夹类
public class Folder implements FileSystemNode {
    private String name;
    private List<FileSystemNode> children = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public void addNode(FileSystemNode node) {
        children.add(node);
    }

    public void removeNode(FileSystemNode node) {
        children.remove(node);
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void print(String prefix) {
        // 1. 打印自己的名字
        System.out.println(prefix + "+ " + name);
        // 2. 递归打印所有子节点
        for (FileSystemNode node : children) {
            node.print(prefix + "  "); // 增加缩进
        }
    }
}
```

#### 步骤4: 客户端调用

```java
public class CompositePatternDemo {
    public static void main(String[] args) {
        // 创建树形结构
        Folder root = new Folder("root");
        Folder documents = new Folder("Documents");
        Folder music = new Folder("Music");

        File report = new File("report.docx");
        File notes = new File("notes.txt");
        File song1 = new File("song1.mp3");
        File song2 = new File("song2.mp3");

        // 组合对象
        root.addNode(documents);
        root.addNode(music);

        documents.addNode(report);
        documents.addNode(notes);

        music.addNode(song1);
        music.addNode(song2);
        
        // 客户端只需要与根节点交互，就能处理整个树
        System.out.println("Printing file system structure:");
        root.print("");
    }
}
```

**输出结果**:
```
Printing file system structure:
+ root
  + Documents
    - report.docx
    - notes.txt
  + Music
    - song1.mp3
    - song2.mp3
```
客户端代码非常干净，它只调用了根节点的 `print` 方法，整个树的遍历和打印逻辑被封装在了 `Folder` 和 `File` 类中。

---

### 6. 透明方式 vs. 安全方式

这是一个关于组合模式的经典设计权衡。问题在于：管理子组件的方法（`add`, `remove`）应该放在哪里？

*   **透明方式 (Transparent Mode)**：将 `add`, `remove` 等方法声明在 `Component` 接口中。
    *   **优点**：对客户端完全透明。客户端可以对任何 `Component` 对象调用 `add`，无需关心它是叶子还是容器。
    *   **缺点**：不安全。`Leaf` 类也继承了这些方法，但它不能有子节点，所以只能抛出异常或空实现，这违反了接口隔离原则。

*   **安全方式 (Safe Mode)**：只在 `Composite` 类中声明 `add`, `remove` 等方法。
    *   **优点**：类型安全。`Leaf` 类不会有它不支持的方法。
    *   **缺点**：对客户端不透明。客户端在想添加子节点时，必须先判断当前对象是不是 `Composite` 类型，这又回到了 `instanceof` 的老路。

**我们的代码示例采用的是安全方式**，因为 `addNode` 只在 `Folder` 中。在大多数情况下，**透明方式更受欢迎**，因为它更符合组合模式的初衷——让客户端统一对待所有对象。

---

### 7. 优缺点

#### 优点
1.  **简化客户端代码**：客户端可以一致地使用组合结构中的所有对象，无需关心其具体类型。
2.  **易于增加新类型的组件**：可以很容易地增加新的 `Leaf` 或 `Composite` 子类，而无需修改现有代码，符合开闭原则。
3.  **定义了包含基本对象和组合对象的类层次结构**：清晰地表达了“部分-整体”的关系。

#### 缺点
1.  **使设计变得过于通用**：有时候，你可能想限制一个 `Composite` 对象中能包含的组件类型（例如，一个“图片文件夹”只能包含“图片文件”），而组合模式的标准实现不支持这种限制，需要额外代码来处理。
2.  **实现可能比较困难**：尤其是在处理“透明方式 vs. 安全方式”的权衡时。

### 8. 适用场景

1.  当你想表示对象的“部分-整体”层次结构时（即树形结构）。
2.  当你希望客户端能够统一处理组合结构中的所有对象，而忽略其差异时。
3.  典型的应用场景：
    *   **GUI 系统**：一个窗口（`Panel`）可以包含按钮（`Button`）、文本框（`TextBox`），也可以包含其他面板。
    *   **文件系统**：文件夹和文件。
    *   **组织架构**：部门和员工。
    *   **文档结构**：段落、图片、表格等元素。