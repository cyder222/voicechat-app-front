export const WorkerConfig = {
    kernelBufferSize: (16000 * 0.64) -1, // 16000hz * 0.64秒(128/200) - 1は、 World側の出力が-1しないと129個になってしまったため
    RingBufferSize: 1024 * 32,
};
