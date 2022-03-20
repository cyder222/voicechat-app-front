import { WorkerConfig } from "./share/worker-config";
import { WorkerWorkletMessages } from "./share/worker-events";

/**
 * AudioWorker及び、メイン関数と連携してAudioの処理を行う
 * 役割： バッファリングと出力。具体的な処理は、workerに委任する。Workletで処理が詰まると音声が飛ぶため
 * 1. process関数にやってくるinputsをバッファリングして、一定以上(_kernelBufferSize)たまったらworkerに処理を流す
 * 2. workerから送られてくる変換後のバッファーを受け取ってoutputバッファーに保存していく（onWorkerPortMessage→NewOutputsAvailable)
 * 3. process関数で、一定以上outputバッファーに出力がたまっていた時にworkletのoutputにバッファーを(workletで定義されている)output分書き込む
 */
class WorkerAudioProcessor extends AudioWorkletProcessor {

    private _kernelBufferSize = WorkerConfig.kernelBufferSize;
    private _inputRingBuffer = new Array<number>();
    private _outputRingBuffer = new Array<number>();
    private _workerPort: MessagePort | null = null;

    public constructor() {
        super();
        this.port.onmessage = (...args): void => {
            return this.onNodePortMessage(...args);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public process(inputs: Float32Array[][], outputs: Float32Array[][], _parameters: Record<string, Float32Array>): boolean {
        const input = inputs[0][0];
        const output = outputs[0][0];

        if(this._outputRingBuffer.length > output.length){
            output.set(this._outputRingBuffer.slice(0, output.length));
            this._outputRingBuffer = this._outputRingBuffer.slice(output.length,this._outputRingBuffer.length);
        }
        if(input == null) {
            return false;
        }
        const tmpInputBuffer = new Float32Array(this._kernelBufferSize);
        this._inputRingBuffer.push(...input);
        if (this._inputRingBuffer.length >= this._kernelBufferSize) {
            console.log("beofore pull");
            tmpInputBuffer.set(this._inputRingBuffer.slice(0, tmpInputBuffer.length));
            this._inputRingBuffer = this._inputRingBuffer.slice(tmpInputBuffer.length, this._inputRingBuffer.length);
            console.log("before post");
            const postMessage = {
                type: WorkerWorkletMessages.NewInputsAvailable,
                data: tmpInputBuffer.buffer,
            };
            this._workerPort?.postMessage(postMessage, [postMessage.data]);
            console.log("post");
        }
        return true;
    }

    private onNodePortMessage(ev: MessageEvent): void {
        const type = ev.data.type as keyof typeof WorkerWorkletMessages;
        console.log("NodePortMessage");

        switch (type) {
            case WorkerWorkletMessages.WorkletInitialize: {
                console.log("Worklet Initialize");

                this._workerPort = ev.data.data;
                this._workerPort!.onmessage = (...args): void => {
                    return this.onWorkerPortMessage(...args);
                };
                break;
            }

            default:
                throw new Error("Unexpected Error");
        }
    }

    private onWorkerPortMessage(ev: MessageEvent): void {
        const type = ev.data.type as keyof typeof WorkerWorkletMessages;
        console.log(`worklet get message ${type}`);

        switch (type) {
            case WorkerWorkletMessages.NewOutputsAvailable: {
                const outputs = new Float32Array(ev.data.data);
                this._outputRingBuffer.push(...outputs);
                return;
            }

            default:
                throw new Error("Unexpected Error");
        }
    }
}

registerProcessor("worker-worklet-processor", WorkerAudioProcessor);
