// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import busby from 'busboy'
import fs from "fs"

export const config = {
  api: {
    bodyParser: false
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const method = req.method;

  if (method == 'GET') {
    return getVideoStream(req, res);
  }

  if (method == 'POST') {
    return uploadVideoStream(req, res);
  }

  return res.status(500).json({ err: `method ${method} not allowed` })

}

const CHUNK_SIZE_IN_BYTE = 1000000;

const getVideoStream = (req: NextApiRequest, res: NextApiResponse) => {
  const range = req.headers.range;

  if (!range) return res.status(500).send('Range must be present')

  const videoId = req.query.videoId;

  const filePath = `./videos/${videoId}.mp4`

  const fileSizeInBytes = fs.statSync(filePath).size;

  const chunkStart = Number(range.replace(/\D/g, ""))

  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTE, fileSizeInBytes - 1)

  const contentLength = chunkEnd - chunkStart + 1

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  };

  res.writeHead(206, headers);

  const readStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd
  })

  readStream.pipe(res);



}

async function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {

  const bb = busby({ headers: req.headers })
  let fileName: string = 'NULL';

  await bb.on('file', (_, file, info) => {

    fileName = info.filename;
    // fileName = filename
    console.log('first:  ', fileName)
    const filePath = `videos/${fileName}`;

    const stream = fs.createWriteStream(filePath);

    file.pipe(stream);
    // res.end()


  })



  await bb.on('close', () => {
    res.writeHead(303, { Connection: 'close' })
    res.json({ uploaded: `uploaded ${fileName} to cloudinary`, url: req.url, fileName });
    res.end('thats all folks');
  })
  console.log('second:  ', fileName)

 

  req.pipe(bb);

  return res.end();

}