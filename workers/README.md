# 音声変換周りの処理がおいてあるフォルダ

worker-audio-worker.ts    ワーカー

worker-audio-worklet.ts   ワークレット

share/worker-config.ts    ワーカーの設定

share/worker-events.ts    ワーカーとワークレットの通信で使うメッセージの定義

lib/WorldJS.js            WorldJSリポジトリから生成したWorldをJSから呼び出すためのJS

lib/ort-wasm-*            onnxruntime-for-webを動かすためのwasm

lib/ppgvc_multi.onnx      音質変換のモデル。gteuさんのRealtimePPGVCのプログラムにCSUITデータセット + JVSデータセットで生成

lib/scale/asr_scaler.json 音声認識のscaler

lib/scale/vc-multi_scaler.json  音声生成のscaler

lib/scale/f0_jvs.json     jvsの各話者の平均f0値が入っている
