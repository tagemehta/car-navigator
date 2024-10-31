/* eslint-disable @typescript-eslint/no-var-requires */
import classLabels from '@/constants/classLabels'
import classLablesExtended from '@/constants/classLablesExtended'
import * as React from 'react'

import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { useResizePlugin } from 'vision-camera-resize-plugin'

function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`
}
function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join('')}`
  )
}

export default function App(): React.ReactNode {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')

  // from https://www.kaggle.com/models/tensorflow/efficientdet/frameworks/tfLite
  const model = useTensorflowModel(require('@/assets/models/efficientdet.tflite'))
  const actualModel = model.state === 'loaded' ? model.model : undefined

  React.useEffect(() => {
    if (actualModel == null) return
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`)
  }, [actualModel])

  const { resize } = useResizePlugin()

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet'
      if (actualModel == null) {
        // model is still loading...
        return
      }

      // console.log(`Running inference on ${frame}`)
      const resized = resize(frame, {
        scale: {
          width: 320,
          height: 320,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      })
      const result = actualModel.runSync([resized])
      let boxes = Array.prototype.slice.call(result[0])
      
      let classes = Array.prototype.slice.call(result[1])
      let scores = Array.prototype.slice.call(result[2])
      const num_detections = result[3]?.[0] ?? 0
      // console.log([boxes.length, classes.length, scores.length, result[3]])
      for (let i = 0; i < num_detections; i++) {
        const box = boxes.slice(i*4, i*4+4)
        const classI = classes[i]
        const label = classLablesExtended[classI]
        const score = scores[i]
        if (label == undefined) {
          console.log(classI)
        }
        if (score > .5) console.log(`${classLabels[classI]} (${score}): ${box}`)
      }
    },
    [actualModel]
  )

  React.useEffect(() => {
    requestPermission()
  }, [requestPermission])

  console.log(`Model: ${model.state} (${model.model != null})`)

  return (
    <View style={styles.container}>
      {hasPermission && device != null ? (
        <Camera
          device={device}
          style={StyleSheet.absoluteFill}
          isActive={true}
          frameProcessor={frameProcessor}
          pixelFormat="yuv"
        />
      ) : (
        <Text>No Camera available.</Text>
      )}

      {model.state === 'loading' && (
        <ActivityIndicator size="small" color="white" />
      )}

      {model.state === 'error' && (
        <Text>Failed to load model! {model.error.message}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})