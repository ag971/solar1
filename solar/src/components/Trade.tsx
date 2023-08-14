
import { useState } from 'react';
import { toByteString, hash160, bsv, TestWallet, DefaultProvider } from 'scrypt-ts';
import { EnergyTradingEscrow } from '../contracts/energy';


function Trade() {

    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [buyerPubKey, setBuyerPubKey] = useState<string>('');
    const [buyerSig, setBuyerSig] = useState<string>('');
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [sellerSig, setSellerSig] = useState<string>('');
    const [sellerPubKey, setSellerPubKey] = useState<string>('');

    const deployContract = async () => {
        // Similar code to your deploy.ts script
        const privateKey = bsv.PrivateKey.fromWIF('cTNwuNVg2u24VpnY1STSuHtH8qvnGYXoygVtyGT6FUfXUgpNR4tk');
        const signer = new TestWallet(privateKey, new DefaultProvider({ network: bsv.Networks.testnet }));

        await EnergyTradingEscrow.compile();

        const sellerPubKeyHash = hash160(toByteString('seller public key', true));
        const buyerPubKeyHash = hash160(toByteString('buyer public key', true));
        const unitPrice = 1n;

        const instance = new EnergyTradingEscrow(sellerPubKeyHash, buyerPubKeyHash, unitPrice);
        await instance.connect(signer);

        const deployTx = await instance.deploy();
        console.log(`EnergyTradingEscrow contract deployed: ${deployTx.id}`);

        setContract(instance);
    };

    const buyEnergy = async () => {
        try {
            // Check if the contract instance exists
            if (!contract) {
                console.error('Contract instance is not available.');
                return;
            }

            // Ensure buyerPubKey and buyerSig are not empty
            if (!buyerPubKey || !buyerSig) {
                console.error('Buyer public key and signature are required.');
                return;
            }

            //// Perform the buyEnergy method call
            //const result = await contract.methods.buyEnergy(
            //  toByteString(buyerPubKey || '', true),
            //  toByteString(buyerSig || '', true),
            //  { //what can be additional options? }
            //);

            //console.log('Buy energy result:', result);
        } catch (error) {
            console.error('Error buying energy:', error);
        }
    };

    const depositEnergy = async () => {
        try {
            // Check if the contract instance exists
            if (!contract) {
                console.error('Contract instance is not available.');
                return;
            }

            // Ensure sellerPubKey and sellerSig are not empty
            if (!sellerPubKey || !sellerSig) {
                console.error('Seller public key and signature are required.');
                return;
            }

            //// Perform the depositEnergy method call
            //const result = await contract.methods.depositEnergy(
            //  toByteString(sellerSig || '', true),
            //  toByteString(sellerPubKey || '', true),
            //  energyAmount,
            //  { //what can be additional options? }
            //);

            //console.log('Deposit energy result:', result);
        } catch (error) {
            console.error('Error depositing energy:', error);
        }
    };
    // Similar functions for other interactions with the contract (refund, etc.)

    return (
        <div>
            <button onClick={deployContract}>Deploy Contract</button>
            <div>
                <input type="text" placeholder="Buyer Public Key" value={buyerPubKey} onChange={(e) => setBuyerPubKey(e.target.value)} />
                <input type="text" placeholder="Buyer Signature" value={buyerSig} onChange={(e) => setBuyerSig(e.target.value)} />
                <button onClick={buyEnergy}>Buy Energy</button>
            </div>
            <div>
                <input type="text" placeholder="Seller Public Key" value={sellerPubKey} onChange={(e) => setSellerPubKey(e.target.value)} />
                <input type="text" placeholder="Seller Signature" value={sellerSig} onChange={(e) => setSellerSig(e.target.value)} />
                <input type="number" placeholder="Energy Amount" value={energyAmount.toString()} onChange={(e) => setEnergyAmount(BigInt(e.target.value))} />
                <button onClick={depositEnergy}>Deposit Energy</button>
            </div>
            {/* Other UI elements for refund and other interactions */}
        </div>
    )
}




export default Trade;