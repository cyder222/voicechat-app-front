### generate your api code
APIの定義からAPIのコードを自動生成しています。
APIの定義が更新されたら次のコードを打ってください

!! 初回のみ
```
docker pull openapitools/openapi-generator-cli
```


```bash
cd codegen
bash script.sh
```

### create .env file on top
トップディレクトリ配下に.envを置いてください
その中に
```
DEV_MODE="development"
```
を作成してください

### フロントを起動する
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### デプロイ
masterにマージしてpushすると、自動的にデプロイされます。

デプロイされた内容は、

トップページ：voicechat-app-front.vercel.app

ルーム：https://voicechat-app-front.vercel.app/room/bc6296-c7c9d8-3c2369

で確認できます
