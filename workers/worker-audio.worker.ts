import { format, transpose } from "mathjs";
import { InferenceSession, Tensor } from "onnxruntime-web";
import { default as simpleWorldJS } from "./lib/WorldJS";
import { HeapAudioBuffer } from "./lib/wasm-ringbuffer";
import { WorkerConfig } from "./share/worker-config";
import { WorkerWorkletMessages } from "./share/worker-events";

const ctx: Worker = self as any;
let port: MessagePort | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let worldjs: any = null;
let worldWrapper: any = null;
let featureConverter: any = null;
let f0mul: number;
let onnxSession: InferenceSession;
let asrScaler: {X_mean: Array<number>, X_scale: Array<number>, X_var: Array<number>};
let vcScaler: {Y_mean: Array<number>, Y_scale: Array<number>, Y_var: Array<number>};

function createMySessionOptions() {
    // session options: please refer to the other example for details usage for session options
    return { executionProviders: ["wasm"] };
}

ctx.onmessage = async (ev: MessageEvent): Promise<void> => {
    const type = ev.data.type as keyof typeof WorkerWorkletMessages;
    console.log(`worker-audio.worker on messag ${type} to basic port`);

    switch (type) {
        case WorkerWorkletMessages.WorkerInitialize: {
            console.log("Worker initialize");
            port = ev.data.data.port;
            f0mul = ev.data.data.f0mul;
            port!.onmessage = workerPortOnMessage;
            console.log("using wasm backend");
            const options = createMySessionOptions();
            worldjs = await simpleWorldJS();
            globalThis.Module = worldjs;
            console.log("using worldjs backend");
            worldWrapper = new worldjs.WorldWrapper(WorkerConfig.kernelBufferSize, 16000, 5.0);
            featureConverter = new worldjs.FeatureConverter();
            console.log("using worldjs backend functions");
                
            onnxSession = await InferenceSession.create("/workers/lib/ppgvc_16k_batch1.onnx", options);

            asrScaler = await (await fetch("/workers/lib/scale/asr_scaler.json")).json();
            vcScaler = await (await fetch("/workers/lib/scale/vc_scaler.json")).json();

            f0mul = 1.0;
            break;
        }
        
        case WorkerWorkletMessages.UpdateWorkerPrameter: {
            f0mul = ev.data.data;
            console.log("update parameter");
            break;
        }

        default:
            throw new Error("Unexpected error");
    }
};

function scale(values: Array<number>, mean: Array<number>, scale: Array<number>): Array<number>{
    
    return values.map((value, index)=>{
        return (value - mean[index]) / scale[index];
    });
}

function reverseScale(values: Array<number>, mean: Array<number>, scale: Array<number>): Array<number>{
    return values.map((value, index) => {
        return value * scale[index] + mean[index];
    });
}

function splitArray<T>(array: Array<T>, part: number): T[][] {
    const tmp = [];
    for(let i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
    }
    return tmp;
}

async function workerPortOnMessage(ev: MessageEvent): Promise<void> {
    const type = ev.data.type as keyof typeof WorkerWorkletMessages;
    console.log(`worker-audio.worker on message ${type} to worklet port`);

    if(!worldWrapper) return;
    if(!port) return;
    if(!onnxSession) return;
    if(!asrScaler) return;
    if(!vcScaler) return;
    switch (type) {
        case WorkerWorkletMessages.NewInputsAvailable: {
            console.time("audiowork");
            const input = new Float32Array(ev.data.data);
            console.time("preparebuffer");
            const buffer = new HeapAudioBuffer(worldjs, WorkerConfig.kernelBufferSize);
            console.timeEnd("preparebuffer");
            buffer!.getChannelView().set(input);

            // 特徴量取り出し
            console.time("extract");
            const { f0, fft_size, spectral, aperiodicity } = worldWrapper.FeatureExtract(buffer!.getHeapAddress());

            console.timeEnd("extract");
            const convF0 = f0.map((value: number) => {
                return value * f0mul;
            });

            console.time("mel");
            const mel = featureConverter.melspectram(buffer.getHeapAddress(), buffer.length, 16000, 512, 40, 512, 80, true).mel;
            console.timeEnd("mel");
           // console.log(mel.length);
           // onnx
            const inputArray = mel.map((float32array:Float32Array)=> {return scale([...float32array], asrScaler.X_mean, asrScaler.X_scale);});
            
            const TInputArray = transpose(inputArray);
            const flatInputArray = [].concat(...TInputArray);
            const inputTensor = new Tensor("float32",[].concat(flatInputArray),[1,40,128]);
            const feeds = { 0: inputTensor };
            console.time("onnx");
            const results = await onnxSession.run(feeds);
            console.timeEnd("onnx");

            const genMcep = results["109"].data as Float32Array;

            const tmpGenMcep = splitArray([...genMcep], 128);
            tmpGenMcep.map((v)=>{Array.from(v);});
            const splitGenMcep = transpose(tmpGenMcep);
            // onnxの結果を調整
            const newMcep = splitGenMcep.map((mcep: any)=>{
                return reverseScale([...mcep], vcScaler.Y_mean, vcScaler.Y_scale);
            });
            console.time("melfilter");
            const flatNewMcep = ([] as Array<number>).concat(...newMcep);
            const mcepBuffer = new HeapAudioBuffer(worldjs, 128 * 40);
            mcepBuffer.getChannelView().set(flatNewMcep);
            const tmpFilteredMcep = featureConverter.merlinPostFilterToMcArray(mcepBuffer.getHeapAddress(),  40, 128, 0.41000000000000003, 511, 1024, 1.4).mc;

            const flatFilteredMcep =  [];
            for( let i = 0 ; i<tmpFilteredMcep.length; i++){
                flatFilteredMcep.push(...tmpFilteredMcep[i]);
            }
            console.timeEnd("melfilter");
            
            const filteredMcepBuffer = new HeapAudioBuffer(worldjs, 128 * 40);
            filteredMcepBuffer.getChannelView().set(flatFilteredMcep);

            console.time("mcarray2sp");
            const convertedSp = featureConverter.mcArray2SpArray(filteredMcepBuffer.getHeapAddress(), 40, 128, 0.41000000000000003, 1024).sp;
            console.timeEnd("mcarray2sp");

            console.time("synthe");

            const val = worldWrapper.Synthesis( convF0, convertedSp  , aperiodicity,fft_size, 16000, 5.0);
            console.timeEnd("synthe");
            //Module.helloAudio(buffer!.getHeapAddress(),outputBuffer!.getHeapAddress(),1, WorkerConfig.kernelBufferSize);
            const postData = {
                type: WorkerWorkletMessages.NewOutputsAvailable,
                data: new Float32Array([...val]).buffer,
            };
            port!.postMessage(postData, [postData.data]);
            console.timeEnd("audiowork");
            break;
        }

        default:
            throw new Error("Unexpected error");
    }
}

export default ctx;
