export default function spliceText(s = "") {
  if (s.length <= 255) {
    return s;
  }

  if (s.length > 255) {
    let idx = s.slice(0, 256).lastIndexOf(" ");
    if (idx) {
      return `${s.slice(0, idx)}...`;
    }
  }
}
