import React, { useEffect, useState } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import axios from "axios";
import { getUserOnBoardFromCookie,setUserOnBoardCookie,removeUserOnBoardCookie } from "../userCookie";
//Import all above libraries


export default function Home() {

    const [nftData, setNftData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(false)
    const ownerToken = getUserOnBoardFromCookie()

    console.log(ownerToken)
    //Define getProvider function here
    const getProvider = () => {
        if ("solana" in window) {
            console.log(window.solana)
            const provider = window.solana;
            if (provider.isPhantom) {
                return provider;
            }
        }
    };
    //create a connection of devnet
    const createConnection = async () => {

            const provider = getProvider();
            await provider.connect();
            let ownerToken = provider.publicKey;
            if(isValidSolanaAddress(ownerToken)){
                setUserOnBoardCookie(ownerToken)
                setResult(true)
            }
            
    };
    const disConnection = async () => {

        const provider = getProvider();
        await provider.disconnect();
        removeUserOnBoardCookie()
        setResult(false)
};
    //Define getAllNftData function here
    const getAllNftData = async () => {
        try {
            const connect = createConnectionConfig(clusterApiUrl("devnet"));
            const result = isValidSolanaAddress(ownerToken);
            console.log("result", result);
            const nftData = await getParsedNftAccountsByOwner({
                publicAddress: ownerToken,
                connection: connect,
                serialization: true,
            });
            var data = Object.keys(nftData).map((key) => nftData[key]);
            let arr = [];
            let n = data.length;
            for (let i = 0; i < n; i++) {
                let val = await axios.get(data[i].data.uri);
                arr.push(val);
            }
            return arr;

        } catch (error) {
            console.log(error);
        }
    };
console.log(ownerToken)

    useEffect(() => {

        if(ownerToken){

            async function data() {
                let res = await getAllNftData();
                setNftData(res);
                setLoading(true);
            }
            data();
        }
        else{

                setNftData([]);
                setLoading(true);
        }

    }, [result]);


    return (
        <div className="pb-5">
            <div className="col-12 d-grid grid-dir mt-5">
                <h2 className=" offset-3">Esaiyo <span className="text-blue f-600">NFT</span></h2>
                <a className="btn btn-primary p-5 offset-8" onClick={ownerToken?disConnection:createConnection}>{ownerToken?"Disconnect":"Connect"}</a>
            </div>
            {
                ownerToken &&

                <>
                    <h5 className="text-center  mt-5">Wallet Address<p className="text-success">{ownerToken}</p></h5>
                </>


            }
            
            <div className=" mt-5 ">
                <section >
                    <div>
                        <div className="row text-center">
                            <div className="col-12">
                                <h1 className="title">NFT</h1>
                            </div>
                        </div>
                        <div className="row  d-flex justify-content-center">
                            {loading ? (
                                <div className="nftbox gap-4">
                                    {nftData &&
                                        nftData.length > 0 &&
                                        nftData.map((val, ind) => {
                                            return (
                                                <div className=" mt-3 nft rounded " key={ind} style={{border:"1px solid grey"}}>
                                                    <div className="cart text-center">
                                                        <div className="img mt-4 " >
                                                            <img src={val.data.image} alt="loading..." className="col-5 mt-5" />
                                                            <div className="title-box"  >
                                                            <p className="mt-1">{val.data.name}</p>
                                                            <h6 className="mt-2">
                                                                {val.data.description}
                                                            </h6>
                                                            </div>    
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : (
                                <>
                                    <p className="text-center">loading...</p>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <div>
                <div className="col-3 rounded selection-box text-center">
                    <h3 className="text-blue">Transfer NFTs between <br />Blockchains</h3>
                    <div className="select-box">
                    <select className="col-11 text-center">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                        <option>Option 4</option>
                    </select>
                    <select className="col-11 text-center">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                        <option>Option 4</option>
                    </select>
                    
                    </div>
                    <button className=" col-11 burn-button">Burn</button>
                </div>
            </div>
        </div>
    )
}
