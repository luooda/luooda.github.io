---
title: Kafka
createTime: 2025/07/23 19:41:18
permalink: /article/0olhyyfn/

tags:
  - 软件安装
  - Kafka
  - 消息队列
---

# 告别 ZooKeeper：使用 Docker 和 KRaft 模式轻松部署 Kafka 3.x

## 前言

Apache Kafka 作为分布式流处理平台的王者，其强大性能毋庸置疑。然而，在过去很长一段时间里，它对 ZooKeeper 的依赖一直是部署和运维中的一个痛点。幸运的是，随着 KIP-500 的提出和实现，Kafka 迎来了内置的 KRaft (Kafka Raft) 模式，彻底摆脱了对 ZooKeeper 的依赖。

本教程将引导您：
1.  理解 KRaft 模式如何替代 ZooKeeper。
2.  使用 Docker Compose 部署一个基于 KRaft 模式的现代化、无 ZooKeeper 的 Kafka 3.7 环境。
3.  配置并使用 Kafka UI，一个强大的可视化管理工具。

## KRaft 模式：Kafka 的新时代

在深入实践之前，我们先来理解 KRaft 模式是如何工作的。

### ZooKeeper 的角色

在旧架构中，ZooKeeper 负责 Kafka 集群的元数据管理，包括：
*   **Broker 注册**：记录哪些 Broker 是存活的。
*   **Topic 配置**：存储 Topic、分区、副本等信息。
*   **Controller 选举**：在所有 Broker 中选举出一个 Leader (Controller) 负责集群管理。
*   **访问控制 (ACLs)**：管理用户权限。

### KRaft 如何替代 ZooKeeper

KRaft 模式将 ZooKeeper 的职责完全整合到了 Kafka 内部。它通过引入一个新的 **`controller` 角色**来实现这一点。

*   **元数据管理**：集群的元数据现在存储在一个名为 `__cluster_metadata` 的内部 Topic 中，由 Controller 节点管理。
*   **Controller 选举**：Controller 节点的选举和 Leader 保持通过内置的 Raft 一致性算法来完成，不再需要外部系统协调。

在我们的单节点部署中，我们会让同一个 Kafka 节点同时扮演 **`broker`** (负责消息处理) 和 **`controller`** (负责集群管理) 两个角色，从而实现一个完全自给自足的 Kafka 实例。

**优势**：
*   **简化架构**：减少了一个重量级的外部依赖，降低了部署和运维的复杂性。
*   **提升性能**：元数据传播更快，集群启动和恢复速度显著提升。
*   **更好的扩展性**：可以支持更多的分区。

## Kafka UI：强大的可视化管理工具

Kafka UI 是一个由 Provectus Labs 开发的开源 Web UI，它为 Kafka 提供了非常直观和强大的管理能力：

*   **多集群管理**：轻松连接和管理多个 Kafka 集群。
*   **Topic 浏览**：查看 Topic 列表、配置、分区和副本状态。
*   **消息探查**：实时查看 Topic 中的消息，支持多种数据格式（JSON, Avro, String）的解析。
*   **生产者/消费者管理**：监控消费者组的消费滞后 (Lag)。
*   **创建和管理**：通过 UI 直接创建和删除 Topic，管理 ACLs。

## 使用 Docker Compose 部署

现在，让我们通过 `docker-compose.yml` 文件来部署 Kafka 和 Kafka UI。

### `docker-compose.yml` 配置文件

```yaml
services:
  kafka:
    image: bitnami/kafka:3.7
    container_name: kafka
    ports:
      - "9092:9092"
    volumes:
      - kafka_data:/bitnami/kafka
    environment:
      # --- KRaft 模式核心配置 ---
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
      
      # --- 监听器 (Listeners) 配置 ---
      - KAFKA_CFG_LISTENERS=CONTROLLER://:9093,INTERNAL://:9094,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka:9094,EXTERNAL://localhost:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL

      # --- 其他配置 ---
      - KAFKA_HEAP_OPTS=-Xmx256m -Xms256m
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    networks:
      - kafka-net

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8088:8080"
    depends_on:
      - kafka
    environment:
      - KAFKA_CLUSTERS_0_NAME=local-kafka
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9094
    networks:
      - kafka-net

networks:
  kafka-net:
    driver: bridge
    
volumes:
  kafka_data:
    driver: local
```

