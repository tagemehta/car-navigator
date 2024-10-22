// TEAM 3 - Identify Car using chatgpt api

import axios from "axios";
import { Frame } from "react-native-vision-camera";
import { loadTensorflowModel } from 'react-native-fast-tflite'

export default function identifyCarFromImg(frame: Frame):{make: string, color: string, model: string} {
  'worklet'
  // const model = loadTensorflowModel(require('/models/yolov5.tflite'))
  console.log('hello')
  // Implementation of the function
  return {color: "red", make: "toyota", model: "highlander"}
}