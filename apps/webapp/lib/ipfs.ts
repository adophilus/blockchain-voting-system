import { create } from 'ipfs-http-client'

// Create an IPFS client instance
// For production, you would use a proper IPFS gateway
// For development, we'll use a public gateway
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  // For production, you should use your own Infura project ID
  // headers: {
  //   authorization: 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
  // }
})

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // For demo purposes, we'll return a mock IPFS hash
    // In a real implementation, you would uncomment the following lines:
    
    /*
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`)
    })
    return added.path
    */
    
    // Mock implementation for demo
    console.log(`Uploading file: ${file.name}`)
    // Generate a mock IPFS hash
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    return mockHash
  } catch (error) {
    console.error('Error uploading file to IPFS:', error)
    throw new Error('Failed to upload image to IPFS')
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://ipfs.io/ipfs/${hash}`
}