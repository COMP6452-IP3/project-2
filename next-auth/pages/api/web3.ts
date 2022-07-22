// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next'
import { Web3Storage } from 'web3.storage'

type Data = {
    data: any
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

// const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
//     const token = process.env.REACT_APP_API_TOKEN;

//     // Construct with token and endpoint
//     const client = new Web3Storage({ token })

//     const fileInput = document.querySelector('input[type="file"]')

//     // Pack files into a CAR and send to web3.storage
//     const rootCid = await client.put(fileInput.files) // Promise<CIDString>

//     // Get info on the Filecoin deals that the CID is stored in
//     const info = await client.status(rootCid) // Promise<Status | undefined>

//     // Fetch and verify files from web3.storage
//     const result = await client.get(rootCid) // Promise<Web3Response | null>
//     const files = await result.files() // Promise<Web3File[]>

//     for (const file of files) {
//         console.log(`${file.cid} ${file.name} ${file.size}`)
//     }
// }

export const getAccessToken = () => {
    return process.env.WEB3_TOKEN;
}
  
export const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() })
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const cid = 'bafybeibg2skeotp5ujtogaetp3akp6pvxjdegwcsqkxdfzfhtb4ja2gjby'
    const client = makeStorageClient()
    const status : any = await client.status(cid)
    console.log(status)
    if (status) {
        res.status(200).json(status)
    }
}

export default handler;
