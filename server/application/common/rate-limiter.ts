export type RateLimiter = {
  /** レート制限チェック。超過時は TooManyRequestsError をスロー */
  check(key: string): void;
  /** 失敗を記録 */
  recordFailure(key: string): void;
  /** カウンターをリセット（成功時） */
  reset(key: string): void;
};
