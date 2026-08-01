function hashText(value) {
  const text = String(value || '').trim().toLowerCase()
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

// ค่าเลขฐาน 2 ของแต่ละ "ชุด" (1-15) ตามที่กำหนดไว้
export const setValues = {
  1: '01100010',
  2: '01100100',
  3: '01100101',
  4: '01100110',
  5: '01100111',
  6: '01101001',
  7: '01101100',
  8: '01101101',
  9: '01101110',
  10: '01101111',
  11: '01110101',
  12: '01110010',
  13: '01111001',
  14: '01010111',
  15: '00100000',
}

export function answerHash(value) {
  return hashText(value)
}

export function boxOrderDigest() {
  return hashText(boxOrder.join(','))
}

// เกมที่ N ให้เลขฐาน 2 ของ "ชุดที่" เท่าไหร่
export const gameToSet = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 1,
  6: 9,
  7: 10,
  8: 11,
  9: 12,
  10: 13,
  11: 15,
  12: 8,
  13: 7,
  14: 6,
  15: 14,
}

// เกมที่ 16 เฉลยลำดับการเรียงชุดเลขฐาน 2 ทั้ง 25 ตำแหน่ง ของกล่องหลัก
export const boxOrder = [
  14, 6, 7, 7, 15, 13, 10, 11, 15, 1, 3, 15, 8, 13, 15, 5, 6, 12, 7, 4, 12, 6, 3, 9, 2,
]

export const totalGames = 16
export const finalMessage = 'เป็นแฟนกันไหม'

export function correctAnswerForSlot(slotIndex) {
  const setNo = boxOrder[slotIndex]
  return answerHash(setValues[setNo])
}

export const gameNames = {
  1: 'เกมวัดรีเฟกซ์',
  2: 'ปฏิบัติการกู้คืนขนมปังปอนด์',
  3: 'พาน้องเคนโซ่ไปคาเฟ่สุนัข',
  4: 'คดีโจรกรรมเพชรยอดน้ำตาแห่งเบกะ',
  5: 'ถอดรหัสโพเนกลีฟแห่งราฟเทล',
  6: 'คำถามของพี่โกฮัง',
  7: 'งูจอมตะกละ',
  8: 'ไดโนตะลุยทะเลทราย',
  9: 'จับคู่ความทรงจำ',
  10: 'ตีตัวตุ่น',
  11: 'จำจังหวะไซมอน',
  12: 'รับของจากฟ้า',
  13: 'เกมOXท้าดวล AI',
  14: 'จับคู่สีให้ทัน',
  15: 'เขาวงกตปริศนา',
  16: 'Project OMEGA-MATH',
}
