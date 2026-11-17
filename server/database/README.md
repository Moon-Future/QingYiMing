# 数据库维护脚本

从项目根目录运行以下命令。两个 Node 脚本都直接连接 [config.js](./config.js) 指定的 MySQL，无需启动前端或后端。先确认配置中的主机、端口和库名，尤其是在服务器上操作时。项目依赖需已安装。

| 目的 | 脚本 | 无参数运行 | 加 `--apply` |
| --- | --- | --- | --- |
| 在数据库里直观看时间 | [add-readable-times.js](./add-readable-times.js) | 读取表结构，打印待执行的 SQL | 在原表新增可读时间列 |
| 查订单汇总数量为何对不上 | [reconcile-order-totals.js](./reconcile-order-totals.js) | 读取业务数据，输出差异清单 | 备份后修复可确定的订单汇总差异 |

两个脚本独立运行。上线后端修复无需执行对账脚本；需要可读时间列时，只运行时间脚本即可。

## 重复执行会怎样

- **不加参数**：两个脚本都可以反复运行，只读取当前库。时间脚本重新预览待建列，对账脚本重新计算差异。
- **时间脚本加 `--apply`**：跳过已通过字段检查的列。若上次只完成部分表，排除错误后可重跑以补齐其余表。全部完成后重跑会显示“0 张表已处理”。
- **对账脚本加 `--apply`**：每次都会重新对账并尝试整库备份，即使 `safe` 为空。复核通过后只更新本次 `safe` 中的订单组；已修好且未再出现差异的订单会跳过，新出现的可修复差异会被处理。`review` 仍留给人工核对。日常复查用无参数命令即可。

## 在表里查看北京时间

先预览涉及哪些表和字段：

```sh
node server/database/add-readable-times.js
```

确认目标库、做好库备份后执行（需要 ALTER 权限）：

```sh
node server/database/add-readable-times.js --apply
```

脚本按表执行 ALTER，为 15 张业务表中指定的毫秒时间戳添加虚拟生成列。例如，订单表的 `createTimeDateTime` 来自 `createTime`，显示为 `2024-01-01 08:00:00`（北京时间，舍去毫秒）。历史记录建列后立即可读，无需回填。页面写入原时间戳后，刷新数据库查询就能看到新值。如果页面操作没有写入对应时间戳，可读时间也不会变化。原值为 0 或 NULL 时显示 NULL。

验证示例：

```sql
SELECT id, createTime, createTimeDateTime, updateTime, updateTimeDateTime
FROM ord ORDER BY id DESC LIMIT 5;
```

再次预览应显示“0 张表待处理”。如果中途失败，已完成的表可能已生效。排除错误后重新预览即可查看剩余工作。遇到同名列冲突，先用 SHOW CREATE TABLE 核对定义。

## 检查订单汇总数量

```sh
node server/database/reconcile-order-totals.js
```

脚本比较有效订单组（ordgrp）的订购量、已送量与有效订单明细（ord）的合计。发现汇总差异时，再用关联订单的有效送货记录（delivery，模板 3、4）判断能否自动修复。单独的完成状态错误或汇总相符的订单不会列入这份报告。

- **safe**：明细及送货记录通过脚本核对，可据此重算订单组。old 为原汇总，expected 为根据明细算出的汇总。
- **review**：数据有歧义，如缺少有效明细、明细与送货记录不符。reasons 说明原因。即使执行修复，也会跳过这些记录。
- 如果输出是 `safe: []`，只有 `review` 有记录，到这里即可停止。保留历史疑点时，无需加 `--apply`。

仅在 safe 有记录且已确认要修复该库时，于暂停开单和送货的时段执行：

```sh
node server/database/reconcile-order-totals.js --apply
```

需要能运行 mysqldump（可通过环境变量 QYM_MYSQLDUMP 指定可执行文件路径），并有整库导出和订单组更新权限。脚本先备份目标库，再在事务内锁定有效订单组和明细、复核差异，仅更新 safe 对应的 ordgrp 汇总数量、完成状态和更新时间。

备份在**执行命令的机器**上：`~/.local/share/qym-order-repair/<时间>/`。before.sql 为修复前的整库备份，SHA256 为校验值，audit.json 和 after.json 分别记录修复前后的审计结果。成功输出中的 updated 是本次更新数，remaining 是剩余可自动修复数，review 是待人工核对的订单组 ID。可再次运行无参数命令复查。

## 目录里的历史 SQL

旧的 migration_add_* 文件分别用于增加送货地址、订单备注和版本字段。需要补旧库时，先对照文件和目标表结构，再决定是否执行。两个 migration_create_* 二维码脚本以及 qym.sql 含有 DROP TABLE，执行会删除对应的现有表和表内数据。上述两项维护操作都无需导入这些 SQL 文件。
