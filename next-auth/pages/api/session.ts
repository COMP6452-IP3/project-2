// This is an example of how to access a session from an API route
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  res.send(JSON.stringify(session, null, 2))
}

// test

export default handler