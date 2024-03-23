import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, createFungible, createV1 } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { userKeypair } from "./helpers";

const umi = createUmi('https://api.devnet.solana.com');
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(userKeypair.secretKey));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    name: "Solana Gold",
    symbol: "GOLDSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    amount: 10_000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted token (", mint.publicKey, ")");
});