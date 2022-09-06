import type {NextPage,GetServerSideProps} from 'next'
import {useRouter} from 'next/router';
import VideoPlayer from '../../components/VideoPlayer';


const VideoPage: NextPage = () => {
  const router = useRouter();

  const {videoId} = router.query as {videoId: string};

  return (
    <>
      <VideoPlayer id={videoId} />
    </>
  )
}

  export default VideoPage

export const getServerSideProps: GetServerSideProps = async (context) => {

  return {
    props: {
      query: context.query,
    }
  }
}