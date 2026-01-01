# 境界づけ（Bounded Context）

## 目的

本ドキュメントは、ドメインを境界づけ（Bounded Context）に分割し、
用語・責務・主要エンティティの境界を明確にする。

## Context 一覧

- Circle Context（研究会）
- CircleSession Context（開催回）
- Match Context（対局結果）
- Auth Context（認証/認可）

## Circle Context（研究会）

### 目的

研究会の作成・編集・削除、および研究会参加（ロール）を扱う。

### 主要エンティティ/値

- Circle
- CircleMembership（研究会参加）

### 代表的な不変条件

- CircleOwner は必ず 1 人
- 研究会参加者は研究会ごとに 1 ロールのみ

### 所管するユースケース例

- 研究会の作成/編集/削除
- 研究会参加者の追加/削除/ロール変更
- 研究会オーナー移譲

## CircleSession Context（開催回）

### 目的

開催回の作成・編集・削除、および開催回参加（ロール）を扱う。

### 主要エンティティ/値

- CircleSession
- CircleSessionMembership（開催回参加）

### 代表的な不変条件

- CircleSessionOwner は必ず 1 人
- 開催回参加者は開催回ごとに 1 ロールのみ
- 開催回は必ず 1 つの研究会に属する

### 所管するユースケース例

- 開催回の作成/編集/削除
- 開催回参加者の追加/参加取消/ロール変更
- 開催回オーナー移譲

## Match Context（対局結果）

### 目的

対局結果の作成・編集・削除と履歴を扱う。

### 主要エンティティ/値

- Match
- MatchHistory

### 代表的な不変条件

- 対局者は開催回参加者である
- player1 != player2
- 対局結果の作成/更新/削除時に履歴を自動記録

### 所管するユースケース例

- 対局結果の記録/修正/削除
- 対局結果の履歴閲覧

## Auth Context（認証/認可）

### 目的

ログイン状態の判定と権限判定を扱う。

### 主要エンティティ/値

- User（登録済みユーザー）
- CircleRole / CircleSessionRole

### 代表的な不変条件

- 上位ロールのユーザーは下位ロールによって変更されない

### 所管するユースケース例

- 認証状態の確認
- 認可ポリシーの判定

## Context 間の関係

- CircleSession は Circle に従属する
- Match は CircleSession に従属する
- Auth は各 Context の操作権限を判定する横断的な Context

## 実装上の配置（目安）

- Circle Context
  - `server/domain/models/circle/*`
  - `server/application/circle/*`
  - `server/infrastructure/repository/circle/*`
- CircleSession Context
  - `server/domain/models/circle-session/*`
  - `server/application/circle-session/*`
  - `server/infrastructure/repository/circle-session/*`
- Match Context
  - `server/domain/models/match/*`
  - `server/domain/models/match-history/*`
  - `server/application/match/*`
  - `server/infrastructure/repository/match/*`
  - `server/infrastructure/repository/match-history/*`
- Auth Context
  - `server/domain/services/authz/*`
  - `server/application/authz/*`
  - `server/infrastructure/repository/authz/*`
