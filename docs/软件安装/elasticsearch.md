---
title: elasticsearch
createTime: 2025/07/23 19:03:48
permalink: /article/1uoh1a9s/

tags:
  - 软件安装
  - elasticsearch
---


# 使用 Docker 轻松部署 Elasticsearch 8.x 和 Kibana（含 IK 分词器）

## 简介

**Elasticsearch** 是一个强大的、开源的分布式搜索和分析引擎，广泛应用于日志分析、全文搜索、安全智能等领域。**Kibana** 则是一个与 Elasticsearch 配套使用的开源数据可视化和探索工具，可以让你通过美观的图表和仪表盘直观地与数据进行交互。

使用 **Docker** 来安装 Elasticsearch 和 Kibana 有以下几个显著优势：

*   **环境隔离**：容器化技术确保了服务的运行环境与主机系统隔离，避免了依赖冲突和配置污染。
*   **快速部署**：一条命令即可完成服务的启动，极大地简化了复杂的安装和配置过程。
*   **一致性**：确保在开发、测试和生产环境中拥有一致的运行环境。
*   **便携性**：可以轻松地在任何支持 Docker 的机器上迁移和部署。

本教程将引导您使用 Docker 从零开始，一步步部署单机版的 Elasticsearch 8.10.4、安装中文分词器 IK Analyzer，并配置 Kibana 作为其图形化管理界面。

## 准备工作

在开始之前，请确保您的系统中已经安装了 Docker 和 Docker Desktop。

