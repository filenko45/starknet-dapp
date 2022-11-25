import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { connect, getStarknet } from "get-starknet";
import { Abi, Contract, Signature } from "starknet";
import { ReactComponent as StarknetIcon } from "./starknet.svg";
import { ReactComponent as DaiIcon } from "./dia.svg";
import { ReactComponent as EthIcon } from "./eth.svg";
import BigNumber from "bignumber.js";
import Erc20Abi from "./ERC20_Mintable_abi.json";
import { composeUInt256, parseInputAmountToUint256 } from "./utils";

function Sign() {
    const [message, setMessage] = useState<string>("");
    const [signature, setSignature] = useState<string[]>(["", ""]);

    const sign = async (
        message: string,
        network?: "goerli-alpha" | "mainnet-alpha"
    ): Promise<Signature | undefined> => {
        const wallet = getStarknet();
        return !wallet.isConnected
            ? undefined
            : wallet.account.signMessage({
                  domain: {
                      name: "StarkNet DApp",
                      chainId:
                          (network || "goerli-alpha") === "goerli-alpha"
                              ? "SN_GOERLI"
                              : "SN_MAIN",
                      version: "0.0.1",
                  },
                  types: {
                      StarkNetDomain: [
                          { name: "name", type: "felt" },
                          { name: "chainId", type: "felt" },
                          { name: "version", type: "felt" },
                      ],
                      Message: [{ name: "message", type: "felt" }],
                  },
                  primaryType: "Message",
                  message: { message },
              });
    };

    return (
        <Card sx={{ height: 355 }}>
            <CardHeader title={"Sign a Message"} />
            <CardContent>
                <Stack spacing={1}>
                    <TextField
                        value={message}
                        style={{ maxWidth: "50%" }}
                        placeholder={"Enter a message to sign"}
                        onChange={e => {
                            if (signature) {
                                // reset
                                setSignature(["", ""]);
                            }
                            setMessage(e.currentTarget.value ?? "");
                        }}
                    />
                    <Button
                        variant={"contained"}
                        disabled={!message?.trim()}
                        style={{ maxWidth: "50%" }}
                        onClick={() => {
                            sign(message)
                                .then(signature => {
                                    console.log(JSON.stringify({ signature }));
                                    setSignature(signature ?? ["", ""]);
                                })
                                .catch(err => console.error(err));
                        }}>
                        {"Sign"}
                    </Button>

                    <Box style={{ maxWidth: "100%", wordWrap: "unset" }}>
                        <List dense disablePadding>
                            <ListSubheader>{"Signature"}</ListSubheader>
                            {signature?.map((val, idx) => (
                                <ListItem key={idx === 0 ? "r" : "s"}>
                                    <ListItemText
                                        primary={`${idx === 0 ? "r" : "s"}: ${val}`}
                                        primaryTypographyProps={{ fontSize: 11 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function WatchAsset() {
    const watchAsset = async (): Promise<undefined | boolean> => {
        const wallet = getStarknet();
        return !wallet.isConnected
            ? undefined
            : wallet.request({
                  type: "wallet_watchAsset",
                  params: {
                      type: "ERC20", // The asset's interface, e.g. 'ERC20'
                      options: {
                          // The hexadecimal Ethereum address of the token contract
                          address:
                              "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9",
                          // A ticker symbol or shorthand, up to 5 alphanumerical characters
                          symbol: "DAI",
                          // The number of asset decimals
                          decimals: 18,
                          // A string url of the token logo (optional)
                          image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI0Y0QjczMSIgZmlsbC1ydWxlPSJub256ZXJvIiBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiLz48cGF0aCBkPSJNOS4yNzcgOGg2LjU1MmMzLjk4NSAwIDcuMDA2IDIuMTE2IDguMTMgNS4xOTRIMjZ2MS44NjFoLTEuNjExYy4wMzEuMjk0LjA0Ny41OTQuMDQ3Ljg5OHYuMDQ2YzAgLjM0Mi0uMDIuNjgtLjA2IDEuMDFIMjZ2MS44NmgtMi4wOEMyMi43NjcgMjEuOTA1IDE5Ljc3IDI0IDE1LjgzIDI0SDkuMjc3di01LjEzMUg3di0xLjg2aDIuMjc3di0xLjk1NEg3di0xLjg2aDIuMjc3Vjh6bTEuODMxIDEwLjg2OXYzLjQ2Mmg0LjcyYzIuOTE0IDAgNS4wNzgtMS4zODcgNi4wODUtMy40NjJIMTEuMTA4em0xMS4zNjYtMS44NkgxMS4xMDh2LTEuOTU0aDExLjM3Yy4wNDEuMzA3LjA2My42MjIuMDYzLjk0NHYuMDQ1YzAgLjMyOS0uMDIzLjY1LS4wNjcuOTY0ek0xNS44MyA5LjY2NWMyLjkyNiAwIDUuMDk3IDEuNDI0IDYuMDk4IDMuNTI4aC0xMC44MlY5LjY2Nmg0LjcyeiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=",
                      },
                  },
              });
    };

    return (
        <Card sx={{ height: 355 }}>
            <CardHeader title={"Watch Asset"} />
            <CardContent>
                <Stack sx={{ mt: 2 }} direction={"row"} alignItems={"center"}>
                    <DaiIcon width={32} style={{ marginInlineEnd: 8 }} />
                    <Typography>Add DAI to your wallet</Typography>
                </Stack>

                <Button
                    sx={{ mt: 2, width: "50%" }}
                    variant={"contained"}
                    onClick={() => watchAsset()}>
                    Add
                </Button>
            </CardContent>
        </Card>
    );
}

function Call({ network = "goerli-alpha" }: { network?: string }) {
    const [balance, setBalance] = useState<string>("");

    const token_address =
        "0x05c2dd95b456262e023c6ee54d7cdf8b078c7779986ae0ee9a72591d7d743fc3";

    const readTokenBalance = async (): Promise<string | undefined> => {
        if (!token_address) {
            return undefined;
        }

        const wallet = getStarknet();
        if (!wallet.isConnected) return undefined;

        const address = wallet.account.address;
        try {
            const result = await wallet.provider.callContract(
                {
                    contractAddress: token_address,
                    entrypoint: "balanceOf",
                    calldata: [BigInt(address).toString()],
                },
                { blockIdentifier: "pending" }
            );
            const balance = composeUInt256(result.result[0], result.result[1]);
            return balance;
        } catch {
            return undefined;
        }
    };

    return (
        <Card sx={{ height: 355 }}>
            <CardHeader title={"Call"} />
            <CardContent>
                <Stack sx={{ mt: 2 }} direction={"row"} alignItems={"center"}>
                    <EthIcon width={32} style={{ marginInlineEnd: 8 }} />
                    <Typography>Read account ETH balance</Typography>
                </Stack>

                <Button
                    sx={{ mt: 2, width: "50%" }}
                    variant={"contained"}
                    onClick={() =>
                        readTokenBalance().then(balance => setBalance(balance ?? "Error"))
                    }>
                    {"Read"}
                </Button>

                <Typography sx={{ mt: 3 }}>{`${
                    !balance
                        ? "Unknown"
                        : new BigNumber(balance).shiftedBy(-18).toFixed(6)
                }`}</Typography>
            </CardContent>
        </Card>
    );
}

function Invoke({ network = "goerli-alpha" }: { network?: string }) {
    const mint = async () => {
        const wallet = getStarknet();
        if (wallet.isConnected) {
            const contractAddress = "0x05c2dd95b456262e023c6ee54d7cdf8b078c7779986ae0ee9a72591d7d743fc3";
            if (!contractAddress) {
                return undefined;
            }

            const erc20Contract = new Contract(
                Erc20Abi as Abi,
                contractAddress,
                wallet.account
            );

            return erc20Contract.mint(
                wallet.account.address,
                parseInputAmountToUint256("0.000000000000005")
            );
        }
    };

    return (
        <Card sx={{ height: 355 }}>
            <CardHeader title={"Invoke"} />
            <CardContent>
                <Stack sx={{ mt: 2 }} direction={"row"} alignItems={"center"}>
                    <StarknetIcon width={32} style={{ marginInlineEnd: 8 }} />
                    <Typography>{"Mint demo tokens"}</Typography>
                </Stack>

                <Button
                    sx={{ mt: 2, width: "50%" }}
                    variant={"contained"}
                    onClick={() => mint()}>
                    {"Mint"}
                </Button>
            </CardContent>
        </Card>
    );
}

function Commands() {
    return (
        <Grid sx={{ padding: 4 }} container rowSpacing={8} columnSpacing={8}>
            <Grid item xs={6}>
                <Sign />
            </Grid>
            <Grid item xs={6}>
                <WatchAsset />
            </Grid>
            <Grid item xs={6}>
                <Call />
            </Grid>
            <Grid item xs={6}>
                <Invoke />
            </Grid>
        </Grid>
    );
}

function App() {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // silently attempt to connect with a pre-authorized wallet
    useEffect(() => {
        // match the dapp with a wallet instance
        connect({ showList: false }).then(wallet => {
            // connect the dapp with the chosen wallet instance
            wallet?.enable({ showModal: false }).then(() => {
                const isConnected = !!wallet?.isConnected;
                setIsConnected(isConnected);
            });
        });
    }, []);

    useEffect(() => {
        const connectedState = getStarknet().isConnected;
        if (connectedState !== isConnected) {
            setIsConnected(connectedState);
        }
    });

    return !isConnected ? (
        <Stack sx={{ padding: 5 }} direction={"column"} justifyContent={"center"}>
            <Stack direction={"row"} alignItems={"center"}>
                <StarknetIcon width={40} />
                <Typography variant={"h5"}>{"Welcome!"}</Typography>
            </Stack>

            <Box>
                <Typography variant={"body1"} sx={{ mt: 2 }}>
                    {"Please connect with your wallet"}
                </Typography>
                <Button
                    sx={{ mt: 1 }}
                    variant={"contained"}
                    onClick={async () => {
                        try {
                            // const wallet = await connect({
                            //     include: ["bravos"],
                            // });
                            await getStarknet()?.enable({
                                showModal: true,
                              });
                            const wallet = getStarknet();
                            if (wallet) {
                                await wallet.enable({ showModal: true });
                                setIsConnected(!!wallet?.isConnected);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }}>
                    {"Connect Wallet"}
                </Button>
            </Box>
        </Stack>
    ) : (
        <Commands />
    );
}

export default App;
