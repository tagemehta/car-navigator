/* eslint-disable @typescript-eslint/no-var-requires */
import { Skia } from '@shopify/react-native-skia'
import { useAssets } from 'expo-asset'
import * as React from 'react'
import classLabels from '@/constants/classLabels'
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView } from 'react-native'
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor
} from 'react-native-vision-camera'
import { useSkiaFrameProcessor } from 'react-native-vision-camera'
import { useResizePlugin } from 'vision-camera-resize-plugin'
import { useSharedValue, Worklets } from 'react-native-worklets-core'

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
interface modelOutputs {
  classID: any;
  confidence: any;
  boundingBox: {
      x1: any;
      y1: any;
      x2: any;
      y2: any;
}

}
export default function App(): React.ReactNode {

  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  // from https://www.kaggle.com/models/tensorflow/efficientdet/frameworks/tfLite
  const model = useTensorflowModel(require('@/assets/models/yolo11n_float32.tflite'))
  const actualModel = model.state === 'loaded' ? model.model : undefined
  const predictions = useSharedValue<modelOutputs[]>([])
  const [detectedObj, setDetectedObj] = React.useState<string>('')
  React.useEffect(() => {
    if (actualModel == null) return
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`)
  }, [actualModel])

  const { resize } = useResizePlugin()


  const handleDetection = Worklets.createRunOnJS((detections: modelOutputs[]) => {
    console.log(classLabels[detections[0]?.classID])
    setDetectedObj(classLabels[detections[0]?.classID])
  })

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      'worklet';
      frame.render()
      if (actualModel == null) {
        // model is still loading...
        return;
      }
  
      console.log(`Running inference on ${frame}`);
      const resized = resize(frame, {
        scale: {
          width: 320,
          height: 320,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
        rotation: '90deg'
      });

      const out = actualModel.runSync([resized]);
      // console.log(parseYoloV5Output(outputs, frame.width, frame.height));
      const gridCells = 2100;
      const numValuesPerCell = 84;
      const confidenceThreshold = .9;  // Set your desired threshold
      let outputs = out[0]
      console.log(outputs.slice(0,84))
      let boundingBoxes = [];
    let bestGuess = 0;
    let bestGuessObj = undefined
  
    console.log(outputs.slice(0,10))
    for (let i = 0; i < gridCells; i++) {
        let offset = i * numValuesPerCell;
        let box = outputs.slice(offset, offset + 4);  // [x_center, y_center, width, height]
    
        // let confidence = (outputs[offset + 4]);  // Object confidence
        let classProbabilities = outputs.slice(offset + 4, offset + numValuesPerCell) // Class scores
        let classProbabilitiesNumbers = Array.prototype.slice.call(classProbabilities);
            let maxClassIndex = classProbabilitiesNumbers.indexOf(Math.max(...classProbabilitiesNumbers));

            let maxClassScore = classProbabilities[maxClassIndex];
  
            if (maxClassScore > confidenceThreshold) {
              if ('banana' == classLabels[maxClassIndex]) {
                console.log('banana')
                
                const x_center = Number(box["0"]);
                const y_center = Number(box["1"]);
                const width = Number(box["2"]);
                const height = Number(box["3"]);
              
                const x_center_scaled = x_center * frame.width;
                const y_center_scaled = y_center * frame.height;
                const width_scaled = width * frame.width;
                const height_scaled = height * frame.height;
              
                const x_min = x_center_scaled - width_scaled / 2;
                const y_min = y_center_scaled - height_scaled / 2;
                const rect = Skia.XYWHRect(x_min, y_min, width_scaled, height_scaled);
                const paint = Skia.Paint();
                paint.setColor(Skia.Color('red'));
                frame.drawRect(
                  rect, paint
                  
                );
              }
              boundingBoxes.push({
                  box: box,
                  classIndex: maxClassIndex,
                  classScore: maxClassScore,
                  classLabel: classLabels[maxClassIndex]
              });
            }
            if (maxClassScore > bestGuess) {
              bestGuess = Number(maxClassScore);
              bestGuessObj = {
                box: box,
                classIndex: maxClassIndex,
                classScore: maxClassScore,
                classLabel: classLabels[maxClassIndex]
            }
            }

        
    }
      
      // Output high-confidence bounding boxes
      // console.log(boundingBoxes);
    },
    [actualModel]
  );
  
  

  React.useEffect(() => {
    requestPermission()
  }, [requestPermission])

  console.log(`Model: ${model.state} (${model.model != null})`)

  return (
    <View style={styles.container}>
      <Text>Predictions: {detectedObj}</Text>
      {hasPermission && device != null ? (
        <Camera
          
          device={device}
          style={{width: 300, height: 300}}
          isActive={true}
          frameProcessor={frameProcessor}
          fps={1}
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
// export default function App(): React.ReactNode {
//   return (
//      <View style={styles.container}>
//        <Text>Hello, world!</Text>
//      </View>
//    )
//  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
