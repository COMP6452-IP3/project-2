// Created by Spenser Tan
// 19/07/2022
// Some code from https://web3.storage/docs/
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
  files = getFiles()
  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = storeFiles(files,storage);
  console.log('Content added with CID:', cid)
}
  
function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}

function getFiles() {
  const fileInput = document.querySelector('input[type="file"]')
  return fileInput.files
}

function makeFileObjects() {
  const obj = { hello: 'world' }
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], 'hello.json')
  ]
  return files
}

async function storeFiles(files,storage) {
  const cid = await storage.put(files)
  console.log('stored files with cid:', cid)
  return cid
}
main()