### 配置文件详解

#### `kafka` 服务

*   **KRaft 模式核心配置**:
    *   `KAFKA_CFG_PROCESS_ROLES=broker,controller`：**这是启用 KRaft 模式的关键**。它告诉 Kafka 节点同时承担 `broker` 和 `controller` 的角色。
    *   `KAFKA_CFG_NODE_ID=1`：为节点设置一个唯一的 ID。
    *   `KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093`：定义 Controller 选举人。格式为 `node_id@host:port`。在单节点模式下，它就是自己。`9093` 是专门为 Controller 之间通信的端口。

*   **监听器 (Listeners) 配置 (重点)**:
    这是 Kafka on Docker 中最容易出错也最重要的部分。我们定义了三个监听器：
    1.  **`CONTROLLER://:9093`**: 供 Controller 角色内部通信使用，基于 Raft 协议。
    2.  **`INTERNAL://:9094`**: 供 **Docker 网络内部**的客户端访问。例如，我们的 `kafka-ui` 容器会通过这个监听器连接 Kafka。
    3.  **`EXTERNAL://:9092`**: 供 **Docker 网络外部**的客户端访问。例如，我们宿主机上的应用程序或开发工具会连接这个端口。
    *   `KAFKA_CFG_LISTENERS`: 定义了 Kafka 服务在容器内部监听哪些端口和协议。
    *   `KAFKA_CFG_ADVERTISED_LISTENERS`: 定义了 Kafka **告诉客户端**应该如何连接它。
        *   `INTERNAL://kafka:9094`：告诉内部客户端（如 `kafka-ui`），请通过 `kafka` 这个主机名和 `9094` 端口来连接我。
        *   `EXTERNAL://localhost:9092`：告诉外部客户端，请通过 `localhost` 和 `9092` 端口来连接我。
    *   `KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL`：指定 Broker 之间通信使用 `INTERNAL` 监听器。

*   **其他配置**:
    *   `KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true`：允许在生产或消费一个不存在的 Topic 时自动创建它。这在开发环境中很方便，但在生产环境中通常建议关闭。

#### `kafka-ui` 服务

*   `KAFKA_CLUSTERS_0_NAME=local-kafka`：在 Kafka UI 界面上为这个集群显示的名字。
*   `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9094`：**这是关键配置**。它告诉 Kafka UI 连接到 Kafka 服务的 `INTERNAL` 监听器 (`kafka:9094`)，因为它们都在同一个 `kafka-net` Docker 网络中，可以通过服务名 `kafka` 直接通信。

## 启动并验证安装

### 1. 启动服务

在包含 `docker-compose.yml` 文件的目录下，执行以下命令：

```bash
docker-compose up -d
```

### 2. 检查容器状态

执行 `docker ps` 查看容器是否都已正常运行。

```bash
docker ps
```
您应该能看到 `kafka` 和 `kafka-ui` 两个容器都处于 `Up` 状态。

### 3. 如何判断安装成功？

#### 方法一：通过 Kafka UI 界面 (推荐)

这是最直观的验证方法。

1.  打开浏览器，访问 `http://localhost:8088`。
2.  您应该能看到 Kafka UI 的主界面，并且在左侧菜单中能看到我们配置的集群名 `local-kafka`。
3.  点击 "Brokers" 菜单，您应该能看到一个 Broker，ID 为 1，并且状态为 "Online"。
4.  点击 "Topics" 菜单，然后点击 "Add new topic" 按钮，尝试创建一个名为 `test-topic` 的新主题。如果能成功创建，说明 Kafka 集群的读写功能完全正常。

  ![kafka-ui-topics.png](\image\kafka-ui-topics.png)
  图中所示，我们成功创建了一个名为 `test-topic` 的主题。

#### 方法二：使用命令行工具 (进阶验证)

您可以使用 `kafkacat` (一个强大的 Kafka 命令行工具) 或 Kafka 自带的脚本来验证。

首先，让我们向 `test-topic` 发送一条消息：
```bash
# 在您的宿主机上执行
echo "Hello, KRaft!" | kafkacat -P -b localhost:9092 -t test-topic```

然后，消费这条消息：
```bash
kafkacat -C -b localhost:9092 -t test-topic -c 1
```
如果您能成功看到输出 `Hello, KRaft!`，则证明 Kafka 的生产和消费流程已经完全打通。
