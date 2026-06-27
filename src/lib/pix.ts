import { company } from "./company";

/** Calcula CRC16/CCITT-FALSE usado no payload Pix (BR Code / EMV). */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const tlv = (id: string, value: string) =>
  `${id}${value.length.toString().padStart(2, "0")}${value}`;

const sanitize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .toUpperCase();

/**
 * Gera um payload Pix "copia e cola" (BR Code estático com valor).
 * Chave: CNPJ da empresa. Padrão Banco Central do Brasil.
 */
export function buildPixPayload(opts: { amount: number; txid: string }) {
  const merchantName = sanitize(company.pixReceiver).slice(0, 25);
  const merchantCity = sanitize(company.pixCity).slice(0, 15);
  const txid = opts.txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "PDBPEDIDO";
  const amount = opts.amount.toFixed(2);

  const merchantAccount = tlv("00", "br.gov.bcb.pix") + tlv("01", company.pixKey);

  const payload =
    tlv("00", "01") + // Payload Format Indicator
    tlv("26", merchantAccount) + // Merchant Account Information (Pix)
    tlv("52", "0000") + // Merchant Category Code
    tlv("53", "986") + // Currency: BRL
    tlv("54", amount) + // Transaction Amount
    tlv("58", "BR") + // Country
    tlv("59", merchantName) + // Beneficiary Name
    tlv("60", merchantCity) + // City
    tlv("62", tlv("05", txid)) + // Additional data — txid
    "6304";

  return payload + crc16(payload);
}
