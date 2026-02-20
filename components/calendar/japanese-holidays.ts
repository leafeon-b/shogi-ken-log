import holiday_jp from "@holiday-jp/holiday_jp";

export function isJapaneseHoliday(date: Date): boolean {
  return holiday_jp.isHoliday(date);
}