*   [Docker 官方安装指南](https://docs.docker.com/engine/install/)

## 一、 Elasticsearch 安装

### 1. 创建 Docker 网络

为了让 Elasticsearch 和 Kibana 容器能够方便地相互通信，我们首先创建一个自定义的 Docker 网络。

```bash
docker network create elastic
```

### 2. 启动 Elasticsearch 容器

通过下面的 `docker run` 命令即可一键启动一个单机版的 Elasticsearch 实例。

```bash
docker run -d \
  --name es \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -e "discovery.type=single-node" \
  -e "ELASTIC_PASSWORD=installing" \
  -v es-data:/usr/share/elasticsearch/data \
  -v es-plugins:/usr/share/elasticsearch/plugins \
  --privileged \
  --network elastic \
  -p 9200:9200 \
  -p 9300:9300 \
  elasticsearch:8.10.4
```

### 3. 参数详解

*   `--name es`：指定容器的名称为 `es`，方便后续操作。
*   `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：设置 Elasticsearch 的 JVM 堆内存大小。在开发环境中，512MB 是一个合理的初始值。
*   `-e "discovery.type=single-node"`：设置 Elasticsearch 为单节点模式，这是启动单个实例所必需的。
*   `-e "ELASTIC_PASSWORD=installing"`：为内置的 `elastic` 超级用户设置密码。**请务必记住这个密码**，后续 Kibana 登录和 API 调用都需要用到它。
*   `-v es-data:/usr/share/elasticsearch/data`：创建一个名为 `es-data` 的 **Docker 命名卷 (Named Volume)**，并将其挂载到容器内的数据目录。这样可以确保即使容器被删除，索引数据也能持久化保存。
*   `-v es-plugins:/usr/share/elasticsearch/plugins`：同理，创建一个名为 `es-plugins` 的卷用于持久化存储插件。
*   `--privileged`：授予容器一些扩展的特权。在某些系统上，Elasticsearch 可能需要这个权限来修改内核参数（如 `vm.max_map_count`）。如果您的环境没有此限制，可以尝试移除此参数。
*   `--network elastic`：将容器连接到我们之前创建的 `elastic` 网络中。
*   `-p 9200:9200`：将主机的 9200 端口映射到容器的 9200 端口（HTTP API 端口）。
*   `-p 9300:9300`：将主机的 9300 端口映射到容器的 9300 端口（节点间通信端口）。
*   `elasticsearch:8.10.4`：指定要使用的 Elasticsearch 镜像及其版本。

> **提示**：您可以在 Docker Desktop 的 "Volumes" 标签页中查看到 `es-data` 和 `es-plugins` 这两个卷。

### 4. 测试安装是否成功

从 Elasticsearch 8.x 版本开始，安全功能默认开启，所有通信都走 `HTTPS` 协议并需要认证。在终端中执行如下命令进行测试：

```bash
curl --insecure -u elastic:installing https://localhost:9200
```

*   `--insecure`：由于 ES 默认使用自签名 SSL 证书，此参数用于跳过证书验证。
*   `-u elastic:installing`：提供用户名 (`elastic`) 和我们之前设置的密码 (`installing`) 进行认证。

如果返回类似下面的 JSON 内容，则说明您的 Elasticsearch 实例已经成功启动！

```json
{
  "name" : "es",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "...",
  "version" : {
    "number" : "8.10.4",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "...",
    "build_date" : "...",
    "build_snapshot" : false,
    "lucene_version" : "9.7.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

## 二、 IK 中文分词器安装

IK Analyzer 是一个广泛使用的 Elasticsearch 中文分词插件，它提供了强大的中文分词能力。

### 方法一：在线安装

这是最便捷的安装方式。

```bash
docker exec -it es ./bin/elasticsearch-plugin install https://release.infinilabs.com/analysis-ik/stable/elasticsearch-analysis-ik-8.10.4.zip
```

### 方法二：离线安装

如果您的服务器无法访问外网，可以使用此方法。

1.  **下载插件**：在本地浏览器中下载与您的 ES 版本对应的 IK 插件压缩包。
    *   下载地址：`https://release.infinilabs.com/analysis-ik/stable/elasticsearch-analysis-ik-8.10.4.zip`
2.  **解压文件**：将下载的 `zip` 文件解压，你会得到一个名为 `elasticsearch` 的文件夹，里面就是插件内容。
3.  **复制到容器**：将解压后的插件文件夹复制到 `es` 容器的插件目录中。
    ```bash
    # 假设你解压后的文件夹名为 elasticsearch-analysis-ik-8.10.4
    docker cp elasticsearch-analysis-ik-8.10.4 es:/usr/share/elasticsearch/plugins/
    ```

### 重启容器使插件生效

**无论使用哪种方法，安装插件后都必须重启 Elasticsearch 容器**，才能让插件被加载。

```bash
docker restart es
```

### 测试分词器是否成功

您可以使用 Kibana 的 Dev Tools (稍后会安装) 或 `curl` 命令来测试分词效果。这里我们使用 `curl`：

```bash
curl -X POST "https://localhost:9200/_analyze" \
-H 'Content-Type: application/json' \
--insecure -u elastic:installing \
-d'
{
  "analyzer": "ik_smart",
  "text": "我是中国人"
}
'
```

如果返回如下结果，说明 IK 分词器已成功加载并工作：

```json
{
  "tokens": [
    {
      "token": "我",
      "start_offset": 0,
      "end_offset": 1,
      "type": "CN_CHAR",
      "position": 0
    },
    {
      "token": "是",
      "start_offset": 1,
      "end_offset": 2,
      "type": "CN_CHAR",
      "position": 1
    },
    {
      "token": "中国人",
      "start_offset": 2,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 2
    }
  ]
}
```

## 三、 Kibana 安装

### 1. 为 Kibana 创建服务账户及 Token (ES 8.x 推荐做法)

从 ES 8.x 开始，出于安全考虑，不再推荐使用 `elastic` 超级用户来配置 Kibana 与 Elasticsearch 之间的连接。正确的做法是为 Kibana 创建一个专用的服务账户，并使用生成的 API Token 进行认证。

1.  **进入 Elasticsearch 容器**：
    ```bash
    docker exec -it es /bin/bash
    ```

2.  **创建 Kibana 专用的服务账户和角色**（如果它们不存在）：
    ```bash
    ./bin/elasticsearch-users service create kibana_system -r kibana_system
    ```

3.  **为该服务账户生成一个 API Token**：
    ```bash
    ./bin/elasticsearch-service-tokens create kibana_system
    ```

    执行后，终端会返回一个 Token。**请务必完整复制 `value` 字段的内容**，它只会出现一次。
    ```json
    {
      "name": "kibana_system",
      "value": "AAEAAWVsYXN0aWMva2liYW5hL2tpYmFuYS10b2tlbjpITzlGZW1aR1RlU2psYkIzZUFod2NROVpXQ05BU0FRQjA5RV9hUVp4T2hXQ2V6d1l4VFlDQTdB"
    }
    ```

4.  **退出容器**：
    ```bash
    exit
    ```

### 2. 启动 Kibana 容器

现在，使用我们获取到的 Token 来启动 Kibana 容器。

```bash
docker run -d \
  --name kibana \
  -e ELASTICSEARCH_HOSTS=https://es:9200 \
  -e ELASTICSEARCH_SERVICEACCOUNTTOKEN="在这里粘贴你刚刚生成的API Token" \
  -e ELASTICSEARCH_SSL_VERIFICATIONMODE=none \
  --network=elastic \
  -p 5601:5601 \
  kibana:8.10.4
```

### 3. 参数详解

*   `--name kibana`：指定容器名称为 `kibana`。
*   `-e ELASTICSEARCH_HOSTS=https://es:9200`：设置 Kibana 要连接的 Elasticsearch 地址。我们使用容器名 `es` 作为主机名，因为它们在同一个 `elastic` 网络中，Docker 会自动处理 DNS 解析。
*   `-e ELASTICSEARCH_SERVICEACCOUNTTOKEN="..."`：**使用我们上一步生成的服务账户 Token** 进行认证。
*   `-e ELASTICSEARCH_SSL_VERIFICATIONMODE=none`：由于 ES 使用自签名证书，禁用 SSL 验证。
*   `--network=elastic`：将 Kibana 容器也连接到 `elastic` 网络。
*   `-p 5601:5601`：将主机的 5601 端口映射到 Kibana 的 Web 界面端口。


### 4. 访问并测试 Kibana

在浏览器中访问 `http://localhost:5601`。等待一两分钟，让 Kibana 完成初始化。当您看到 Kibana 的登录页面时，说明安装成功！

*   **用户名**：`elastic`
*   **密码**：`installing` (您在启动 ES 容器时设置的 `ELASTIC_PASSWORD`)

登录后，您可以自由探索 Kibana 的强大功能，例如前往 "Management" -> "Dev Tools" 来方便地与您的 Elasticsearch 集群进行交互。

恭喜您，至此您已经成功地在 Docker 上搭建了一套完整的 Elasticsearch 和 Kibana 环境！