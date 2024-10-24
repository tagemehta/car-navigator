export default function imgToTensor(base64Rep: string) {
  var binaryString = atob(base64Rep);
  var bytes = new Float32Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
  b.
}