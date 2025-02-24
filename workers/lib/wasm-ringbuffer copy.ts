/* eslint-disable no-undef */
// Basic byte unit of WASM heap. (16 bit = 2 bytes)
const BYTES_PER_UNIT = Uint16Array.BYTES_PER_ELEMENT;

const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;

// WebAudio's render quantum size.
const RENDER_QUANTUM_FRAMES = 128;

/**
 * A WASM HEAP wrapper for AudioBuffer class. This breaks down the AudioBuffer
 * into an Array of Float32Array. 
 *
 * @class
 * @dependency Module A WASM module generated by the emscripten glue code.
 */
class HeapAudioBuffer {

  private _isInitialized: boolean;
  private _module: any;
  private _length: number;
  private _dataPtr: number | null = null;
  private _body: Float32Array;
  /**
   * @constructor
   * @param  {WebAssembly.Module} wasmModule WASM module generated by Emscripten.
   * @param  {number} length Buffer frame length.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(wasmModule: WebAssembly.Module , length: number) {
    // The |channelCount| must be greater than 0, and less than or equal to
    // the maximum channel count.
    this._isInitialized = false;
    this._module = wasmModule;
    this._length = length;
    this._body = new Float32Array();
    this._allocateHeap();
    this._isInitialized = true;
  }

  /**
   * Getter for the buffer length in frames.
   *
   * @return {?number} Buffer length in frames.
   */
  public get length(): number | null {
    return this._isInitialized ? this._length : null;
  }

  /**
   * Returns a Float32Array view for this heap.
   *
   * @return {?Array} a channel data array or an
   * array of channel data. 
   */
  public getChannelView(): Float32Array {
    return this._body;
  }

  /**
   * Returns the base address of the allocated memory space in the WASM heap.
   *
   * @return {number} WASM Heap address.
   */
  public getHeapAddress(): number | null {
    return this._dataPtr;
  }

  /**
   * Frees the allocated memory space in the WASM heap.
   */
  public free(): void {
    this._isInitialized = false;
    this._module._free(this._dataPtr);
  }

   /**
   * Allocates memory in the WASM heap and set up Float32Array views for the
   * channel data.
   */
    private _allocateHeap(): void {
      const channelByteSize = this._length * BYTES_PER_SAMPLE;
      const dataByteSize = channelByteSize;
      this._dataPtr = this._module._malloc(dataByteSize);
      if(this._dataPtr == null){
        throw new Error("Cannot allocate wasm memory");
      }
  
        const startByteOffset = this._dataPtr;
        const endByteOffset = startByteOffset + channelByteSize;
        // Get the actual array index by dividing the byte offset by 2 bytes.
        this._body = this._module.HEAPF32.subarray(startByteOffset >> BYTES_PER_UNIT,
                                                  endByteOffset >> BYTES_PER_UNIT);
    }
} // class HeapAudioBuffer


// single channel ringbuffer
class RingBuffer {
  private _readIndex:number;
  private _writeIndex: number;
  private _framesAvailable: number;
  private _length: number;
  private _body: Float32Array;
  /**
   * @constructor
   * @param  {number} length Buffer length in frames.
   */
  public constructor(length: number) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._framesAvailable = 0;

    this._length = length;
    this._body = new Float32Array(length);
  }

  /**
   * Getter for Available frames in buffer.
   *
   * @return {number} Available frames in buffer.
   */
  public get framesAvailable(): number {
    return this._framesAvailable;
  }

  /**
   * Push a sequence of Float32Arrays to buffer.
   *
   * @param  {Float32Array} array Float32Arrays.
   */
  public push(arraySequence: Float32Array): void {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // Transfer data from the |arraySequence| storage to the internal buffer.
    const sourceLength = arraySequence.length;
    for (let i = 0; i < sourceLength; ++i) {
      const writeIndex = (this._writeIndex + i) % this._length;
      this._body[writeIndex] = arraySequence[i];
    }

    this._writeIndex += sourceLength;
    if (this._writeIndex >= this._length) {
      this._writeIndex = 0;
    }

    // For excessive frames, the buffer will be overwritten.
    this._framesAvailable += sourceLength;
    if (this._framesAvailable > this._length) {
      this._framesAvailable = this._length;
    }
  }

  /**
   * Pull data out of buffer and fill a given sequence of Float32Arrays.
   *
   * @param  {Float32Array} arraySequence Float32Arrays.
   */
  public pull(arraySequence: Float32Array): void {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // If the FIFO is completely empty, do nothing.
    if (this._framesAvailable === 0) {
      return;
    }

    const destinationLength = arraySequence.length;

    // Transfer data from the internal buffer to the |arraySequence| storage.
    for (let i = 0; i < destinationLength; ++i) {
      const readIndex = (this._readIndex + i) % this._length;
     
        arraySequence[i] = this._body[readIndex];
    }

    this._readIndex += destinationLength;
    if (this._readIndex >= this._length) {
      this._readIndex = 0;
    }

    this._framesAvailable -= destinationLength;
    if (this._framesAvailable < 0) {
      this._framesAvailable = 0;
    }
  }
} // class RingBuffer


export {
  RENDER_QUANTUM_FRAMES,
  HeapAudioBuffer,
  RingBuffer,
};
