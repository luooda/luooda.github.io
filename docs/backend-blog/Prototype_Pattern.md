---
title: 原型模式
createTime: 2025/06/20 03:10:36
permalink: /article/6ilqorlc/
tags:
- 设计模式
- 构建型模式
---

原型模式是一种非常独特的创建型模式。与工厂模式家族不同，它不是通过一个专门的类来创建对象，而是通过**复制（克隆）一个已存在的实例**来创建新的对象。


### 一、 什么是原型模式？

#### 1. 核心思想
> **指定创建对象的种类，通过拷贝这些原型创建新的对象。**

简单来说，就是不通过 `new` 关键字来创建对象，而是找到一个“原型”对象，然后调用它的“克隆”方法，得到一个一模一样的新对象。之后你可以根据需要对这个新对象进行修改。

#### 2. 通俗比喻
这就像**细胞分裂**或者使用**复印机**。
*   **细胞分裂：** 一个细胞（原型）可以分裂成一个和它完全相同的新细胞（克隆体），而不需要从头开始合成一个细胞。
*   **复印文件：** 你有一份填好的、格式复杂的申请表（原型）。当另一个人也需要填表时，你不需要给他一张白纸让他从头画线、写标题，而是直接把你的申请表复印一份（克隆）给他，他只需要修改个人信息部分即可。

---

### 二、 为什么要使用原型模式？

原型模式主要解决的问题是：**在某些场景下，通过 `new` 关键字来创建一个对象的过程非常“昂贵”或“复杂”。**

这些“昂贵”的场景包括：

1.  **资源消耗大：** 创建一个对象需要占用大量的CPU或内存资源。
2.  **初始化过程繁琐：** 创建对象需要经过一系列复杂的计算，或者依赖于外部资源（如读取配置文件、查询数据库、网络调用等），耗时较长。
3.  **类层次结构复杂：** 一个类有多个子类，你需要根据不同情况创建不同子类的实例，如果用工厂模式可能会导致工厂类很庞大。

在这些情况下，如果已经有一个创建好的实例，那么通过内存中的二进制流直接拷贝来创建一个新对象，会比重新执行一遍复杂的初始化过程要快得多。

---

### 三、 如何实现原型模式？（附Java代码实例）

在Java中，实现原型模式通常需要借助 `Cloneable` 接口和 `Object` 类中的 `clone()` 方法。

#### 1. 关键组件
*   **Prototype（原型接口）：** 一个声明了克隆方法的接口。在Java中，通常就是 `java.lang.Cloneable` 接口，它是一个标记接口，表示该类的对象是“可以被克隆的”。
*   **ConcretePrototype（具体原型类）：** 实现了原型接口的类，它需要重写 `Object` 类的 `clone()` 方法来返回自身的拷贝。
*   **Client（客户端）：** 获取一个原型对象，然后调用其克隆方法来创建新对象。

#### 2. 代码实例
场景：我们有一个游戏，需要创建大量的怪物（Monster）对象。怪物的创建过程可能很复杂（比如加载模型、纹理等）。

