// @ts-nocheck
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
// import contractAbi from '../../contracts/Contacts.json';
// import Web3 from 'web3';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    // const contractAddress = '0xa495a02dc0278f8233299fcb42521cefde32fcbd';
    // const web3 = new Web3(
    //     new Web3.providers.HttpProvider(
    //         `https://ropsten.infura.io/${process.env.INFURA_TOKEN}`
    //     )
    // );

    if (session) {
        // const contract = new web3.eth.Contract(contractAbi, contractAddress);
        // contract.methods
        //     .createContact(session.name, 'testPhoneNumber')
        //     .call({ from: session.account }, (err, res) => {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log(res);
        //         }
        //     });

        return res.send({ content: 'You are logged in.' });
        // return res.send({ content: session });
    }

    res.send({
        error: 'You must be signed in to view the protected content on this page.',
    });
};

export default handler;
