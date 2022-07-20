import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

async function main () {
  const args = minimist(process.argv.slice(2))
  console.log(args);
  const token = arg.token;


  if (!token) {
    return console.error('A token is needed.')
  }

  if (args._.length < 1) {
    return console.error('Please supply the path to a file or directory')
  }

  const storage = makeStorageClient()
  const files = []

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
}
  
function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN;
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}
main()