```java
// 1. 让我们的原型类实现 Cloneable 接口
// 这是一个抽象类，定义了所有怪物的共同行为
abstract class Monster implements Cloneable {
    private String id;
    protected String type;

    abstract void attack();

    // getter 和 setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }

    // 2. 重写 Object 类的 clone() 方法
    @Override
    public Object clone() {
        Object clone = null;
        try {
            // super.clone() 是一个浅拷贝过程
            clone = super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return clone;
    }
}

// 3. 创建具体原型类
class Slime extends Monster {
    public Slime() {
        this.type = "史莱姆";
        // 假设这里有一些复杂的初始化过程
        System.out.println("史莱姆原型创建成功！");
    }

    @Override
    void attack() {
        System.out.println("史莱姆发起了撞击！");
    }
}

class Dragon extends Monster {
    public Dragon() {
        this.type = "巨龙";
        System.out.println("巨龙原型创建成功！");
    }

    @Override
    void attack() {
        System.out.println("巨龙喷出了火焰！");
    }
}

// 4. (可选但常用) 创建一个原型管理器来存储和获取原型
import java.util.Hashtable;

class MonsterCache {
    private static Hashtable<String, Monster> monsterMap = new Hashtable<>();

    // 从数据库或配置文件加载原型，并存储在缓存中
    public static void loadCache() {
        Slime slime = new Slime();
        slime.setId("M01");
        monsterMap.put(slime.getId(), slime);

        Dragon dragon = new Dragon();
        dragon.setId("M02");
        monsterMap.put(dragon.getId(), dragon);
    }

    public static Monster getMonster(String monsterId) {
        Monster cachedMonster = monsterMap.get(monsterId);
        // 关键！返回的是原型的克隆体，而不是原型本身
        return (Monster) cachedMonster.clone();
    }
}

// 客户端调用
public class GameClient {
    public static void main(String[] args) {
        // 游戏开始时，加载所有原型
        MonsterCache.loadCache();
        System.out.println("--------------------");

        // 需要一只史莱姆
        Monster monster1 = MonsterCache.getMonster("M01");
        System.out.println("获得怪物: " + monster1.getType() + ", ID: " + monster1.getId());
        monster1.attack();

        // 需要另一只史莱姆
        Monster monster2 = MonsterCache.getMonster("M01");
        System.out.println("获得怪物: " + monster2.getType() + ", ID: " + monster2.getId());
        
        // 需要一只巨龙
        Monster monster3 = MonsterCache.getMonster("M02");
        System.out.println("获得怪物: " + monster3.getType() + ", ID: " + monster3.getId());

        // 验证克隆体是不同的对象
        System.out.println("monster1 == monster2 ? " + (monster1 == monster2));
    }
}
```
**运行结果：**
```
史莱姆原型创建成功！
巨龙原型创建成功！
--------------------
获得怪物: 史莱姆, ID: M01
史莱姆发起了撞击！
获得怪物: 史莱姆, ID: M01
获得怪物: 巨龙, ID: M02
monster1 == monster2 ? false
```
可以看到，构造函数（复杂的创建过程）只在 `loadCache()` 时被调用了一次。后续获取怪物都是通过 `clone()` 完成的，速度非常快，并且每次都得到的是一个全新的对象。

---

### 四、 核心问题：浅拷贝 vs. 深拷贝

这是原型模式中**最重要、也最容易出错**的地方。`Object` 类的 `clone()` 方法默认执行的是**浅拷贝（Shallow Copy）**。

*   **浅拷贝 (Shallow Copy):**
    *   **基本数据类型：** 拷贝值。
    *   **引用数据类型：** 只拷贝引用（内存地址），而不拷贝引用所指向的对象。
    *   **结果：** 克隆体和原型中的引用类型字段，指向的是**同一个对象**。修改其中一个，会影响到另一个。

*   **深拷贝 (Deep Copy):**
    *   **基本数据类型：** 拷贝值。
    *   **引用数据类型：** 递归地拷贝引用所指向的对象，直到所有对象都被复制了一份。
    *   **结果：** 克隆体和原型完全独立，互不影响。

#### 如何实现深拷贝？
你需要重写 `clone()` 方法，并在其中手动对所有引用类型的字段也进行一次克隆。

**示例：** 假设怪物有一个 `Weapon`（武器）对象。

```java
class Weapon implements Cloneable {
    String name;
    // ...
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

abstract class Monster implements Cloneable {
    // ...
    Weapon weapon; // 引用类型字段

    @Override
    public Object clone() {
        Monster clone = null;
        try {
            // 1. 先进行浅拷贝
            clone = (Monster) super.clone();
            // 2. 对引用类型的字段，手动进行深拷贝
            if (this.weapon != null) {
                clone.weapon = (Weapon) this.weapon.clone();
            }
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return clone;
    }
}
```

---

### 五、 优缺点与适用场景

#### 优点
1.  **性能优异：** 当创建对象成本高时，直接从内存拷贝比 `new` 效率高得多。
2.  **简化对象创建：** 隐藏了复杂的创建逻辑，客户端只需调用 `clone()` 即可。
3.  **灵活性高：** 可以在运行时动态地获取和设置原型对象，从而改变要创建的对象类型。

#### 缺点
1.  **需要为每个类配备克隆方法：** 这对于已经存在的、没有实现 `Cloneable` 接口的类来说，改造起来比较麻烦。
2.  **深拷贝实现复杂：** 在处理复杂的对象引用关系时，正确地实现深拷贝可能非常困难，需要对每个引用对象都进行递归克隆。

#### 适用场景
1.  **类初始化消耗资源较多**的场景。
2.  通过 `new` 产生一个对象需要非常繁琐的数据准备或访问权限。
3.  一个对象需要提供给其他对象访问，但同时又希望保护自身状态不被修改，此时可以返回一个克隆体给调用者。
4.  **动态配置**的场景，比如在一个框架中，可以通过配置文件指定要使用的原型实例，然后框架通过克隆这个实例来工作。