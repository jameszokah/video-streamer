import { FC } from "react"

interface IVideo {
  id: string
}
const VideoPlayer: FC<IVideo> = ({ id }) => {

  return (
    <>
      <section style={{
        background: '#12013a',
        height: '100vh', color: '#fff'
      }}>

        <video
          src={`/api/video?videoId=${id}`}
          id="video-palyer"
          width='800'
          heigth='auto'
          autoPlay
          controls
        />
      </section>
    </>
  )
}

export default VideoPlayer;