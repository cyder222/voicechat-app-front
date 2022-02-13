import React, { VideoHTMLAttributes,
    useCallback,
    useEffect,
    useState } from "react";
  
export type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
    customSrcObject: MediaProvider | null;
    playState: "start" | "stop";
};
  
const Video = ({ customSrcObject, playState, ...props }: VideoProps): JSX.Element => {
    const [node, setNode] = useState<HTMLVideoElement | null>(null);

    const refVideo = useCallback(
        (newNode: HTMLVideoElement) => {
            if(newNode){
                console.log("ref newnode");
            newNode.srcObject = customSrcObject;
            setNode(newNode);
            }
        },
        [customSrcObject],
    );

    useEffect(()=>{
            const asyncPlay = async (): Promise<void>=>{
                try{
                    await node?.play();
                }catch(e: any){
                    console.log("error on video-element");
                    console.log(e);
                    return;
                }
            };
            if(playState === "start"){
                asyncPlay();
            }else if(playState === "stop") {
                const mediaStream = node?.srcObject;
                if(mediaStream instanceof MediaStream){
                    mediaStream.getTracks().forEach((track: MediaStreamTrack)=>{
                        track.stop();
                    });
                }
            }
    },[playState, node]);


    return (
        <>
        <video ref={refVideo} {...props} />
        </>
    );
};

export default Video;

