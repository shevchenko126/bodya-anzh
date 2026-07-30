import QRCode from "qrcode";

export async function generateQrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: 1,
    color: { dark: "#2f2a24", light: "#00000000" },
  });
}
